import { useEffect, useMemo, useRef, useState } from 'react'
import { CLUBS } from '../data/clubs.js'
import { createMatch, tick, playerPositions, possessionPct } from '../engine/match.js'
import Pitch from '../components/Pitch.jsx'
import Radar from '../components/Radar.jsx'
import Crest from '../components/Crest.jsx'

const SPEEDS = [
  { label: '1×', ms: 900 },
  { label: '2×', ms: 450 },
  { label: '4×', ms: 220 },
]

export default function MatchScreen({ club, formation, onFinish, go }) {
  // Opponent is the next club along, so every user club gets a real fixture.
  const opponent = useMemo(() => {
    const i = CLUBS.findIndex((c) => c.id === club.id)
    return CLUBS[(i + 7) % CLUBS.length]
  }, [club.id])

  const matchRef = useRef(null)
  if (!matchRef.current || matchRef.current.home.id !== club.id) {
    matchRef.current = createMatch(club.id, opponent.id, { homeFormation: formation })
  }

  const [, force] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [paused, setPaused] = useState(false)
  const [goalFlash, setGoalFlash] = useState(null)
  const finishedRef = useRef(false)   // full time must settle the result exactly once
  const m = matchRef.current

  useEffect(() => {
    if (m.finished || paused) return
    const id = setInterval(() => {
      const before = m.score.home + m.score.away
      tick(m)
      if (m.score.home + m.score.away > before) {
        const goal = m.events.find((e) => e.type === 'goal')
        setGoalFlash(goal)
        setTimeout(() => setGoalFlash(null), 2200)
      }
      force((n) => n + 1)
      if (m.finished && !finishedRef.current) {
        finishedRef.current = true
        clearInterval(id)
        setTimeout(() => onFinish(m), 900)
      }
    }, SPEEDS[speed].ms)
    return () => clearInterval(id)
  }, [m, paused, speed, onFinish])

  const positions = playerPositions(m)
  const poss = possessionPct(m)
  const ticker = m.events.filter((e) => e.type !== 'save').slice(0, 4)

  return (
    <div className="screen match">
      <Pitch>
        {positions.map((p) => (
          <span key={`${p.side}-${p.player.id}`}
            className={`dot ${p.side}`}
            style={{
              left: `${p.x * 100}%`,
              top: `${p.y * 100}%`,
              background: p.side === 'home' ? m.home.primary : m.away.primary,
              borderColor: p.side === 'home' ? m.home.secondary : m.away.secondary,
            }}>
            <b className="num">{p.player.number}</b>
          </span>
        ))}
        <span className="ball" style={{ left: `${m.ball.x * 100}%`, top: `${m.ball.y * 100}%` }} />
      </Pitch>

      {/* SCORE BUG */}
      <div className="bug">
        <div className="bug-side">
          <Crest club={m.home} size={26} />
          <span className="bug-abbr display">{m.home.abbr}</span>
        </div>
        <div className="bug-score score display">
          {m.score.home}<em>–</em>{m.score.away}
        </div>
        <div className="bug-side">
          <span className="bug-abbr display">{m.away.abbr}</span>
          <Crest club={m.away} size={26} />
        </div>
        <div className="bug-clock clock display">{String(m.minute).padStart(2, '0')}'</div>
      </div>

      {/* POSSESSION */}
      <div className="poss-bar" title="Possession">
        <i style={{ width: `${poss.home}%`, background: m.home.primary }} />
        <i style={{ width: `${poss.away}%`, background: m.away.primary }} />
        <span className="poss-label label">{poss.home}% possession {poss.away}%</span>
      </div>

      <Radar positions={positions} ball={m.ball}
        homeColor={m.home.primary} awayColor={m.away.primary} />

      {/* LOWER THIRDS */}
      <div className="ticker">
        {ticker.map((e) => (
          <div key={e.id} className={`lower-third lt-${e.type}`}>
            <span className="lt-min num">{e.minute}'</span>
            <span className="lt-text display">{e.text}</span>
            {e.player && <span className="lt-player">{e.player.name}</span>}
          </div>
        ))}
      </div>

      <div className="match-ctl">
        <button className="btn btn-ghost" onClick={() => go('menu')}><span>Quit</span></button>
        <button className="btn btn-ghost" onClick={() => setPaused((p) => !p)}>
          <span>{paused ? 'Resume' : 'Pause'}</span>
        </button>
        {SPEEDS.map((s, i) => (
          <button key={s.label} className={`chip ${i === speed ? 'is-active' : ''}`}
            onClick={() => setSpeed(i)}><span>{s.label}</span></button>
        ))}
      </div>

      {/* GOAL TAKEOVER */}
      {goalFlash && (
        <div className="goal-takeover" style={{
          '--goal-color': goalFlash.side === 'home' ? m.home.primary : m.away.primary,
        }}>
          <div className="goal-word display">GOAL</div>
          <div className="goal-scorer display">{goalFlash.player?.name}</div>
          <div className="goal-min label">{goalFlash.minute}′ · {goalFlash.side === 'home' ? m.home.name : m.away.name}</div>
        </div>
      )}
    </div>
  )
}
