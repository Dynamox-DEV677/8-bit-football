# Touchline 99

A broadcast-styled football management and match game. Everything in it —
the league, the twenty clubs, their crests, and all 360 players — is original
fictional content. No real club, player, league or brand appears anywhere.

**Play:** https://dynamox-dev677.github.io/8-bit-football/

## What's in it

| Screen | What it does |
| --- | --- |
| Main menu | Keyboard- and mouse-navigable, themed by your club |
| Team select | Carousel of 20 clubs; picking one rethemes the entire UI |
| Squad & formation | Top-down pitch, drag to swap positions, five formations |
| Player card | Six attributes as numbers and bars, club-coloured |
| In-match | Live simulation with score bug, radar, possession, lower-thirds |
| Full time | Two-sided comparison bars and a man-of-the-match card |
| League table | 20-club standings with form guide, your club highlighted |

## Design system

- **Ground:** near-black `#0A0C10` with a lifted charcoal `#151922` for panels.
- **Accent:** dynamic. The selected club's primary colour is written to CSS
  custom properties (`src/theme.js`) and themes every screen.
- **Semantics:** green / amber / red are fixed and never take club theming.
- **Type:** Oswald (condensed, all-caps) for display, Inter for body, tabular
  figures anywhere numbers align.
- **Motif:** a single `-8deg` skew, defined once as `--skew` and reused on
  every button, card, bar and divider.
- **Motion:** 200–350ms, counting numerals, sequenced bar fills, and a
  full-screen goal takeover. All of it respects `prefers-reduced-motion`.

## Match engine

`src/engine/match.js` is a zone-based possession simulation rather than a
physics sim. The ball holds a continuous field position and each minute
resolves three contested actions weighted by the two sides' ratings. Player
markers are derived from their formation slot, shifted by where the ball is.
It produces roughly 2.5–4 goals and 15–20 shots a match.

## Running locally

```
npm install
npm run dev
```

## Deployment

Pushes to `main` build and publish to GitHub Pages via
`.github/workflows/deploy.yml`. The site is served from the `/8-bit-football/`
subpath, which `base` in `vite.config.js` accounts for; fonts and icons load
by relative path, and `index.html` is copied to `404.html` as the standard
static-host fallback alongside hash-based routing.
