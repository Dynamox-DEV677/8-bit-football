import { useEffect, useState } from 'react'

/** Radial arc meter for club attributes — fills from zero on mount. */
export default function ArcMeter({ value, label, size = 96 }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setV(value); return }
    const id = requestAnimationFrame(() => setV(value))
    return () => cancelAnimationFrame(id)
  }, [value])

  const r = 38
  const circ = 2 * Math.PI * r
  const arc = circ * 0.75                      // three-quarter dial
  const offset = arc - (v / 100) * arc

  return (
    <div className="arc" style={{ width: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <g transform="rotate(135 50 50)">
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="8"
            strokeDasharray={`${arc} ${circ}`} strokeLinecap="butt" />
          <circle cx="50" cy="50" r={r} fill="none" stroke="var(--accent)" strokeWidth="8"
            strokeDasharray={`${arc} ${circ}`} strokeDashoffset={offset} strokeLinecap="butt"
            style={{ transition: 'stroke-dashoffset 600ms cubic-bezier(.22,.9,.25,1)' }} />
        </g>
        <text x="50" y="56" textAnchor="middle" className="arc-val num">{Math.round(v)}</text>
      </svg>
      <div className="label arc-label">{label}</div>
    </div>
  )
}
