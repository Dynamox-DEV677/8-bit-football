// Original geometric crests. Five hand-drawn SVG forms, each tinted by the
// club's own two colours — no real-world badge is reproduced.
export default function Crest({ club, size = 64, className = '' }) {
  const p = club.primary
  const s = club.secondary
  const shapes = {
    chevron: (
      <>
        <path d="M32 2 60 14v28c0 12-12 18-28 22C16 60 4 54 4 42V14Z" fill={s} stroke={p} strokeWidth="3" />
        <path d="M32 16 48 26v10L32 26 16 36V26Z" fill={p} />
        <path d="M32 34 48 44v8L32 42 16 52v-8Z" fill={p} opacity="0.7" />
      </>
    ),
    shield: (
      <>
        <path d="M32 2 60 12v26c0 13-13 20-28 24C17 58 4 51 4 38V12Z" fill={p} stroke={s} strokeWidth="3" />
        <path d="M32 2v60c15-4 28-11 28-24V12Z" fill={s} opacity="0.25" />
        <circle cx="32" cy="30" r="10" fill="none" stroke={s} strokeWidth="4" />
      </>
    ),
    bars: (
      <>
        <path d="M6 6h52v32c0 12-11 19-26 24C17 57 6 50 6 38Z" fill={s} stroke={p} strokeWidth="3" />
        <path d="M18 6h8v46.5a61 61 0 0 1-8-4.6Z" fill={p} />
        <path d="M34 6h8v42a72 72 0 0 1-8 3.4Z" fill={p} />
      </>
    ),
    diamond: (
      <>
        <path d="M32 3 61 32 32 61 3 32Z" fill={s} stroke={p} strokeWidth="3" />
        <path d="M32 15 49 32 32 49 15 32Z" fill={p} />
        <path d="M32 25 39 32l-7 7-7-7Z" fill={s} />
      </>
    ),
    orbit: (
      <>
        <circle cx="32" cy="32" r="28" fill={s} stroke={p} strokeWidth="3" />
        <ellipse cx="32" cy="32" rx="28" ry="11" fill="none" stroke={p} strokeWidth="4"
          transform="rotate(-20 32 32)" />
        <circle cx="32" cy="32" r="8" fill={p} />
      </>
    ),
  }
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className={className}
      role="img" aria-label={`${club.name} crest`}>
      {shapes[club.crest] || shapes.shield}
    </svg>
  )
}
