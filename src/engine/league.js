// League state: a 20-club table the user's results feed into. Fixtures the
// user isn't involved in are simulated so the table moves around them.
import { CLUBS } from '../data/clubs.js'
import { createMatch, tick } from './match.js'

const blankRow = (club) => ({
  id: club.id, p: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, pts: 0, form: [],
})

export function newSeason() {
  return { rows: Object.fromEntries(CLUBS.map((c) => [c.id, blankRow(c)])), round: 0 }
}

function record(row, gf, ga) {
  row.p += 1
  row.gf += gf
  row.ga += ga
  if (gf > ga) { row.w += 1; row.pts += 3; row.form.push('W') }
  else if (gf === ga) { row.d += 1; row.pts += 1; row.form.push('D') }
  else { row.l += 1; row.form.push('L') }
  row.form = row.form.slice(-5)
}

export function applyResult(season, homeId, awayId, hg, ag) {
  const rows = { ...season.rows }
  rows[homeId] = { ...rows[homeId], form: [...rows[homeId].form] }
  rows[awayId] = { ...rows[awayId], form: [...rows[awayId].form] }
  record(rows[homeId], hg, ag)
  record(rows[awayId], ag, hg)
  return { ...season, rows, round: season.round + 1 }
}

/** Pair up every club not already involved and sim those fixtures headlessly. */
export function simulateOtherFixtures(season, exclude) {
  const pool = CLUBS.map((c) => c.id).filter((id) => !exclude.includes(id))
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  let s = season
  for (let i = 0; i + 1 < pool.length; i += 2) {
    const m = createMatch(pool[i], pool[i + 1])
    while (!m.finished) tick(m)
    s = applyResult(s, pool[i], pool[i + 1], m.score.home, m.score.away)
  }
  return { ...s, round: season.round + 1 }
}

export function standings(season) {
  return Object.values(season.rows).sort(
    (a, b) => b.pts - a.pts || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf || a.id.localeCompare(b.id),
  )
}
