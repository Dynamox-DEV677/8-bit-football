// Original wordmark — the game's own identity, built from type and the skew motif.
export default function Wordmark({ small = false }) {
  return (
    <div className={`wordmark ${small ? 'wordmark-sm' : ''}`}>
      <span className="wm-bar" />
      <span className="wm-text">Touchline</span>
      <span className="wm-num">99</span>
    </div>
  )
}
