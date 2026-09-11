/* ==========================================================================
   Match engine — zone-based possession simulation.

   Not a physics sim: the ball has a continuous field position (0 = home goal,
   1 = away goal) and one team is in possession. Each tick resolves one
   contested action (pass / carry / tackle / shot) weighted by the two sides'
   ratings. Player markers are then positioned from their formation slot,
   shifted by where the ball is — enough to read as a live match on the pitch
   and the radar, without the cost of a real physics engine.
   ========================================================================== */
import { startingXI } from '../data/players.js'
import { clubById } from '../data/clubs.js'

export const FORMATIONS = {
  '4-4-2': [[0.085, 0.5], [0.22, 0.18], [0.2, 0.39], [0.2, 0.61], [0.22, 0.82],
            [0.45, 0.15], [0.42, 0.4], [0.42, 0.6], [0.45, 0.85], [0.72, 0.38], [0.72, 0.62]],
  '4-3-3': [[0.085, 0.5], [0.22, 0.16], [0.2, 0.38], [0.2, 0.62], [0.22, 0.84],
            [0.42, 0.28], [0.4, 0.5], [0.42, 0.72], [0.72, 0.18], [0.76, 0.5], [0.72, 0.82]],
  '3-5-2': [[0.085, 0.5], [0.2, 0.3], [0.18, 0.5], [0.2, 0.7], [0.42, 0.1],
            [0.44, 0.34], [0.4, 0.5], [0.44, 0.66], [0.42, 0.9], [0.72, 0.38], [0.72, 0.62]],
  '5-3-2': [[0.085, 0.5], [0.2, 0.12], [0.17, 0.34], [0.16, 0.5], [0.17, 0.66],
            [0.2, 0.88], [0.42, 0.3], [0.4, 0.5], [0.42, 0.7], [0.7, 0.38], [0.7, 0.62]],
  '4-2-3-1': [[0.085, 0.5], [0.22, 0.16], [0.2, 0.38], [0.2, 0.62], [0.22, 0.84],
              [0.38, 0.38], [0.38, 0.62], [0.58, 0.2], [0.6, 0.5], [0.58, 0.8], [0.8, 0.5]],
}

export const FORMATION_NAMES = Object.keys(FORMATIONS)

const rnd = () => Math.random()
const pick = (arr) => arr[Math.floor(rnd() * arr.length)]

const teamStrength = (club) => ({
  att: club.att / 100,
  mid: club.mid / 100,
  def: club.def / 100,
})

export function createMatch(homeId, awayId, opts = {}) {
  const home = clubById(homeId)
  const away = clubById(awayId)
  return {
    home,
    away,
    homeXI: startingXI(homeId),
    awayXI: startingXI(awayId),
    formations: { home: opts.homeFormation || '4-3-3', away: '4-4-2' },
    minute: 0,
    added: 0,
    score: { home: 0, away: 0 },
    // ballX: 0 = home's own goal line, 1 = away's goal line. ballY: 0..1 across.
    ball: { x: 0.5, y: 0.5 },
    possession: rnd() < 0.5 ? 'home' : 'away',
    events: [],
    stats: {
      home: { poss: 0, shots: 0, sot: 0, passes: 0, tackles: 0, fouls: 0, corners: 0, yellow: 0, red: 0 },
      away: { poss: 0, shots: 0, sot: 0, passes: 0, tackles: 0, fouls: 0, corners: 0, yellow: 0, red: 0 },
    },
    ratings: {},
    phase: 'first',   // first | half | second | full
    finished: false,
  }
}

const other = (side) => (side === 'home' ? 'away' : 'home')

function attackers(m, side) {
  const xi = side === 'home' ? m.homeXI : m.awayXI
  return xi.filter((p) => ['ST', 'LW', 'RW', 'CM'].includes(p.role))
}

function log(m, type, side, text, player) {
  m.events.unshift({ id: `${m.minute}-${m.events.length}`, minute: m.minute, type, side, text, player })
}

function bumpRating(m, player, delta) {
  if (!player) return
  const cur = m.ratings[player.id] ?? 6.0
  m.ratings[player.id] = Math.max(3, Math.min(10, cur + delta))
}

