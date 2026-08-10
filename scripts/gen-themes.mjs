// Generates src/styles/themes.css and src/data/themes-meta.json from the 10
// vendored Manifold theme JSONs in src/themes/data/. These are the same theme
// files the Manifold desktop app ships; here we derive the landing page's CSS
// custom properties from each theme's Monaco `colors` block so the whole site
// re-colors per theme. Run with `npm run themes`. Do not edit the outputs by hand.

import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dataDir = join(root, 'src/themes/data')

// --- colour helpers -------------------------------------------------------
function parseHex(hex) {
  const h = hex.replace('#', '').slice(0, 6)
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) }
}
const clamp = (n) => Math.max(0, Math.min(255, Math.round(n)))
function toHex({ r, g, b }) {
  return '#' + [r, g, b].map((n) => clamp(n).toString(16).padStart(2, '0')).join('').toUpperCase()
}
function mix(a, b, t) {
  const x = parseHex(a)
  const y = parseHex(b)
  return toHex({ r: x.r + (y.r - x.r) * t, g: x.g + (y.g - x.g) * t, b: x.b + (y.b - x.b) * t })
}
const lighten = (hex, t) => mix(hex, '#FFFFFF', t)
const darken = (hex, t) => mix(hex, '#000000', t)
function rgba(hex, a) {
  const { r, g, b } = parseHex(hex)
  return `rgba(${r}, ${g}, ${b}, ${a})`
}

// --- theme ordering (matches the app's family grouping) -------------------
const FAMILY_ORDER = ['Manifold', 'Garfield', 'Neon', 'Jade', 'Platinum']
// Theme used for the bare :root fallback (applies only when JS is disabled and
// the inline head script never runs). Matches the default in BaseLayout.astro.
const DEFAULT_DARK = 'manifold-dark'

function idFromFile(file) {
  return file.replace(/\.json$/, '').toLowerCase().replace(/\s+/g, '-')
}
function labelFromFile(file) {
  return file.replace(/\.json$/, '')
}

// --- per-theme token derivation -------------------------------------------
function deriveTokens(colors, type) {
  const dark = type === 'dark'
  const c = (k) => colors[k]

  const canvas = c('editor.background')
  const fg = c('editor.foreground')
  const accent = c('button.background')

  const shadows = dark
    ? {
        subtle: '0 2px 8px rgba(0, 0, 0, 0.3)',
        elevated: '0 8px 24px rgba(0, 0, 0, 0.4)',
        overlay: '0 20px 70px rgba(0, 0, 0, 0.6)',
      }
    : {
        subtle: '0 2px 8px rgba(0, 0, 0, 0.08)',
        elevated: '0 8px 24px rgba(0, 0, 0, 0.12)',
        overlay: '0 20px 70px rgba(0, 0, 0, 0.18)',
      }

  // Frame separation for the hero screenshot. On dark canvases separation comes
  // from light (a faint rim + top sheen); on light canvases from a dark hairline.
  const frame = dark
    ? {
        rim: 'rgba(255, 255, 255, 0.06)',
        highlight: 'rgba(255, 255, 255, 0.08)',
        shadow: '0 24px 70px -12px rgba(0, 0, 0, 0.8)',
      }
    : {
        rim: 'rgba(0, 0, 0, 0.12)',
        highlight: 'rgba(255, 255, 255, 0.7)',
        shadow: '0 18px 50px -12px rgba(0, 0, 0, 0.18)',
      }

  // Subtle radial lift behind the hero: brighter centre on dark, faint accent
  // tint on light.
  const heroGlow = dark ? lighten(canvas, 0.07) : mix(canvas, accent, 0.05)

  return {
    '--canvas': canvas,
    '--surface': c('sideBar.background'),
    '--surface-2': c('input.background'),
    '--border': c('panel.border'),
    '--divider': c('editorGroup.border'),
    '--text-primary': fg,
    '--text-secondary': c('descriptionForeground'),
    '--text-muted': c('disabledForeground'),
    '--accent-gold': accent,
    '--accent-gold-hover': dark ? lighten(accent, 0.12) : darken(accent, 0.1),
    '--accent-blue': c('terminal.ansiBrightBlue'),
    '--accent-cyan': c('terminal.ansiBrightCyan'),
    '--status-success': c('terminal.ansiGreen'),
    '--status-error': c('terminal.ansiRed'),
    '--nav-bg': rgba(canvas, 0.85),
    '--hero-glow': heroGlow,
    '--frame-rim': frame.rim,
    '--frame-highlight': frame.highlight,
    '--frame-shadow': frame.shadow,
    '--shadow-subtle': shadows.subtle,
    '--shadow-elevated': shadows.elevated,
    '--shadow-overlay': shadows.overlay,
  }
}

// --- build ----------------------------------------------------------------
const files = readdirSync(dataDir).filter((f) => f.endsWith('.json'))

const themes = files.map((file) => {
  const raw = JSON.parse(readFileSync(join(dataDir, file), 'utf8'))
  const type = raw.base === 'vs' ? 'light' : 'dark'
  const tokens = deriveTokens(raw.colors, type)
  return {
    id: idFromFile(file),
    label: labelFromFile(file),
    type,
    tokens,
    swatch: { bg: tokens['--canvas'], fg: tokens['--text-primary'], accent: tokens['--accent-gold'] },
  }
})

const familyIndex = (label) => {
  const fam = label.split(' ')[0]
  const i = FAMILY_ORDER.indexOf(fam)
  return i === -1 ? FAMILY_ORDER.length : i
}
themes.sort((a, b) => {
  const fi = familyIndex(a.label) - familyIndex(b.label)
  if (fi !== 0) return fi
  if (a.type !== b.type) return a.type === 'dark' ? -1 : 1
  return a.label.localeCompare(b.label)
})

function block(selector, tokens) {
  const body = Object.entries(tokens)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join('\n')
  return `${selector} {\n${body}\n}`
}

const header = `/* GENERATED by scripts/gen-themes.mjs — do not edit by hand.
   Source: the 10 vendored Manifold theme JSONs in src/themes/data/.
   Regenerate with: npm run themes */\n`

const defaultTheme = themes.find((t) => t.id === DEFAULT_DARK) ?? themes[0]
const blocks = [
  block(`:root, :root[data-theme='${defaultTheme.id}']`, defaultTheme.tokens),
  ...themes.filter((t) => t.id !== defaultTheme.id).map((t) => block(`:root[data-theme='${t.id}']`, t.tokens)),
]

writeFileSync(join(root, 'src/styles/themes.css'), header + '\n' + blocks.join('\n\n') + '\n')

const meta = themes.map(({ id, label, type, swatch }) => ({ id, label, type, swatch }))
mkdirSync(join(root, 'src/data'), { recursive: true })
writeFileSync(join(root, 'src/data/themes-meta.json'), JSON.stringify(meta, null, 2) + '\n')

console.log(`Generated themes.css and themes-meta.json for ${themes.length} themes (default: ${defaultTheme.id}).`)
