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

// --- contrast -------------------------------------------------------------
// The app's palettes are tuned for a dense IDE, where muted text sits next to
// its own label and "disabled" is meant to recede. On a marketing page the same
// tokens carry real copy, so a few need a WCAG floor enforced here rather than
// being patched per-component.
function relLuminance(hex) {
  const { r, g, b } = parseHex(hex)
  const f = [r, g, b].map((v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * f[0] + 0.7152 * f[1] + 0.0722 * f[2]
}
function contrast(a, b) {
  const l1 = relLuminance(a)
  const l2 = relLuminance(b)
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)
}
/** Whichever of `a`/`b` reads better on `bg`. Used for text on the accent fill. */
function bestOn(bg, a, b) {
  return contrast(a, bg) >= contrast(b, bg) ? a : b
}
/**
 * Nudge `colour` toward `target` until it clears `min` contrast against EVERY
 * background in `bgs`. Text tokens land on more than one surface — muted text
 * sits on the canvas in the hero meta line and on `--surface` inside figures —
 * so checking only the canvas leaves the figures failing.
 */
function ensureContrast(colour, bgs, target, min = 4.5) {
  const backgrounds = Array.isArray(bgs) ? bgs : [bgs]
  const ok = (col) => backgrounds.every((bg) => contrast(col, bg) >= min)
  let out = colour
  for (let t = 0; t <= 1.001 && !ok(out); t += 0.04) {
    out = mix(colour, target, t)
  }
  return out
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
    // Body and muted text land on the canvas AND on --surface (figures, cards),
    // so both backgrounds have to clear AA — checking only the canvas leaves the
    // figure annotations failing.
    '--text-secondary': ensureContrast(c('descriptionForeground'), [canvas, c('sideBar.background')], fg),
    // disabledForeground is tuned to recede in the app's chrome; on a page it
    // carries the hero meta line and figure annotations, so it gets a floor.
    '--text-muted': ensureContrast(c('disabledForeground'), [canvas, c('sideBar.background')], fg),
    // Raw accent — for fills, borders and rules, where AA text rules don't apply.
    '--accent-gold': accent,
    // Foreground for text sitting on the accent fill (the download button).
    // On dark themes the canvas wins and nothing changes; on light themes with
    // a saturated accent, white-on-orange fails AA and the foreground wins.
    '--on-accent': bestOn(accent, canvas, fg),
    // The accent used AS TEXT (eyebrows, italic emphasis, step numbers). A
    // saturated light-theme accent — Garfield's orange, Neon's pink — only
    // reaches ~3.1:1 on its canvas, so it gets darkened for text use while the
    // raw accent above stays untouched for fills. Mirrors the app's own
    // accent / accent-text split.
    '--accent-text': ensureContrast(accent, [canvas, c('sideBar.background')], fg),
    '--accent-gold-hover': dark ? lighten(accent, 0.12) : darken(accent, 0.1),
    '--accent-blue': ensureContrast(c('terminal.ansiBrightBlue'), [canvas, c('sideBar.background')], fg),
    // Used for inline code and tags, so it has to clear AA as text too.
    '--accent-cyan': ensureContrast(c('terminal.ansiBrightCyan'), [canvas, c('sideBar.background')], fg),
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