/** Resolve a single contested action. Returns true if a goal was scored. */
function action(m) {
  const inPoss = m.possession
  const def = other(inPoss)
  const A = teamStrength(inPoss === 'home' ? m.home : m.away)
  const D = teamStrength(def === 'home' ? m.home : m.away)

  m.stats[inPoss].poss += 1

  // Attacking direction: home pushes ballX up, away pushes it down.
  const dir = inPoss === 'home' ? 1 : -1
  const progress = 0.04 + rnd() * 0.16 * (A.mid / D.mid)

  const contest = A.mid / (A.mid + D.def)
  const roll = rnd()

  if (roll < contest * 0.72) {
    // Ball progresses.
    m.ball.x = Math.max(0.02, Math.min(0.98, m.ball.x + progress * dir))
    m.ball.y = Math.max(0.06, Math.min(0.94, m.ball.y + (rnd() - 0.5) * 0.3))
    m.stats[inPoss].passes += 1 + Math.floor(rnd() * 4)

    const finalThird = inPoss === 'home' ? m.ball.x > 0.74 : m.ball.x < 0.26
    if (finalThird && rnd() < 0.42) {
      // Shot.
      const shooter = pick(attackers(m, inPoss))
      m.stats[inPoss].shots += 1
      const quality = (shooter.attrs.sho / 100) * 0.62 + A.att * 0.38
      const keeperSave = D.def * 0.78
      if (rnd() < quality * 0.62) {
        m.stats[inPoss].sot += 1
        if (rnd() < quality - keeperSave * 0.66) {
          m.score[inPoss] += 1
          bumpRating(m, shooter, 1.2)
          log(m, 'goal', inPoss, 'GOAL', shooter)
          m.ball = { x: 0.5, y: 0.5 }
          m.possession = def
          return true
        }
        log(m, 'save', inPoss, 'Saved', shooter)
      } else if (rnd() < 0.4) {
        m.stats[inPoss].corners += 1
        log(m, 'corner', inPoss, 'Corner', shooter)
      }
      bumpRating(m, shooter, 0.05)
      m.possession = def
      m.ball.x = inPoss === 'home' ? 0.2 : 0.8
    }
  } else if (roll < contest * 0.72 + 0.2) {
    // Turnover: the defending side wins it back.
    const tackler = pick((def === 'home' ? m.homeXI : m.awayXI).filter((p) => p.role !== 'GK'))
    m.stats[def].tackles += 1
    bumpRating(m, tackler, 0.08)
    m.possession = def
  } else if (roll < contest * 0.72 + 0.26) {
    // Foul, with a chance of a card.
    const offender = pick((def === 'home' ? m.homeXI : m.awayXI).filter((p) => p.role !== 'GK'))
    m.stats[def].fouls += 1
    bumpRating(m, offender, -0.1)
    const cardRoll = rnd()
    if (cardRoll < 0.16) {
      m.stats[def].yellow += 1
      bumpRating(m, offender, -0.3)
      log(m, 'yellow', def, 'Yellow card', offender)
    } else if (cardRoll < 0.175) {
      m.stats[def].red += 1
      bumpRating(m, offender, -1.5)
      log(m, 'red', def, 'Red card', offender)
    }
    m.possession = inPoss
  } else {
    // Scrappy phase — ball drifts, possession flips.
    m.ball.x = Math.max(0.05, Math.min(0.95, m.ball.x - progress * dir * 0.5))
    m.possession = def
  }
  return false
}

/** Advance the match by one minute. Mutates and returns the match. */
export function tick(m) {
  if (m.finished) return m
  m.minute += 1

  // A minute of football is several contested actions, not one.
  for (let i = 0; i < 3; i++) {
    if (action(m)) break
  }

  if (m.minute === 45 && m.phase === 'first') {
    m.phase = 'half'
    m.ball = { x: 0.5, y: 0.5 }
    log(m, 'whistle', null, 'Half time')
  }
  if (m.minute >= 90) {
    m.phase = 'full'
    m.finished = true
    log(m, 'whistle', null, 'Full time')
  }
  return m
}

/** Possession as a percentage split that always sums to 100. */
export function possessionPct(m) {
  const total = m.stats.home.poss + m.stats.away.poss
  if (!total) return { home: 50, away: 50 }
  const h = Math.round((m.stats.home.poss / total) * 100)
  return { home: h, away: 100 - h }
}

/** Marker positions for both teams, pulled toward the ball. */
export function playerPositions(m) {
  const out = []
  for (const side of ['home', 'away']) {
    const xi = side === 'home' ? m.homeXI : m.awayXI
    const slots = FORMATIONS[m.formations[side]]
    const attacking = m.possession === side
    xi.forEach((p, i) => {
      const [fx, fy] = slots[i]
      // Away plays right-to-left, so mirror its formation.
      const baseX = side === 'home' ? fx : 1 - fx
      const shift = (m.ball.x - 0.5) * (p.role === 'GK' ? 0.06 : attacking ? 0.34 : 0.28)
      const drawY = fy + (m.ball.y - 0.5) * (p.role === 'GK' ? 0.15 : 0.3)
      out.push({
        player: p,
        side,
        x: Math.max(0.02, Math.min(0.98, baseX + shift)),
        y: Math.max(0.04, Math.min(0.96, drawY)),
      })
    })
  }
  return out
}

export function manOfTheMatch(m) {
  const all = [...m.homeXI, ...m.awayXI]
  let best = all[0]
  let bestScore = -1
  for (const p of all) {
    const r = m.ratings[p.id] ?? 6.0
    if (r > bestScore) { bestScore = r; best = p }
  }
  return { player: best, rating: bestScore.toFixed(1) }
}
