import Crest from './Crest.jsx'
import CountUp from './CountUp.jsx'

const ATTRS = [
  ['pac', 'Pace'], ['sho', 'Shooting'], ['pas', 'Passing'],
  ['dri', 'Dribbling'], ['def', 'Defending'], ['phy', 'Physical'],
]

export default function PlayerCardDetail({ player, club, onClose }) {
  if (!player) return null
  return (
    <div className="pc-backdrop" onClick={onClose} role="dialog" aria-modal="true"
      aria-label={`${player.name} player card`}>
      <article className="pc" onClick={(e) => e.stopPropagation()}>
        <button className="pc-close" onClick={onClose} aria-label="Close">✕</button>

        <header className="pc-head">
          <div className="pc-ident">
            <span className="pc-pos display">{player.role}</span>
            <Crest club={club} size={38} />
            <span className="pc-flag" title={player.nation}>{player.flag}</span>
          </div>
          <div className="pc-ovr">
            <div className="label">Overall</div>
            <CountUp to={player.ovr} className="pc-ovr-num" />
          </div>
        </header>

        <div className="pc-name-block">
          <div className="pc-number num">{player.number}</div>
          <h2 className="pc-name">{player.name}</h2>
          <div className="label">{club.name} · Age {player.age} · {player.nation}</div>
        </div>

        <div className="pc-attrs">
          {ATTRS.map(([key, label], i) => (
            <div className="pc-attr" key={key}>
              <div className="pc-attr-top">
                <span className="label">{label}</span>
                <CountUp to={player.attrs[key]} className="pc-attr-num" duration={600 + i * 40} />
              </div>
              <div className="stat-bar">
                <i style={{
                  width: `${player.attrs[key]}%`,
                  animationDelay: `${i * 60}ms`,
                  background: player.attrs[key] >= 80 ? 'var(--pos)' : 'var(--accent)',
                }} />
              </div>
            </div>
          ))}
        </div>
      </article>
    </div>
  )
}
