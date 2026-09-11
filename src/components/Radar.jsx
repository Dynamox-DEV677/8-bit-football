/** Small radar/minimap of live player positions. */
export default function Radar({ positions, ball, homeColor, awayColor }) {
  return (
    <div className="radar" aria-hidden="true">
      <div className="radar-inner">
        <span className="radar-halfway" />
        <span className="radar-circle" />
        {positions.map((p) => (
          <i key={`${p.side}-${p.player.id}`}
            className="radar-dot"
            style={{
              left: `${p.x * 100}%`,
              top: `${p.y * 100}%`,
              background: p.side === 'home' ? homeColor : awayColor,
            }} />
        ))}
        <i className="radar-ball" style={{ left: `${ball.x * 100}%`, top: `${ball.y * 100}%` }} />
      </div>
    </div>
  )
}
