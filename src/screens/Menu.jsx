import { useEffect, useRef, useState } from 'react'
import Wordmark from '../components/Wordmark.jsx'
import Crest from '../components/Crest.jsx'

const ITEMS = [
  { key: 'teams', label: 'Select Club', note: 'Choose who you manage' },
  { key: 'squad', label: 'Squad & Formation', note: 'Shape the starting XI' },
  { key: 'match', label: 'Play Match', note: 'Kick off the next fixture' },
  { key: 'table', label: 'League Table', note: 'Standings and form' },
]

export default function Menu({ club, go }) {
  const [focus, setFocus] = useState(0)
  const refs = useRef([])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setFocus((f) => (f + 1) % ITEMS.length) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setFocus((f) => (f - 1 + ITEMS.length) % ITEMS.length) }
      if (e.key === 'Enter') go(ITEMS[focus].key)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [focus, go])

  useEffect(() => { refs.current[focus]?.focus() }, [focus])

  return (
    <div className="screen menu">
      <div className="stadium-light" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <header className="menu-head">
        <Wordmark />
        <div className="menu-club">
          <Crest club={club} size={40} />
          <div>
            <div className="label">Managing</div>
            <div className="display menu-club-name">{club.name}</div>
          </div>
        </div>
      </header>

      <nav className="menu-list" aria-label="Main menu">
        {ITEMS.map((item, i) => (
          <button
            key={item.key}
            ref={(el) => (refs.current[i] = el)}
            className={`menu-item ${i === focus ? 'is-active' : ''}`}
            onMouseEnter={() => setFocus(i)}
            onFocus={() => setFocus(i)}
            onClick={() => go(item.key)}
          >
            <span className="menu-item-inner">
              <span className="menu-index num">{String(i + 1).padStart(2, '0')}</span>
              <span className="menu-label display">{item.label}</span>
              <span className="menu-note">{item.note}</span>
            </span>
          </button>
        ))}
      </nav>

      <footer className="menu-foot">
        <span className="label">Arrow keys to navigate · Enter to select</span>
        <span className="label">Original fictional league · No real clubs or players</span>
      </footer>
    </div>
  )
}
