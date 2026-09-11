import { useEffect, useState } from 'react'
import { possessionPct, manOfTheMatch } from '../engine/match.js'
import Crest from '../components/Crest.jsx'
import CountUp from '../components/CountUp.jsx'

const ROWS = [
  ['poss', 'Possession %'],
  ['shots', 'Shots'],
  ['sot', 'Shots on target'],
  ['passes', 'Passes'],
  ['tackles', 'Tackles'],
  ['fouls', 'Fouls'],
  ['corners', 'Corners'],
  ['yellow', 'Yellow cards'],
]

export default function FullTime({ match, go }) {
  const [shown, setShown] = useState(0)

  // Bars fill in sequence, not all at once.
  useEffect(() => {
    if (!match) return
    const id = setInterval(() => setShown((n) => (n >= ROWS.length ? n : n + 1)), 130)
    return () => clearInterval(id)
  }, [match])

  if (!match) {
    return (
      <div className="screen ft">
        <p className="ft-empty">No match played yet.</p>
        <button className="btn" onClick={() => go('menu')}><span>← Menu</span></button>
      </div>
    )
  }

  const poss = possessionPct(match)
  const motm = manOfTheMatch(match)
  const motmClub = motm.player.clubId === match.home.id ? match.home : match.away

  const valueFor = (key, side) => (key === 'poss' ? poss[side] : match.stats[side][key])

  return (
    <div className="screen ft">
      <header className="ft-head">
        <div className="ft-team">
          <Crest club={match.home} size={64} />
          <div className="ft-team-name display">{match.home.name}</div>
        </div>
        <div className="ft-score">
          <div className="label">Full Time</div>
          <div className="ft-score-num score display">
            <CountUp to={match.score.home} duration={500} />
            <em>–</em>
            <CountUp to={match.score.away} duration={500} />
          </div>
        </div>
        <div className="ft-team">
          <Crest club={match.away} size={64} />
          <div className="ft-team-name display">{match.away.name}</div>
        </div>
      </header>

      <div className="divider ft-divider" />

      <section className="ft-stats">
        {ROWS.map(([key, label], i) => {
          const h = valueFor(key, 'home')
          const a = valueFor(key, 'away')
          const total = h + a || 1
          const on = i < shown
          return (
            <div className="cmp" key={key}>
              <span className="cmp-val num">{on ? h : 0}</span>
              <div className="cmp-bars">
                <div className="cmp-label label">{label}</div>
                <div className="cmp-track">
                  <i className="cmp-home" style={{
                    width: on ? `${(h / total) * 100}%` : 0, background: match.home.primary,
                  }} />
                  <i className="cmp-away" style={{
                    width: on ? `${(a / total) * 100}%` : 0, background: match.away.primary,
                  }} />
                </div>
              </div>
              <span className="cmp-val num">{on ? a : 0}</span>
            </div>
          )
        })}
      </section>

      <section className="motm skew-card">
        <div>
          <div className="label">Man of the Match</div>
          <div className="motm-name display">{motm.player.name}</div>
          <div className="label">{motm.player.flag} {motmClub.name} · {motm.player.role}</div>
        </div>
        <div className="motm-rating">
          <CountUp to={Number(motm.rating)} decimals={1} className="motm-num" />
        </div>
        <Crest club={motmClub} size={56} />
      </section>

      <div className="ft-actions">
        <button className="btn" onClick={() => go('table')}><span>League Table →</span></button>
        <button className="btn btn-ghost" onClick={() => go('menu')}><span>Menu</span></button>
      </div>
    </div>
  )
}
