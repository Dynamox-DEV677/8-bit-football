// The dynamic accent mechanic: the selected club's colours retheme the whole
// interface via CSS custom properties, so the UI belongs to your team.
const hexToRgb = (hex) => {
  const h = hex.replace('#', '')
  const v = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16))
}

// Relative luminance, so text on the accent stays readable for pale kits.
const luminance = (hex) => {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const x = c / 255
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function applyTheme(club) {
  const root = document.documentElement
  const [r, g, b] = hexToRgb(club.primary)
  root.style.setProperty('--accent', club.primary)
  root.style.setProperty('--accent-2', club.secondary)
  root.style.setProperty('--accent-soft', `rgba(${r}, ${g}, ${b}, 0.14)`)
  root.style.setProperty('--accent-ink', luminance(club.primary) > 0.45 ? '#0A0C10' : '#FFFFFF')
}
