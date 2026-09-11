import { standings } from '../engine/league.js'
import { clubById } from '../data/clubs.js'
import Crest from '../components/Crest.jsx'

export default function LeagueTable({ season, clubId, go }) {
  const rows = standings(season)

  return (
    <div className="screen table-screen">
      <header className="bar">
        <button className="btn btn-ghost" onClick={() => go('menu')}><span>← Menu</span></button>
        <h2 className="bar-name">Premier Division</h2>
        <span className="label">Matchday {season.round}</span>
      </header>

      <div className="table-wrap scrollable">
        <table className="ltable">
          <thead>
            <tr>
              <th className="ta-l">#</th>
              <th className="ta-l">Club</th>
              <th>P</th><th>W</th><th>D</th><th>L</th>
              <th>GF</th><th>GA</th><th>GD</th><th>Pts</th>
              <th className="ta-l">Form</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => {
              const club = clubById(r.id)
              const mine = r.id === clubId
              return (
                <tr key={r.id} className={mine ? 'is-mine' : ''}>
                  <td className="ta-l pos">{i + 1}</td>
                  <td className="ta-l club-cell">
                    <Crest club={club} size={22} />
                    <span className="display club-name">{club.name}</span>
                  </td>
                  <td>{r.p}</td><td>{r.w}</td><td>{r.d}</td><td>{r.l}</td>
                  <td>{r.gf}</td><td>{r.ga}</td>
                  <td>{r.gf - r.ga > 0 ? `+${r.gf - r.ga}` : r.gf - r.ga}</td>
                  <td className="pts">{r.pts}</td>
                  <td className="ta-l">
                    <span className="form">
                      {r.form.length === 0 && <span className="label">—</span>}
                      {r.form.map((f, j) => (
                        <i key={j} className={`form-chip f-${f}`}>{f}</i>
                      ))}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
