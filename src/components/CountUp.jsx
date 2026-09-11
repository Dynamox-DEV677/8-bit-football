import { useEffect, useRef, useState } from 'react'

/** Numbers count up rather than appearing. Respects reduced-motion. */
export default function CountUp({ to, duration = 700, decimals = 0, className = '' }) {
  const [val, setVal] = useState(0)
  const raf = useRef(0)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setVal(to); return }
    const start = performance.now()
    const step = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - (1 - t) ** 3
      setVal(to * eased)
      if (t < 1) raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [to, duration])

  return <span className={`num ${className}`}>{val.toFixed(decimals)}</span>
}
