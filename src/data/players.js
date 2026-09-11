// Players are procedurally generated from invented name pools with a fixed seed,
// so every visitor sees the same squads. No real footballer is referenced.
import { CLUBS } from './clubs.js'

const FIRST = [
  'Aldo', 'Bastien', 'Caspar', 'Dario', 'Emrys', 'Ferran', 'Gethin', 'Hektor',
  'Ilias', 'Joris', 'Kaspar', 'Lorik', 'Mateus', 'Nedim', 'Osric', 'Pavel',
  'Quillon', 'Renzo', 'Stellan', 'Tobias', 'Ulrik', 'Vasco', 'Wendel', 'Yannick',
  'Zoran', 'Arvin', 'Brannoc', 'Cedric', 'Dmitri', 'Elias', 'Florian', 'Gustav',
  'Harun', 'Ivar', 'Jonas', 'Kiro', 'Leandro', 'Milos', 'Nico', 'Otto',
]

const LAST = [
  'Varnholt', 'Drescu', 'Baltasar', 'Kerrigane', 'Oduya', 'Penhale', 'Strand',
  'Vossberg', 'Marchetti', 'Lindqvist', 'Okonjo', 'Ferraz', 'Halvorsen', 'Duarte',
  'Bregovic', 'Ainsley', 'Roskilde', 'Navarrete', 'Thiam', 'Weiler', 'Kovalenko',
  'Astrup', 'Bellandi', 'Crainic', 'Delacroix', 'Ekwueme', 'Fjordheim', 'Grimaldi',
  'Hjalmar', 'Ibarrola', 'Jankovic', 'Kaspersen', 'Lindahl', 'Moretti', 'Nyberg',
  'Olabode', 'Petrescu', 'Ravnsborg', 'Sandoval', 'Tarkovic', 'Urbina', 'Vanterpool',
]

const NATIONS = [
  { code: 'NL', flag: '🇳🇱' }, { code: 'BR', flag: '🇧🇷' }, { code: 'FR', flag: '🇫🇷' },
  { code: 'DE', flag: '🇩🇪' }, { code: 'ES', flag: '🇪🇸' }, { code: 'IT', flag: '🇮🇹' },
  { code: 'PT', flag: '🇵🇹' }, { code: 'AR', flag: '🇦🇷' }, { code: 'SE', flag: '🇸🇪' },
  { code: 'NO', flag: '🇳🇴' }, { code: 'DK', flag: '🇩🇰' }, { code: 'PL', flag: '🇵🇱' },
  { code: 'HR', flag: '🇭🇷' }, { code: 'SN', flag: '🇸🇳' }, { code: 'NG', flag: '🇳🇬' },
  { code: 'JP', flag: '🇯🇵' }, { code: 'KR', flag: '🇰🇷' }, { code: 'US', flag: '🇺🇸' },
  { code: 'MA', flag: '🇲🇦' }, { code: 'RS', flag: '🇷🇸' },
]

// Positions laid out for a 4-3-3 base; formations re-map these at render time.
const BASE_ROLES = ['GK', 'LB', 'CB', 'CB', 'RB', 'CM', 'CM', 'CM', 'LW', 'ST', 'RW']
const BENCH_ROLES = ['GK', 'CB', 'RB', 'CM', 'CM', 'LW', 'ST']

function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const hash = (s) => {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const clamp = (n) => Math.max(40, Math.min(99, Math.round(n)))

// Attribute weighting per role — a centre back should not out-pace a winger.
const ROLE_WEIGHTS = {
  GK: { pac: -14, sho: -26, pas: -6, dri: -16, def: 10, phy: 6 },
  LB: { pac: 8, sho: -12, pas: 2, dri: 0, def: 6, phy: 0 },
  RB: { pac: 8, sho: -12, pas: 2, dri: 0, def: 6, phy: 0 },
  CB: { pac: -6, sho: -18, pas: -4, dri: -10, def: 12, phy: 10 },
  CM: { pac: 0, sho: 0, pas: 10, dri: 4, def: 0, phy: 0 },
  LW: { pac: 12, sho: 6, pas: 2, dri: 12, def: -14, phy: -8 },
  RW: { pac: 12, sho: 6, pas: 2, dri: 12, def: -14, phy: -8 },
  ST: { pac: 8, sho: 14, pas: -4, dri: 6, def: -18, phy: 4 },
}

function makePlayer(rnd, club, role, number, idx, usedNames) {
  const base = (club.att + club.mid + club.def) / 3
  const w = ROLE_WEIGHTS[role]
  const spread = () => (rnd() - 0.5) * 14
  const attrs = {
    pac: clamp(base + w.pac + spread()),
    sho: clamp(base + w.sho + spread()),
    pas: clamp(base + w.pas + spread()),
    dri: clamp(base + w.dri + spread()),
    def: clamp(base + w.def + spread()),
    phy: clamp(base + w.phy + spread()),
  }
  // Overall weights the attributes that actually matter for the role.
  const key = { GK: ['def', 'phy', 'pas'], CB: ['def', 'phy', 'pac'], LB: ['def', 'pac', 'pas'],
    RB: ['def', 'pac', 'pas'], CM: ['pas', 'dri', 'def'], LW: ['dri', 'pac', 'sho'],
    RW: ['dri', 'pac', 'sho'], ST: ['sho', 'pac', 'dri'] }[role]
  const ovr = clamp(
    (attrs[key[0]] * 0.45 + attrs[key[1]] * 0.3 + attrs[key[2]] * 0.25) * 0.55 + base * 0.45,
  )
  const nation = NATIONS[Math.floor(rnd() * NATIONS.length)]
  let last
  do { last = LAST[Math.floor(rnd() * LAST.length)] } while (usedNames.has(last))
  usedNames.add(last)
  return {
    id: `${club.id}-${idx}`,
    name: `${FIRST[Math.floor(rnd() * FIRST.length)]} ${last}`,
    clubId: club.id,
    role,
    number,
    age: 18 + Math.floor(rnd() * 17),
    nation: nation.code,
    flag: nation.flag,
    attrs,
    ovr,
  }
}

function buildSquad(club) {
  const rnd = mulberry32(hash(club.id))
  const used = new Set()
  const nextNumber = () => {
    let n
    do { n = 1 + Math.floor(rnd() * 39) } while (used.has(n))
    used.add(n)
    return n
  }
  const usedNames = new Set()
  const roles = [...BASE_ROLES, ...BENCH_ROLES]
  return roles.map((role, i) =>
    makePlayer(rnd, club, role, i === 0 ? 1 : nextNumber(), i, usedNames))
}

export const SQUADS = Object.fromEntries(CLUBS.map((c) => [c.id, buildSquad(c)]))

export const startingXI = (clubId) => SQUADS[clubId].slice(0, 11)
export const bench = (clubId) => SQUADS[clubId].slice(11)
