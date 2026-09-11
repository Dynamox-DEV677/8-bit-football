import { useEffect, useMemo, useState } from 'react'
import { startingXI } from '../data/players.js'
import { FORMATIONS, FORMATION_NAMES } from '../engine/match.js'
import PlayerCardDetail from '../components/PlayerCardDetail.jsx'
import Crest from '../components/Crest.jsx'
import Pitch from '../components/Pitch.jsx'

export default function Squad({ club, formation, setFormation, lineup, setLineup, go }) {
  const xi = useMemo(() => startingXI(club.id), [club.id])

  // `order` holds player ids per formation slot, so dragging swaps slots.
  const [order, setOrder] = useState(() => lineup || xi.map((p) => p.id))
  useEffect(() => { setOrder(xi.map((p) => p.id)) }, [xi])
  useEffect(() => { setLineup(order) }, [order, setLineup])

  const [dragFrom, setDragFrom] = useState(null)
  const [selected, setSelected] = useState(null)

  const byId = useMemo(() => Object.fromEntries(xi.map((p) => [p.id, p])), [xi])
  const slots = FORMATIONS[formation]

  const swap = (from, to) => {
    if (from === null || from === to) return
    setOrder((o) => {
      const next = [...o]
      ;[next[from], next[to]] = [next[to], next[from]]
      return next
    })
  }

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') (selected ? setSelected(null) : go('menu')) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [selected, go])

  return (
    <div className="screen squad">
      <header className="bar">
        <button className="btn btn-ghost" onClick={() => go('menu')}><span>← Menu</span></button>
        <div className="bar-title">
          <Crest club={club} size={28} />
          <h2 className="bar-name">{club.name} <span className="bar-sub">— Starting XI</span></h2>
        </div>
        <button className="btn" onClick={() => go('match')}><span>Kick Off →</span></button>
      </header>

      <div className="formation-row">
        <span className="label">Formation</span>
        {FORMATION_NAMES.map((f) => (
          <button key={f} className={`chip ${f === formation ? 'is-active' : ''}`}
            onClick={() => setFormation(f)}>
            <span>{f}</span>
          </button>
        ))}
        <span className="label squad-hint">Drag a player onto another to swap positions</span>
      </div>

      <div className="squad-body">
        <div className="squad-pitch-wrap">
          <Pitch vertical>
            {order.map((pid, slot) => {
              const p = byId[pid]
              const [fx, fy] = slots[slot]
              if (!p) return null
              return (
                <div
                  key={pid}
                  className={`pmark ${dragFrom === slot ? 'is-dragging' : ''}`}
                  style={{
                    left: `${fy * 100}%`,
                    top: `${(1 - fx) * 100}%`,
                    transitionDelay: `${slot * 22}ms`,
                  }}
                  draggable
                  onDragStart={() => setDragFrom(slot)}
                  onDragEnd={() => setDragFrom(null)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => { swap(dragFrom, slot); setDragFrom(null) }}
                  onClick={() => setSelected(p)}
                  title={`${p.name} — ${p.role}`}
                >
                  <span className="pmark-num num">{p.number}</span>
                  <span className="pmark-name display">{p.name.split(' ').pop()}</span>
                  <span className="pmark-ovr num">{p.ovr}</span>
                </div>
              )
            })}
          </Pitch>
        </div>

        <aside className="squad-list scrollable">
          {order.map((pid, slot) => {
            const p = byId[pid]
            if (!p) return null
            return (
              <button key={pid} className="pcard skew-card" onClick={() => setSelected(p)}>
                <span className="pcard-num num">{p.number}</span>
                <span className="pcard-body">
                  <span className="pcard-name display">{p.name}</span>
                  <span className="pcard-meta">
                    <span className="pos-badge">{FORMATION_ROLE(formation, slot)}</span>
                    <span className="label">{p.flag} {p.nation}</span>
                  </span>
                </span>
                <span className="pcard-ovr num">{p.ovr}</span>
              </button>
            )
          })}
        </aside>
      </div>

      <PlayerCardDetail player={selected} club={club} onClose={() => setSelected(null)} />
    </div>
  )
}

// The slot's role comes from the formation shape, not the player's stored role,
// so moving someone up the pitch relabels them.
function FORMATION_ROLE(formation, slot) {
  const [, y] = FORMATIONS[formation][slot]
  const x = FORMATIONS[formation][slot][0]
  if (slot === 0) return 'GK'
  if (x < 0.3) return y < 0.3 ? 'LB' : y > 0.7 ? 'RB' : 'CB'
  if (x < 0.55) return y < 0.25 ? 'LM' : y > 0.75 ? 'RM' : 'CM'
  if (x < 0.75) return y < 0.3 ? 'LW' : y > 0.7 ? 'RW' : 'AM'
  return 'ST'
}
