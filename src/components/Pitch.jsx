/** Top-down pitch with real markings, mow stripes and a vignette.
 *  `vertical` rotates the layout for the squad screen. */
export default function Pitch({ vertical = false, children }) {
  const stripes = Array.from({ length: 12 })
  return (
    <div className={`pitch ${vertical ? 'pitch-v' : ''}`}>
      <div className="mow" aria-hidden="true">
        {stripes.map((_, i) => <span key={i} className={i % 2 ? 'dark' : ''} />)}
      </div>

      <svg className="markings" viewBox="0 0 1050 680" preserveAspectRatio="none" aria-hidden="true">
        <g fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="3">
          <rect x="20" y="20" width="1010" height="640" />
          <line x1="525" y1="20" x2="525" y2="660" />
          <circle cx="525" cy="340" r="91.5" />
          {/* penalty areas */}
          <rect x="20" y="138.5" width="165" height="403" />
          <rect x="865" y="138.5" width="165" height="403" />
          {/* six-yard boxes */}
          <rect x="20" y="248.5" width="55" height="183" />
          <rect x="975" y="248.5" width="55" height="183" />
          {/* goals */}
          <rect x="6" y="294" width="14" height="92" stroke="rgba(255,255,255,0.8)" />
          <rect x="1030" y="294" width="14" height="92" stroke="rgba(255,255,255,0.8)" />
          {/* corner arcs */}
          <path d="M20 40a20 20 0 0 0 20-20" />
          <path d="M20 640a20 20 0 0 1 20 20" />
          <path d="M1030 40a20 20 0 0 1-20-20" />
          <path d="M1030 640a20 20 0 0 0-20 20" />
          {/* penalty arcs */}
          <path d="M185 268a91.5 91.5 0 0 1 0 144" />
          <path d="M865 268a91.5 91.5 0 0 0 0 144" />
        </g>
        <g fill="rgba(255,255,255,0.7)">
          <circle cx="525" cy="340" r="5" />
          <circle cx="130" cy="340" r="5" />
          <circle cx="920" cy="340" r="5" />
        </g>
      </svg>

      <div className="vignette" aria-hidden="true" />
      <div className="pitch-layer">{children}</div>
    </div>
  )
}
