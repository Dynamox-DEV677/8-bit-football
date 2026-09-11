import { useCallback, useEffect } from 'react'
import { CLUBS, overall } from '../data/clubs.js'
import Crest from '../components/Crest.jsx'
import ArcMeter from '../components/ArcMeter.jsx'

export default function TeamSelect({ clubId, setClubId, go }) {
  const index = CLUBS.findIndex((c) => c.id === clubId)
  const club = CLUBS[index]

  const move = useCallback((delta) => {
    const next = (index + delta + CLUBS.length) % CLUBS.length
    setClubId(CLUBS[next].id)
  }, [index, setClubId])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') { e.preventDefault(); move(1) }
      if (e.key === 'ArrowLeft') { e.preventDefault(); move(-1) }
      if (e.key === 'Enter') go('squad')
      if (e.key === 'Escape') go('menu')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [move, go])

  return (
    <div className="screen team-select">
      {/* Colour wash behind everything — animates as the club changes, so the
          retheme reads as a transition rather than a snap. */}
      <div className="team-wash" aria-hidden="true" />

      <header className="bar">
        <button className="btn btn-ghost" onClick={() => go('menu')}><span>← Menu</span></button>
        <div className="label">Select your club · {index + 1} of {CLUBS.length}</div>
      </header>

      <div className="ts-stage">
        <button className="ts-arrow" onClick={() => move(-1)} aria-label="Previous club">‹</button>

        <div className="ts-hero" key={club.id}>
          <Crest club={club} size={196} className="ts-crest" />
          <div className="ts-city label">{club.city}</div>
          <h1 className="ts-name">{club.name}</h1>
          <div className="ts-abbr display">{club.abbr}</div>

          <div className="ts-meters">
            <ArcMeter value={club.att} label="Attack" />
            <ArcMeter value={club.mid} label="Midfield" />
            <ArcMeter value={club.def} label="Defence" />
            <ArcMeter value={overall(club)} label="Overall" size={112} />
          </div>

          <button className="btn ts-confirm" onClick={() => go('squad')}>
            <span>Manage {club.abbr} →</span>
          </button>
        </div>

        <button className="ts-arrow" onClick={() => move(1)} aria-label="Next club">›</button>
      </div>

      <div className="ts-rail" role="tablist" aria-label="Clubs">
        {CLUBS.map((c, i) => (
          <button key={c.id} role="tab" aria-selected={i === index}
            className={`ts-chip ${i === index ? 'is-active' : ''}`}
            onClick={() => setClubId(c.id)} title={c.name}>
            <Crest club={c} size={34} />
          </button>
        ))}
      </div>
    </div>
  )
}
