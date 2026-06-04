# Landing Page Refresh — Design Spec

**Date:** 2026-06-03
**Repo:** manifold-landingpage (static site served at manifold.no via GitHub Pages)
**File touched:** `index.html` (single-file static page), plus meta/asset references

## Goal

Adjust the design and content of the Manifold landing page so it (a) matches the
real app's visual identity, (b) reflects the app's *current* feature reality
(the README is outdated), and (c) reads as humble and simple.

## Background: what's actually true

The README is stale. Verified against live app source (`vippsas/manifold`):

- **Simple View has been removed** (`src/renderer-simple` no longer exists). The
  current landing page's "Not just for developers" section is obsolete.
- **External provisioners are being removed soon** — do not feature them. The
  current "Build custom provisioners" section (with cloud-deploy claims that were
  never accurate) must be cut.
- Search is now a single **titlebar omnibox**; the separate Search tab was removed.
- The app is a **developer tool** for running CLI coding agents in parallel.

### Visual identity (source of truth)

- **App icon / brand mark:** chartreuse `#CCFF00` ghost on near-black `#0A0A0A`
  (`build/icon.svg`). Playful, energetic.
- **Default app theme "Manifold Dark":** near-black canvas `#0A0A0E`, rose-gold/
  copper accent `#C9906D`, off-white text `#E8E8F0`, cool-gray muted `#6A6A78`.
  The welcome screen (the page's `overview.png`) embodies it: a thin, widely
  letter-spaced "MANIFOLD" wordmark, rose-gold accent, generous whitespace.

## Decisions (from brainstorming)

1. **Design direction: Hybrid.** Premium near-black canvas + rose-gold structure
   from the app theme, while keeping the chartreuse ghost energy for the logo and
   the single primary CTA. Elegant *and* unmistakably Manifold.
2. **Audience: developers only.** Simple View is gone; no non-developer pitch.
3. **Scope: humble and simple.** Keep only the agent strip beyond the hero.
   Remove all feature cards, the workspace showcase, and the orchestration
   spotlight. The page is: nav → hero → agent strip → footer.
4. **Stay a single static `index.html`** (GitHub Pages / CNAME `manifold.no`). No
   build step, no framework, no new dependencies.

## Target page structure

| Section | Content |
|---|---|
| **Nav** | Ghost mark + "Manifold" wordmark (left); single "GitHub" link (right). Remove the "Features" and "Simple View" links. |
| **Hero** (centered) | Thin letter-spaced **MANIFOLD** wordmark → rose-gold hairline rule → tagline → one humble sentence → chartreuse **Download** CTA + **Intel** link → quiet meta line. |
| **Screenshot** | `overview.png` framed and centered, directly below the hero. |
| **Agent strip** | Claude Code · Codex · Gemini CLI · Copilot · Ollama, each with a small chartreuse dot. Kept. |
| **Footer** | "Manifold" brand · GitHub · MIT License · version. |

Everything else on the current page is **removed**: the features grid, the
"Not just for developers" / Simple View section, and the "Build custom
provisioners" section + its `mailto:` CTA.

## Visual design

CSS custom properties, aligned exactly to the app's Manifold Dark theme:

```
--canvas:#0A0A0E  --surface:#141418  --border:#2A2A32
--accent:#C9906D  --accent-hover:#D6A07D
--text:#E8E8F0    --text-dim:#9A9AAA  --text-dimmer:#6A6A78
--chartreuse:#CCFF00  --logo-bg:#0A0A0A
```

- **Fonts:** Inter (300/400/500/600) + JetBrains Mono (400/700), via Google Fonts
  (already used by the current page).
- **Wordmark:** Inter weight 300, `letter-spacing:.4em`, `clamp(2.4rem,7vw,4.6rem)`,
  color `--text`. Echoes the app welcome screen.
- **Hero background:** subtle radial glow `radial-gradient(120% 70% at 50% -10%,
  #16120D 0%, var(--canvas) 55%)`.
- **Hairline rule:** 56px × 1px, `--accent`, centered, under the wordmark.
- **Primary CTA (Download):** solid chartreuse, mono, with hover inverting to a
  chartreuse outline on transparent (matches current button behavior).
- **Intel link:** small rose-gold text link beside the primary CTA.
- **Agent strip:** mono, `--text-dim`, top/bottom hairline borders, chartreuse dot
  before each name.
- **Screenshot frame:** 1px `--border`, `border-radius:10px`, soft drop shadow.
- Chartreuse is reserved for the logo and the single primary CTA only. All other
  accents are rose-gold. Keep motion restrained (existing 150ms ease hovers).
- Preserve responsive behavior: stack/scale on tablet and mobile; honor
  `prefers-reduced-motion`.

## Copy (exact)

- **Tagline:** "One app. Many repos. Even more agents." *(kept — established,
  also in `<title>` and OG tags)*
- **Lede (one sentence):** "Run Claude Code, Codex, and other CLI coding agents
  side by side on the same repo — each on its own isolated branch, in a real
  terminal."
- **Meta line:** "Free & open source · macOS · v0.2.47"
- **Primary CTA:** "Download for macOS (Apple Silicon)" → existing v0.2.47 arm64
  DMG URL. **Intel:** existing v0.2.47 x64 DMG URL.
- **Footer:** "Manifold" · GitHub · "MIT License" · "v0.2.47".

## Assets & meta

- **Hero/screenshot:** reuse existing `overview.png` (current welcome screen).
- **`simple.png`:** no longer referenced — delete it from the repo.
- **OG/Twitter image:** currently points to the outdated
  `manifold.jpg` on githubusercontent. Update `og:image` to
  `https://manifold.no/overview.png` (current visual) and upgrade
  `twitter:card` to `summary_large_image`.
- **Favicon / inline SVG ghost:** unchanged (already correct chartreuse ghost).
- **Title & description meta:** unchanged (accurate).
- **Version:** preserve `v0.2.47` everywhere it currently appears. Bumping to
  `v0.2.48` is handled separately by the release flow — out of scope here.

## Out of scope (YAGNI)

- No version bump (release flow owns it).
- No new screenshots or workspace/orchestration sections (cut per "humble & simple").
- No framework, bundler, or new dependencies.
- No README changes (separate concern, different repo).

## Verification

- Open the built `index.html` locally in a browser; confirm hero, screenshot,
  agent strip, and footer render and are responsive at desktop / 900px / 600px.
- Confirm all links resolve: Download (arm64), Intel (x64), GitHub, and that no
  references to Simple View, provisioners, or `simple.png` remain.
- Validate that only `index.html` (and removed `simple.png`) changed; CNAME and
  favicon untouched.
- Check OG/Twitter tags with a meta-tag preview (or manual inspection).

## Open items to confirm

- None blocking. (Tagline, lede, and humble tone were approved during brainstorming.)
