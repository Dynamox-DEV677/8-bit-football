import { useCallback, useEffect, useMemo, useState } from 'react'
import { CLUBS, clubById } from './data/clubs.js'
import { applyTheme } from './theme.js'
import { newSeason, applyResult, simulateOtherFixtures } from './engine/league.js'
import Menu from './screens/Menu.jsx'
import TeamSelect from './screens/TeamSelect.jsx'
import Squad from './screens/Squad.jsx'
import MatchScreen from './screens/MatchScreen.jsx'
import FullTime from './screens/FullTime.jsx'
import LeagueTable from './screens/LeagueTable.jsx'

// Hash routing: GitHub Pages serves static files only and would 404 on a
// direct deep link with history routing. A 404.html fallback is also shipped.
const routeFromHash = () => (window.location.hash.replace('#/', '') || 'menu')

export default function App() {
  const [route, setRoute] = useState(routeFromHash)
  const [clubId, setClubId] = useState('fernhall')
  const [formation, setFormation] = useState('4-3-3')
  const [lineup, setLineup] = useState(null)     // player ids in slot order
  const [season, setSeason] = useState(() => newSeason())
  const [lastMatch, setLastMatch] = useState(null)

  const club = useMemo(() => clubById(clubId), [clubId])

  useEffect(() => { applyTheme(club) }, [club])

  useEffect(() => {
    const onHash = () => setRoute(routeFromHash())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const go = useCallback((r) => { window.location.hash = `#/${r}` }, [])

  const finishMatch = useCallback((m) => {
    setLastMatch(m)
    setSeason((s) => {
      const next = applyResult(s, m.home.id, m.away.id, m.score.home, m.score.away)
      return simulateOtherFixtures(next, [m.home.id, m.away.id])
    })
    go('fulltime')
  }, [go])

  const screens = {
    menu: <Menu club={club} go={go} />,
    teams: <TeamSelect clubId={clubId} setClubId={setClubId} go={go} />,
    squad: <Squad club={club} formation={formation} setFormation={setFormation}
             lineup={lineup} setLineup={setLineup} go={go} />,
    match: <MatchScreen club={club} formation={formation} onFinish={finishMatch} go={go} />,
    fulltime: <FullTime match={lastMatch} go={go} />,
    table: <LeagueTable season={season} clubId={clubId} go={go} />,
  }

  return <div className="app">{screens[route] || screens.menu}</div>
}

export { CLUBS }
