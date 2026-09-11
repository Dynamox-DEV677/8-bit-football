// All clubs, colours and crest geometry below are ORIGINAL fictional creations.
// No real-world club, league or brand is referenced anywhere in this file.

export const CLUBS = [
  { id: 'ashford',   name: 'Ashford Vale',      abbr: 'ASH', city: 'Ashford',   primary: '#E23B2E', secondary: '#F5F1E6', crest: 'chevron', att: 84, mid: 81, def: 79 },
  { id: 'brackwell', name: 'Brackwell Town',    abbr: 'BRK', city: 'Brackwell', primary: '#2E6BE2', secondary: '#0A0C10', crest: 'shield',  att: 78, mid: 83, def: 82 },
  { id: 'colmere',   name: 'Colmere United',    abbr: 'COL', city: 'Colmere',   primary: '#17A67B', secondary: '#0A0C10', crest: 'bars',    att: 80, mid: 79, def: 77 },
  { id: 'dunmoor',   name: 'Dunmoor Athletic',  abbr: 'DUN', city: 'Dunmoor',   primary: '#F0A31B', secondary: '#1B1B1B', crest: 'diamond', att: 76, mid: 75, def: 74 },
  { id: 'eastholm',  name: 'Eastholm Rangers',  abbr: 'EAS', city: 'Eastholm',  primary: '#8B3BE2', secondary: '#F5F1E6', crest: 'chevron', att: 79, mid: 78, def: 76 },
  { id: 'fernhall',  name: 'Fernhall City',     abbr: 'FRN', city: 'Fernhall',  primary: '#00B4D8', secondary: '#0A0C10', crest: 'orbit',   att: 86, mid: 84, def: 80 },
  { id: 'garrick',   name: 'Garrick Park',      abbr: 'GAR', city: 'Garrick',   primary: '#D81E5B', secondary: '#F5F1E6', crest: 'bars',    att: 75, mid: 74, def: 73 },
  { id: 'holbeck',   name: 'Holbeck Wanderers', abbr: 'HOL', city: 'Holbeck',   primary: '#5B6B7C', secondary: '#E8EDF2', crest: 'shield',  att: 72, mid: 73, def: 75 },
  { id: 'inverleigh',name: 'Inverleigh FC',     abbr: 'INV', city: 'Inverleigh',primary: '#1FBF5A', secondary: '#0A0C10', crest: 'diamond', att: 74, mid: 76, def: 78 },
  { id: 'kestrel',   name: 'Kestrel Bay',       abbr: 'KES', city: 'Kestrel',   primary: '#FF6B35', secondary: '#0A0C10', crest: 'orbit',   att: 81, mid: 77, def: 72 },
  { id: 'langmere',  name: 'Langmere Rovers',   abbr: 'LAN', city: 'Langmere',  primary: '#C9A227', secondary: '#1B1B1B', crest: 'chevron', att: 73, mid: 72, def: 71 },
  { id: 'marrow',    name: 'Marrowgate',        abbr: 'MAR', city: 'Marrowgate',primary: '#E2452E', secondary: '#0A0C10', crest: 'bars',    att: 77, mid: 80, def: 79 },
  { id: 'norbury',   name: 'Norbury Albion',    abbr: 'NOR', city: 'Norbury',   primary: '#F5F1E6', secondary: '#C42A2A', crest: 'shield',  att: 82, mid: 80, def: 83 },
  { id: 'oakfield',  name: 'Oakfield Saints',   abbr: 'OAK', city: 'Oakfield',  primary: '#7BC043', secondary: '#0A0C10', crest: 'diamond', att: 71, mid: 70, def: 72 },
  { id: 'pennhurst', name: 'Pennhurst Cross',   abbr: 'PEN', city: 'Pennhurst', primary: '#3F51B5', secondary: '#F5F1E6', crest: 'orbit',   att: 79, mid: 82, def: 81 },
  { id: 'quarrow',   name: 'Quarrow Heath',     abbr: 'QUA', city: 'Quarrow',   primary: '#00897B', secondary: '#F5F1E6', crest: 'bars',    att: 70, mid: 71, def: 73 },
  { id: 'ravensby',  name: 'Ravensby North',    abbr: 'RAV', city: 'Ravensby',  primary: '#111827', secondary: '#F0A31B', crest: 'chevron', att: 83, mid: 85, def: 84 },
  { id: 'stanwick',  name: 'Stanwick Harriers', abbr: 'STA', city: 'Stanwick',  primary: '#A0522D', secondary: '#F5F1E6', crest: 'shield',  att: 69, mid: 70, def: 71 },
  { id: 'thornley',  name: 'Thornley End',      abbr: 'THO', city: 'Thornley',  primary: '#9C27B0', secondary: '#0A0C10', crest: 'diamond', att: 76, mid: 74, def: 70 },
  { id: 'westmarch', name: 'Westmarch Sporting',abbr: 'WES', city: 'Westmarch', primary: '#0EA5E9', secondary: '#0A0C10', crest: 'orbit',   att: 85, mid: 83, def: 82 },
]

export const clubById = (id) => CLUBS.find((c) => c.id === id) || CLUBS[0]

export const overall = (c) => Math.round((c.att + c.mid + c.def) / 3)
