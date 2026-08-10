# manifold.no Local-First Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild manifold.no as a local-first argument — leading with "nothing leaves your Mac" — in the app's own luxury design language, replacing the current feature-card page.

**Architecture:** Astro 5 static site. `src/pages/index.astro` becomes a thin composition of one focused component per page section. A shared `Section.astro` shell supplies the heading rhythm; a `.mono-figure` utility in `theme.css` supplies the diagram/receipt treatment. Theme tokens stay generated from vendored app theme JSONs via `scripts/gen-themes.mjs`.

**Tech Stack:** Astro 5.6, plain CSS with custom properties, `@fontsource` self-hosted fonts, no framework runtime, no client JS beyond the theme switcher and an IntersectionObserver reveal.

**Spec:** `docs/superpowers/specs/2026-08-10-landingpage-local-first-redesign-design.md`

## Global Constraints

- **Never name, link, screenshot, or allude to any competitor.** Differences are stated as positive facts about Manifold or as plain absences.
- **No fabricated social proof.** No star counts, user counts, logo walls, or testimonials. The repo has 14 stars; the page must not imply otherwise.
- **Zero third-party runtime requests.** No CDN fonts, no analytics, no embeds. A page headlined "nothing leaves your Mac" cannot report the visitor to Google.
- **Motion: 150–200ms ease only.** No spring, no bounce, no entrance choreography. The single exception is the Loop cycle in Task 8, which is explanatory. All motion honours `prefers-reduced-motion`.
- **Colour comes only from `var(--token)`.** Never hardcode hex in component styles. Tokens are generated — see `src/styles/themes.css`.
- **Ten themes, not twelve.** Royal Dark and Royal Light no longer exist in the app and are removed.
- **Default theme is `manifold-dark`** (was `neon-dark`).
- **Every factual claim must trace to the spec's verification table** or to `vippsas/manifold` source. Never write "no network requests" — the updater checks GitHub Releases. Write "no account, no telemetry, no analytics".
- **The offline claim belongs only to the Ollama runtimes** (Task 9). Elsewhere: "prompts go straight from your machine to the provider you already pay for."
- Version string `0.2.108` is currently duplicated in `Hero.astro:2` and `Footer.astro:2`. Do not add a third copy.
- No section image over **250 KB**.

## Verification approach

This repo has **no test framework and no test script** — it is a static content site, and adding vitest here would be scope creep. Verification is therefore:

1. `npm run build` must succeed (baseline: 8 pages, ~1.4s).
2. Greppable assertions over `dist/` for things that must or must not appear in output.
3. Visual confirmation in the browser at 1440px and 390px widths.

Each task states its exact commands and expected results. **A task is not done until its verification commands have been run and their real output observed** — never mark a step complete from code inspection alone.

## File structure

| File | Responsibility | Action |
| --- | --- | --- |
| `src/layouts/BaseLayout.astro` | Font imports, theme bootstrap, meta | Modify |
| `src/styles/theme.css` | Structural tokens, utilities, `.mono-figure` | Modify |
| `src/styles/themes.css` | Generated colour tokens | Regenerate |
| `scripts/gen-themes.mjs` | Token generator | Modify (default + family order) |
| `src/themes/data/Royal *.json` | Stale themes | Delete |
| `src/components/ThemeSwitcher.astro` | Nav theme control | Modify (drop Royal, new fallback) |
| `src/components/Section.astro` | Shared section shell | Create |
| `src/components/Hero.astro` | Section 1 | Rewrite |
| `src/components/ProductShot.astro` | Section 2 + status legend | Create |
| `src/components/LocalFirst.astro` | Section 3 — keystone | Create |
| `src/components/RealTerminal.astro` | Section 4 | Create |
| `src/components/Parallel.astro` | Section 5 | Create |
| `src/components/Loop.astro` | Section 6 | Create |
| `src/components/Runtimes.astro` | Section 7 | Create |
| `src/components/Workspaces.astro` | Section 8 | Create |
| `src/components/Memory.astro` | Section 9 | Create |
| `src/components/Receipt.astro` | Section 10 | Create |
| `src/components/ThemeGallery.astro` | Section 11 | Create |
| `src/components/GetStarted.astro` | Section 12 | Create |
| `src/components/FeatureCard.astro` | Superseded | Delete |
| `src/pages/index.astro` | Composition only | Rewrite |
| `src/content/docs/install.md` | Gains the requirements table | Modify |

---

### Task 1: Self-host fonts and add the display serif

Removes the only third-party runtime request on the site and introduces Instrument Serif, the face that carries the whole visual direction.

**Files:**
- Modify: `package.json` (dependencies — already installed at plan time, verify present)
- Modify: `src/styles/theme.css:1` (delete the Google Fonts `@import`)
- Modify: `src/layouts/BaseLayout.astro` (add font imports, add `--font-display`)

**Interfaces:**
- Produces: CSS custom property `--font-display`, consumed by every later task for headings.

- [ ] **Step 1: Confirm the CDN reference exists in the current build**

```bash
npm run build && grep -ro "fonts.googleapis.com" dist/ | wc -l
```

Expected: `1`. This is the thing Task 1 removes.

- [ ] **Step 2: Confirm the font packages are installed**

```bash
node -e "['inter','jetbrains-mono','instrument-serif'].forEach(p=>console.log(p, require('@fontsource/'+p+'/package.json').version))"
```

Expected: three lines, each `5.3.0`. If missing:
`npm install @fontsource/inter@5.3.0 @fontsource/jetbrains-mono@5.3.0 @fontsource/instrument-serif@5.3.0`

- [ ] **Step 3: Remove the CDN import**

Delete line 1 of `src/styles/theme.css` entirely:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
```

Leave `@import './themes.css';` as the new first line.

- [ ] **Step 4: Import the self-hosted faces**

In `src/layouts/BaseLayout.astro`, immediately after `import '../styles/theme.css'`:

```astro
import '@fontsource/inter/300.css'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/700.css'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
```

- [ ] **Step 5: Add the display token**

In `src/styles/theme.css`, in the `:root` typography block beside `--font-sans`:

```css
  --font-display: 'Instrument Serif', ui-serif, 'New York', Georgia, 'Times New Roman', serif;
```

This mirrors the app's own `--font-display` stack with the webfont in front.

- [ ] **Step 6: Verify the CDN reference is gone and fonts ship locally**

```bash
npm run build
grep -ro "fonts.googleapis.com" dist/ | wc -l      # expect: 0
ls dist/_astro/*.woff2 | wc -l                     # expect: > 0
grep -ro "Instrument Serif" dist/ | head -1        # expect: a match
```

All three must hold. If `woff2` count is 0 the fonts are not being emitted — check the imports are in the `.astro` frontmatter, not inside a `<style>` block.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json src/styles/theme.css src/layouts/BaseLayout.astro
git commit -m "feat: self-host fonts and add Instrument Serif display face

Removes the only third-party runtime request on the site. A page that
argues your code never leaves your machine cannot report its visitors
to a font CDN."
```

---

### Task 2: Retire Royal, default to Manifold Dark

The vendored theme set has drifted from the app: the site ships 12 themes, the app ships 10. Royal was removed upstream.

**Files:**
- Delete: `src/themes/data/Royal Dark.json`, `src/themes/data/Royal Light.json`
- Modify: `scripts/gen-themes.mjs` (`FAMILY_ORDER`, `DEFAULT_DARK`, header comment)
- Modify: `src/components/ThemeSwitcher.astro` (families list ×2, fallback ×1)
- Modify: `src/layouts/BaseLayout.astro` (default theme)
- Regenerate: `src/styles/themes.css`, `src/data/themes-meta.json`

**Interfaces:**
- Produces: exactly ten theme ids — `manifold-dark|light`, `garfield-dark|light`, `neon-dark|light`, `jade-dark|light`, `platinum-dark|light`. Task 11 renders a swatch per id.

- [ ] **Step 1: Confirm the drift against the app**

```bash
ls /Users/svenmalvik/git/manifold/src/shared/themes/data/ | wc -l   # expect: 10
ls src/themes/data/ | wc -l                                          # expect: 12
```

- [ ] **Step 2: Delete the stale themes**

```bash
git rm "src/themes/data/Royal Dark.json" "src/themes/data/Royal Light.json"
```

- [ ] **Step 3: Update the generator**

In `scripts/gen-themes.mjs`:

```js
const FAMILY_ORDER = ['Manifold', 'Garfield', 'Neon', 'Jade', 'Platinum']
```

```js
const DEFAULT_DARK = 'manifold-dark'
```

And in the `header` template literal, change `the 12 vendored` to `the 10 vendored`.

- [ ] **Step 4: Update the switcher**

In `src/components/ThemeSwitcher.astro`, remove the Royal entry from the frontmatter `FAMILIES` array:

```js
const FAMILIES = [
  { id: 'manifold', label: 'Manifold' },
  { id: 'garfield', label: 'Garfield' },
  { id: 'neon', label: 'Neon' },
  { id: 'jade', label: 'Jade' },
  { id: 'platinum', label: 'Platinum' },
]
```

And in the `<script>` block:

```js
    const FALLBACK = 'manifold-dark'
    const FAMILIES = ['manifold', 'garfield', 'neon', 'jade', 'platinum']
```

Also update `familyOf` so its fallback matches:

```js
    const familyOf = (id: string) => FAMILIES.find((f) => id.startsWith(f)) || 'manifold'
```

- [ ] **Step 5: Update the pre-paint default**

In `src/layouts/BaseLayout.astro`, in the inline head script, change the OS-preference branch and the catch fallback:

```js
          theme = light ? 'manifold-light' : 'manifold-dark'
```

```js
        document.documentElement.setAttribute('data-theme', 'manifold-dark')
```

- [ ] **Step 6: Regenerate and verify**

```bash
npm run themes
```

Expected stdout: `Generated themes.css and themes-meta.json for 10 themes (default: manifold-dark).`

```bash
grep -c "royal" src/styles/themes.css src/data/themes-meta.json   # expect: 0 and 0
node -e "console.log(require('./src/data/themes-meta.json').length)"  # expect: 10
head -6 src/styles/themes.css   # first block selector must include :root[data-theme='manifold-dark']
```

- [ ] **Step 7: Verify the stale-localStorage fallback still works**

The guard in `BaseLayout.astro` validates a saved theme against `themeIds` before applying it. A returning visitor with `royal-dark` saved must land on `manifold-dark`, not an unstyled page.

```bash
npm run build && npm run preview
```

In the browser console on the previewed page:

```js
localStorage.setItem('manifold-theme','royal-dark'); location.reload()
```

Expected: page renders in Manifold Dark; `document.documentElement.dataset.theme === 'manifold-dark'`. Then clear it:

```js
localStorage.removeItem('manifold-theme'); location.reload()
```

- [ ] **Step 8: Commit**

```bash
git add -A src/themes src/styles/themes.css src/data/themes-meta.json scripts/gen-themes.mjs src/components/ThemeSwitcher.astro src/layouts/BaseLayout.astro
git commit -m "feat: drop Royal theme, default to Manifold Dark

The app ships ten themes; the site shipped twelve. Royal was removed
upstream. The eponymous theme should also be the one visitors see
first — Neon lime was the least representative default available."
```

---

### Task 3: Section shell and mono-figure utility

Every remaining task consumes these. Building them once keeps the section components small and the rhythm consistent.

**Files:**
- Create: `src/components/Section.astro`
- Modify: `src/styles/theme.css` (add `.mono-figure`, `.eyebrow`, section rhythm, `--space-3xl`)

**Interfaces:**
- Produces: `<Section id? eyebrow? wide?>` with named slots `title`, `lede`, and a default slot. Tasks 4–12 consume it.
- Produces: CSS classes `.mono-figure`, `.eyebrow`, `.metal-frame`.

- [ ] **Step 1: Add the structural tokens and utilities**

In `src/styles/theme.css`, add to `:root`:

```css
  --space-3xl: 112px;
  --measure: 62ch;
```

Then append these utilities to the file:

```css
/* Editorial section rhythm. Sections are left-aligned inside a centred
   column — centred body text at these measures is hard to read. */
.section { padding: var(--space-3xl) 0; }
.section + .section { padding-top: 0; }

.eyebrow {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent-gold);
  margin-bottom: var(--space-md);
}

.section-title {
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(1.9rem, 4.2vw, 3rem);
  line-height: 1.12;
  letter-spacing: -0.01em;
  max-width: 20ch;
}
.section-title em { font-style: italic; color: var(--accent-gold); }

.section-lede {
  color: var(--text-secondary);
  font-size: 1.05rem;
  max-width: var(--measure);
  margin-top: var(--space-lg);
}

/* Brushed-metal separation, per the app's design system: light rims the
   edge on dark canvases, a dark hairline does it on light ones. */
.metal-frame {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  box-shadow:
    inset 0 1px 0 var(--frame-highlight),
    0 0 0 1px var(--frame-rim),
    var(--frame-shadow);
}

/* Diagrams, receipts and cycles. Monospace, generous leading, no ornament. */
.mono-figure {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  line-height: 2;
  color: var(--text-secondary);
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 2px solid var(--accent-gold);
  border-radius: var(--radius-md);
  padding: var(--space-xl);
  margin-top: var(--space-xl);
  overflow-x: auto;
  box-shadow: inset 0 1px 0 var(--frame-highlight);
}
.mono-figure b { color: var(--text-primary); font-weight: 700; }
.mono-figure .dim { color: var(--text-muted); }
.mono-figure pre { margin: 0; font: inherit; }
```

- [ ] **Step 2: Create the section shell**

Create `src/components/Section.astro`:

```astro
---
interface Props {
  id?: string
  eyebrow?: string
  wide?: boolean
}
const { id, eyebrow, wide = false } = Astro.props
---
<section class="section" id={id}>
  <div class:list={['container', { wide }]}>
    {eyebrow && <p class="eyebrow">{eyebrow}</p>}
    <h2 class="section-title"><slot name="title" /></h2>
    {Astro.slots.has('lede') && <p class="section-lede"><slot name="lede" /></p>}
    <slot />
  </div>
</section>

<style>
  .container.wide { max-width: 1240px; }
</style>
```

- [ ] **Step 3: Verify it compiles**

Temporarily add to `src/pages/index.astro` above `</main>`:

```astro
    <Section eyebrow="Test">
      <Fragment slot="title">A <em>title</em>.</Fragment>
      <Fragment slot="lede">A lede.</Fragment>
      <div class="mono-figure"><pre>figure</pre></div>
    </Section>
```

with `import Section from '../components/Section.astro'` in the frontmatter.

```bash
npm run build
grep -o "A <em>title</em>" dist/index.html    # expect: a match
```

Then remove the temporary block and its import.

- [ ] **Step 4: Commit**

```bash
git add src/components/Section.astro src/styles/theme.css
git commit -m "feat: add Section shell and mono-figure utility"
```

---

### Task 4: Hero

**Files:**
- Rewrite: `src/components/Hero.astro`

**Interfaces:**
- Consumes: `--font-display` (Task 1).
- Produces: `.btn-primary` and `.hero-intel` classes, reused by Task 12.

- [ ] **Step 1: Rewrite the markup**

Replace the `<header>` block in `src/components/Hero.astro`, keeping the existing `version`/`armDmg`/`intelDmg` frontmatter unchanged:

```astro
<header class="hero">
  <div class="container">
    <div class="wordmark">MANIFOLD</div>
    <div class="hero-rule"></div>
    <h1 class="hero-tagline">
      Every agent. Every repo.<br />
      <em>Nothing leaves your Mac.</em>
    </h1>
    <p class="hero-lede">
      Run Claude Code, Codex, Gemini CLI, Copilot — and local models — side by side
      on one codebase. Real terminals, isolated git branches, all on your own disk.
    </p>
    <div class="hero-ctas">
      <a href={armDmg} class="btn-primary">Download for macOS (Apple Silicon)</a>
      <a href={intelDmg} class="hero-intel">Intel</a>
    </div>
    <p class="hero-meta">MIT licensed · no account · no telemetry · v{version}</p>
  </div>
</header>
```

- [ ] **Step 2: Restyle the headline**

In the same file's `<style>` block, replace the `.hero-tagline` rule and add the emphasis rule:

```css
  .hero-tagline {
    font-family: var(--font-display);
    font-weight: 400;
    font-size: clamp(2rem, 5.5vw, 3.6rem);
    line-height: 1.1;
    letter-spacing: -0.015em;
    color: var(--text-primary);
    max-width: 18ch;
    margin: 0 auto;
  }
  .hero-tagline em { font-style: italic; color: var(--accent-gold); }
```

Leave `.wordmark`, `.hero-rule`, `.hero-lede`, `.hero-ctas`, `.btn-primary`, `.hero-intel` and `.hero-meta` as they are — they already work.

- [ ] **Step 3: Verify**

```bash
npm run build
grep -o "Nothing leaves your Mac" dist/index.html      # expect: a match
grep -o "no telemetry" dist/index.html                 # expect: a match
```

Then `npm run preview` and confirm at 1440px: the serif headline renders in Instrument Serif (not a fallback Times), the italic line is rose gold, and the two lines are balanced. Check 390px — the headline must not overflow.

- [ ] **Step 4: Commit**

```bash
git add src/components/Hero.astro
git commit -m "feat: lead the hero with the local-first claim"
```

---

### Task 5: Product shot and status legend

The single highest-value fix: the current hero image is an empty form.

**Files:**
- Create: `src/components/ProductShot.astro`
- Consumes asset: `public/images/workspace.webp` (produced in Task 13 — until then, point at the existing `Manifold_ov.png` so the build stays green)

**Interfaces:**
- Consumes: `.metal-frame` (Task 3).

- [ ] **Step 1: Create the component**

Create `src/components/ProductShot.astro`:

```astro
---
// The image is swapped for the real workspace capture in Task 13. Until then
// this points at the existing asset so the build never breaks mid-plan.
const src = '/images/workspace.webp'
const fallback = '/images/Manifold_ov.png'
import { existsSync } from 'node:fs'
const img = existsSync(`./public${src}`) ? src : fallback
---
<section class="shot">
  <div class="shot-frame metal-frame">
    <img
      src={img}
      alt="The Manifold workspace: repositories sidebar, an agent running in a live terminal, and a diff open beside it"
      loading="eager"
      decoding="async"
    />
  </div>
  <ul class="legend">
    <li><span class="dot running"></span>running</li>
    <li><span class="dot waiting"></span>waiting</li>
    <li><span class="dot done"></span>done</li>
    <li><span class="dot error"></span>error</li>
  </ul>
  <p class="shot-caption">Four agents on one repository. Four git worktrees. One window.</p>
</section>

<style>
  .shot { max-width: 1100px; margin: var(--space-2xl) auto 0; padding: 0 var(--space-xl); }
  .shot-frame img { width: 100%; height: auto; display: block; }

  .legend {
    display: flex;
    justify-content: center;
    gap: var(--space-xl);
    list-style: none;
    margin-top: var(--space-lg);
    font-family: var(--font-mono);
    font-size: 0.74rem;
    color: var(--text-muted);
  }
  .legend li { display: flex; align-items: center; gap: var(--space-sm); }
  .dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  /* Gemstone status colours, per the app's design system. */
  .dot.running { background: var(--accent-cyan); }
  .dot.waiting { background: var(--accent-gold); }
  .dot.done { background: var(--status-success); }
  .dot.error { background: var(--status-error); }

  .shot-caption {
    text-align: center;
    color: var(--text-muted);
    font-size: 0.85rem;
    margin-top: var(--space-md);
  }
  @media (max-width: 768px) {
    .legend { gap: var(--space-md); flex-wrap: wrap; }
  }
</style>
```

- [ ] **Step 2: Verify**

```bash
npm run build
grep -o "Four git worktrees" dist/index.html   # expect: a match
```

Confirm in `npm run preview` that the four legend dots render in four distinct colours in Manifold Dark, and again in Platinum Light (where `--accent-gold` is a cool grey — if waiting and done are indistinguishable there, note it for Task 14 and move on).

- [ ] **Step 3: Commit**

```bash
git add src/components/ProductShot.astro
git commit -m "feat: add product shot with gemstone status legend"
```

---

### Task 6: "Nothing leaves your Mac" — the keystone section

The lead claim, proven. Every word here was verified against `vippsas/manifold` @ v0.2.108; see the spec's verification table. **Do not strengthen this copy.**

**Files:**
- Create: `src/components/LocalFirst.astro`

- [ ] **Step 1: Create the component**

```astro
---
import Section from './Section.astro'
---
<Section id="local" eyebrow="Local first">
  <Fragment slot="title">Nothing leaves your <em>Mac</em>.</Fragment>
  <Fragment slot="lede">
    There is no Manifold account, because there is no Manifold server.
  </Fragment>

  <div class="mono-figure">
    <pre>   your Mac
   ┌─────────────────────────────┐
   │  <b>Manifold</b>                   │
   │    agent terminals          │ ──→   the model provider
   │    git worktrees            │        you already pay for
   │    <b>~/.manifold/</b>  (SQLite)   │
   └─────────────────────────────┘
                 <span class="dim">╳</span>
        <span class="dim">no Manifold server</span></pre>
  </div>

  <p class="body">
    Your repositories, your worktrees, your session history and your captured memory
    live in <code>~/.manifold</code> on your own disk. Prompts go straight from your
    machine to the provider you already pay for. Nothing is proxied, stored, or
    replayed by us.
  </p>

  <ul class="facts">
    <li>Sessions run on your machine — not in someone else's sandbox.</li>
    <li>Session history in local SQLite, per project, under <code>~/.manifold</code>.</li>
    <li>AI-assisted features are off by default and use your own key.</li>
    <li>MIT licensed — don't take our word for it, <a href="https://github.com/vippsas/manifold">read it</a>.</li>
  </ul>
</Section>

<style>
  .body { color: var(--text-secondary); max-width: var(--measure); margin-top: var(--space-xl); }
  .body code, .facts code { font-family: var(--font-mono); font-size: 0.88em; color: var(--accent-cyan); }
  .facts { list-style: none; margin-top: var(--space-xl); display: grid; gap: var(--space-md); max-width: var(--measure); }
  .facts li {
    font-family: var(--font-mono);
    font-size: 0.84rem;
    color: var(--text-secondary);
    padding-left: var(--space-lg);
    position: relative;
  }
  .facts li::before {
    content: '└';
    position: absolute;
    left: 0;
    color: var(--accent-gold);
  }
</style>
```

- [ ] **Step 2: Verify the copy makes no over-claim**

```bash
npm run build
grep -o "no network requests" dist/index.html   # expect: NO match — this claim is false
grep -o "no telemetry" dist/index.html          # expect: a match (from the hero)
grep -o "off by default" dist/index.html        # expect: a match
```

The first grep returning nothing is the important one. The updater checks GitHub Releases; an absolute no-network claim would be a lie on the page's central section.

- [ ] **Step 3: Commit**

```bash
git add src/components/LocalFirst.astro
git commit -m "feat: add the local-first keystone section

Claims verified against vippsas/manifold @ v0.2.108. Deliberately says
'no telemetry, no account' and not 'no network requests' — the updater
checks GitHub Releases."
```

---

### Task 7: Real terminal, and parallel worktrees

Two short argument sections that share a shape: a claim, a short body, one figure.

**Files:**
- Create: `src/components/RealTerminal.astro`
- Create: `src/components/Parallel.astro`

- [ ] **Step 1: Create `RealTerminal.astro`**

```astro
---
import Section from './Section.astro'
---
<Section eyebrow="Fidelity">
  <Fragment slot="title">A real terminal. Not a <em>transcript</em> of one.</Fragment>
  <Fragment slot="lede">
    Manifold runs the agent's actual CLI in a real PTY.
  </Fragment>

  <p class="body">
    You see the live stream, ANSI and all, and you can type into a running agent
    mid-task — correct it, answer it, redirect it — without restarting the session.
  </p>
  <p class="body pull">
    When an agent goes wrong at step nine of twelve, you steer it.
    You don't start over.
  </p>
</Section>

<style>
  .body { color: var(--text-secondary); max-width: var(--measure); margin-top: var(--space-xl); }
  .pull {
    font-family: var(--font-display);
    font-size: 1.5rem;
    line-height: 1.35;
    color: var(--text-primary);
    border-left: 2px solid var(--accent-gold);
    padding-left: var(--space-lg);
  }
</style>
```

- [ ] **Step 2: Create `Parallel.astro`**

```astro
---
import Section from './Section.astro'
---
<Section eyebrow="Isolation">
  <Fragment slot="title">Four agents. Four branches. <em>One repo</em>.</Fragment>
  <Fragment slot="lede">
    Every agent gets its own git worktree on its own branch, so they never collide.
  </Fragment>

  <div class="mono-figure">
    <pre><b>manifold</b>  (main)
   │
   ├── <span class="dim">worktree</span>  manifold/fix-login-bug      ● running
   ├── <span class="dim">worktree</span>  manifold/add-rate-limit     ● waiting
   ├── <span class="dim">worktree</span>  manifold/refactor-search    ● done
   └── <span class="dim">worktree</span>  manifold/upgrade-deps       ● error</pre>
  </div>

  <p class="body">
    Branches are named <code>&lt;repo&gt;/&lt;task-slug&gt;</code> automatically. Start an
    agent on a fresh worktree branch, directly on the current branch when you don't want
    one, on an existing branch to continue work, or on an open pull request.
  </p>
</Section>

<style>
  .body { color: var(--text-secondary); max-width: var(--measure); margin-top: var(--space-xl); }
  .body code { font-family: var(--font-mono); font-size: 0.88em; color: var(--accent-cyan); }
</style>
```

- [ ] **Step 3: Verify**

```bash
npm run build
grep -o "step nine of twelve" dist/index.html      # expect: a match
grep -o "fix-login-bug" dist/index.html            # expect: a match
```

- [ ] **Step 4: Commit**

```bash
git add src/components/RealTerminal.astro src/components/Parallel.astro
git commit -m "feat: add real-terminal and parallel-worktree sections"
```

---

### Task 8: Loop — the section nobody can copy

Gets the most visual weight after the hero. This is the one place motion beyond hover is allowed, because the animation explains the feature rather than decorating it.

**Files:**
- Create: `src/components/Loop.astro`

- [ ] **Step 1: Create the component**

```astro
---
import Section from './Section.astro'
const steps = [
  { n: '1', label: 'prompt the agent', detail: '' },
  { n: '2', label: 'run your evaluation command', detail: '' },
  { n: '3', label: 'extract a score', detail: 'exit code · regex · JSON field · LLM judge' },
  { n: '4', label: 'improved? commit — regressed? revert', detail: '' },
  { n: '5', label: 'repeat', detail: '' },
]
---
<Section id="loop" eyebrow="Automated loop">
  <Fragment slot="title">Agents that <em>grade their own work</em>.</Fragment>
  <Fragment slot="lede">
    Set a command that scores your codebase and let an agent grind against it.
  </Fragment>

  <ol class="cycle">
    {steps.map((s, i) => (
      <li style={`--i:${i}`}>
        <span class="n">{s.n}</span>
        <span class="label">{s.label}</span>
        {s.detail && <span class="detail">{s.detail}</span>}
      </li>
    ))}
  </ol>

  <p class="body">
    Every iteration that improves the score gets committed. Every iteration that makes
    things worse is thrown away. Per-iteration time limits, logs under
    <code>~/.manifold/loop-logs/</code>, and <b>Restore Best</b> to jump back to the
    best commit at any point.
  </p>
</Section>

<style>
  .cycle {
    list-style: none;
    margin-top: var(--space-xl);
    display: grid;
    gap: var(--space-sm);
    max-width: 640px;
  }
  .cycle li {
    display: flex;
    align-items: baseline;
    gap: var(--space-md);
    padding: var(--space-md) var(--space-lg);
    background: var(--surface);
    border: 1px solid var(--border);
    border-left: 2px solid var(--accent-gold);
    border-radius: var(--radius-sm);
    font-family: var(--font-mono);
    font-size: 0.84rem;
    color: var(--text-secondary);
    box-shadow: inset 0 1px 0 var(--frame-highlight);
    /* The pulse walks the cycle to show it is a loop, not a checklist. */
    animation: loop-pulse 7.5s ease-in-out infinite;
    animation-delay: calc(var(--i) * 1.5s);
  }
  .cycle .n { color: var(--accent-gold); font-weight: 700; }
  .cycle .label { color: var(--text-primary); }
  .cycle .detail { color: var(--text-muted); margin-left: auto; }

  @keyframes loop-pulse {
    0%, 14%, 100% { border-left-color: var(--border); }
    4%, 10% { border-left-color: var(--accent-gold); background: var(--surface-2); }
  }

  .body { color: var(--text-secondary); max-width: var(--measure); margin-top: var(--space-xl); }
  .body code { font-family: var(--font-mono); font-size: 0.88em; color: var(--accent-cyan); }
  .body b { color: var(--text-primary); }

  @media (max-width: 768px) {
    .cycle .detail { display: none; }
  }
</style>
```

The global `prefers-reduced-motion` rule already in `theme.css:57-59` sets `animation: none !important`, so this is covered — but verify it in Step 2 rather than assuming.

- [ ] **Step 2: Verify, including reduced motion**

```bash
npm run build
grep -o "Restore Best" dist/index.html    # expect: a match
grep -o "LLM judge" dist/index.html       # expect: a match
```

Then in `npm run preview`, with macOS **System Settings → Accessibility → Display → Reduce motion** enabled, reload and confirm the pulse stops. Alternatively in DevTools: Rendering panel → "Emulate CSS media feature prefers-reduced-motion: reduce".

- [ ] **Step 3: Commit**

```bash
git add src/components/Loop.astro
git commit -m "feat: add the Loop section

The one feature in this category with no equivalent elsewhere, so it
gets the most weight after the hero. Its animation is explanatory, which
is why it is exempt from the no-motion rule."
```

---

### Task 9: Runtimes and Workspaces

**Files:**
- Create: `src/components/Runtimes.astro`
- Create: `src/components/Workspaces.astro`

- [ ] **Step 1: Create `Runtimes.astro`**

The two Ollama entries carry `local: true` and get the emphasised treatment — this is the only place on the page where a genuine offline claim can be made.

```astro
---
import Section from './Section.astro'
const runtimes = [
  { name: 'Claude Code', bin: 'claude', local: false },
  { name: 'Codex', bin: 'codex', local: false },
  { name: 'Copilot', bin: 'copilot', local: false },
  { name: 'Gemini CLI', bin: 'gemini', local: false },
  { name: 'Claude Code (Ollama)', bin: 'ollama launch claude', local: true },
  { name: 'Codex (Ollama)', bin: 'ollama launch codex', local: true },
]
---
<Section eyebrow="Runtimes">
  <Fragment slot="title">Every agent. Including the ones that work <em>offline</em>.</Fragment>
  <Fragment slot="lede">
    Manifold checks for the runtime binaries on your <code>PATH</code> and runs them as-is.
  </Fragment>

  <ul class="grid">
    {runtimes.map((r) => (
      <li class:list={['runtime', { local: r.local }]}>
        <span class="name">{r.name}</span>
        <code>{r.bin}</code>
        {r.local && <span class="tag">no network</span>}
      </li>
    ))}
  </ul>

  <p class="body">
    Point Claude Code or Codex at a local Ollama model and the loop closes completely:
    your code, your machine, your inference. No API key. No network.
  </p>
</Section>

<style>
  .grid {
    list-style: none;
    margin-top: var(--space-xl);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: var(--space-md);
  }
  .runtime {
    display: flex;
    flex-direction: column;
    gap: var(--space-xs);
    padding: var(--space-lg);
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-md);
    box-shadow: inset 0 1px 0 var(--frame-highlight);
    transition: border-color 150ms ease, transform 150ms ease;
  }
  .runtime:hover { border-color: var(--accent-gold); transform: translateY(-2px); }
  .runtime.local { border-left: 2px solid var(--accent-cyan); }
  .name { color: var(--text-primary); font-weight: 600; font-size: 0.95rem; }
  .runtime code { font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-muted); }
  .tag {
    align-self: flex-start;
    margin-top: var(--space-xs);
    font-family: var(--font-mono);
    font-size: 0.68rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--accent-cyan);
  }
  .body { color: var(--text-secondary); max-width: var(--measure); margin-top: var(--space-xl); }
  .section-lede code { font-family: var(--font-mono); font-size: 0.88em; color: var(--accent-cyan); }
</style>
```

- [ ] **Step 2: Create `Workspaces.astro`**

```astro
---
import Section from './Section.astro'
---
<Section eyebrow="Workspaces">
  <Fragment slot="title">One agent. <em>Many repositories</em>.</Fragment>
  <Fragment slot="lede">
    Group several repos into one working set and let a single agent see all of them.
  </Fragment>

  <div class="mono-figure">
    <pre><b>workspace</b>  checkout-revamp
   ├── backend      <span class="dim">worktree → manifold/checkout-revamp</span>
   ├── frontend     <span class="dim">worktree → manifold/checkout-revamp</span>
   └── infra        <span class="dim">worktree → manifold/checkout-revamp</span>

   <span class="dim">one agent · one branch name · every repo</span></pre>
  </div>

  <p class="body">
    The first repository is the agent's working directory; the rest are mounted through
    the runtime's own multi-directory flag — <code>--add-dir</code> for Claude, Codex and
    Copilot, <code>--include-directories</code> for Gemini. Worktrees are created across
    every repo in the set when the session starts and removed when it ends.
  </p>
  <p class="body pull">No orchestration layer. No per-tool approval step. The agent just has all of it.</p>
  <p class="note">Opt in under Settings → General → Enable Workspaces.</p>
</Section>

<style>
  .body { color: var(--text-secondary); max-width: var(--measure); margin-top: var(--space-xl); }
  .body code { font-family: var(--font-mono); font-size: 0.88em; color: var(--accent-cyan); }
  .pull {
    font-family: var(--font-display);
    font-size: 1.35rem;
    line-height: 1.4;
    color: var(--text-primary);
    border-left: 2px solid var(--accent-gold);
    padding-left: var(--space-lg);
  }
  .note { margin-top: var(--space-lg); font-family: var(--font-mono); font-size: 0.76rem; color: var(--text-muted); }
</style>
```

- [ ] **Step 3: Verify**

```bash
npm run build
grep -o "no network" dist/index.html            # expect: a match (the Ollama tag)
grep -o "include-directories" dist/index.html   # expect: a match
```

- [ ] **Step 4: Commit**

```bash
git add src/components/Runtimes.astro src/components/Workspaces.astro
git commit -m "feat: add runtimes and workspaces sections"
```

---

### Task 10: Memory, and the receipt

**Files:**
- Create: `src/components/Memory.astro`
- Create: `src/components/Receipt.astro`

- [ ] **Step 1: Create `Memory.astro`**

```astro
---
import Section from './Section.astro'
---
<Section eyebrow="Search &amp; memory">
  <Fragment slot="title">It <em>remembers</em>.</Fragment>
  <Fragment slot="lede">
    Search code, file names, or everything the agent has ever noted — across every project.
  </Fragment>

  <div class="mono-figure">
    <pre><b>modes</b>    code · files · memory · everything
<b>scopes</b>   this session · this project · every project
<b>match</b>    literal · regex
<b>saved</b>    per project, with recent history
<b>ask ai</b>   answer from the results, or re-rank them <span class="dim">(optional)</span></pre>
  </div>

  <p class="body">
    Manifold captures what happened — prompts, responses, observations the agent noted,
    session summaries — into per-project SQLite. Resume a stopped session weeks later and
    the agent gets its history back.
  </p>
</Section>

<style>
  .body { color: var(--text-secondary); max-width: var(--measure); margin-top: var(--space-xl); }
</style>
```

- [ ] **Step 2: Create `Receipt.astro`**

The comparison section that contains no comparison. Whitespace does the work — resist adding anything.

```astro
---
import Section from './Section.astro'
const absences = [
  'No account to create.',
  'No seat price.',
  'No Pro tier.',
  'No server in the middle.',
  'No telemetry.',
  "No lock-in — it's your git, your branches, your disk.",
]
---
<Section id="receipt" eyebrow="The receipt">
  <Fragment slot="title">What you <em>don't</em> get.</Fragment>

  <ul class="absences">
    {absences.map((a) => <li>{a}</li>)}
  </ul>

  <p class="close">
    Free under the MIT licence. 168 releases since March.
    <a href="https://github.com/vippsas/manifold">Fork it</a> if we get it wrong.
  </p>
</Section>

<style>
  .absences {
    list-style: none;
    margin-top: var(--space-2xl);
    display: grid;
    gap: var(--space-lg);
  }
  .absences li {
    font-family: var(--font-mono);
    font-size: clamp(0.9rem, 2vw, 1.15rem);
    color: var(--text-primary);
    letter-spacing: -0.01em;
  }
  .close {
    margin-top: var(--space-2xl);
    color: var(--text-secondary);
    font-size: 0.95rem;
  }
</style>
```

**If the release count changes before launch, update the copy.** Verify with
`gh release list --repo vippsas/manifold --limit 500 | wc -l`.

- [ ] **Step 3: Verify**

```bash
npm run build
grep -o "No seat price." dist/index.html    # expect: a match
grep -c "Conductor" dist/index.html         # expect: 0 — never name a competitor
```

The second grep is a hard gate. It must return `0`.

- [ ] **Step 4: Commit**

```bash
git add src/components/Memory.astro src/components/Receipt.astro
git commit -m "feat: add memory section and the receipt"
```

---

### Task 11: Themes as proof of craft

Promotes the theme switcher from a nav utility to a section, because ten hand-built themes are evidence of care and evidence belongs on the page.

**Files:**
- Create: `src/components/ThemeGallery.astro`

**Interfaces:**
- Consumes: `src/data/themes-meta.json` — ten entries after Task 2, each `{ id, label, type, swatch: { bg, fg, accent } }`.
- Writes the same `localStorage` key as `ThemeSwitcher.astro`: `manifold-theme`.

- [ ] **Step 1: Create the component**

```astro
---
import Section from './Section.astro'
import themes from '../data/themes-meta.json'
---
<Section id="themes" eyebrow="Themes">
  <Fragment slot="title">Ten themes ship with the app. This page <em>wears them too</em>.</Fragment>

  <ul class="swatches">
    {themes.map((t) => (
      <li>
        <button
          type="button"
          data-theme-id={t.id}
          title={t.label}
          aria-label={`Preview the ${t.label} theme`}
          style={`--sw-bg:${t.swatch.bg}; --sw-fg:${t.swatch.fg}; --sw-accent:${t.swatch.accent}`}
        >
          <span class="chip"><span class="chip-accent"></span></span>
          <span class="label">{t.label}</span>
        </button>
      </li>
    ))}
  </ul>
</Section>

<style>
  .swatches {
    list-style: none;
    margin-top: var(--space-xl);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
    gap: var(--space-md);
  }
  .swatches button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: var(--space-md);
    padding: var(--space-sm) var(--space-md);
    background: transparent;
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-family: var(--font-mono);
    font-size: 0.76rem;
    color: var(--text-secondary);
    transition: border-color 150ms ease, color 150ms ease;
  }
  .swatches button:hover { border-color: var(--accent-gold); color: var(--text-primary); }
  .swatches button:focus-visible { outline: none; border-color: var(--accent-gold); box-shadow: 0 0 0 2px var(--accent-gold); }
  .swatches button[aria-current='true'] { border-color: var(--accent-gold); color: var(--text-primary); }

  .chip {
    width: 26px;
    height: 26px;
    border-radius: var(--radius-xs);
    background: var(--sw-bg);
    border: 1px solid var(--sw-fg);
    display: inline-flex;
    align-items: flex-end;
    justify-content: flex-end;
    padding: 3px;
    flex-shrink: 0;
  }
  .chip-accent { width: 9px; height: 9px; border-radius: 50%; background: var(--sw-accent); }
</style>

<script>
  const gallery = document.querySelector('#themes')
  if (gallery) {
    const html = document.documentElement
    const KEY = 'manifold-theme'

    const mark = () => {
      const active = html.getAttribute('data-theme')
      gallery.querySelectorAll<HTMLButtonElement>('button[data-theme-id]').forEach((b) => {
        b.setAttribute('aria-current', String(b.dataset.themeId === active))
      })
    }

    gallery.querySelectorAll<HTMLButtonElement>('button[data-theme-id]').forEach((b) => {
      b.addEventListener('click', () => {
        const id = b.dataset.themeId
        if (!id) return
        html.setAttribute('data-theme', id)
        try {
          localStorage.setItem(KEY, id)
        } catch (e) {
          /* storage may be unavailable; the theme still applies for this session */
        }
        mark()
        // Keep the nav control in sync with the gallery.
        document.dispatchEvent(new CustomEvent('manifold:theme', { detail: id }))
      })
    })

    mark()
    document.addEventListener('manifold:theme', mark)
  }
</script>
```

- [ ] **Step 2: Keep the nav switcher in sync**

The nav control and the gallery both write `data-theme`. Without this the nav dropdown shows a stale family after a gallery click.

In `src/components/ThemeSwitcher.astro`, inside the `<script>` block, after the final `sync(current())` line, add:

```js
    // The theme gallery also sets data-theme; mirror its changes here.
    document.addEventListener('manifold:theme', () => sync(current()))
```

And in the same file's `apply()` function, after `sync(id)`, add:

```js
      document.dispatchEvent(new CustomEvent('manifold:theme', { detail: id }))
```

- [ ] **Step 3: Verify**

```bash
npm run build
node -e "console.log(require('./src/data/themes-meta.json').length)"   # expect: 10
grep -c "data-theme-id" dist/index.html                                # expect: 10
```

Then in `npm run preview`: click three different swatches and confirm the whole page re-themes, the clicked swatch gets the gold border, and **the nav dropdown updates to match**. Reload and confirm the choice persists.

- [ ] **Step 4: Commit**

```bash
git add src/components/ThemeGallery.astro src/components/ThemeSwitcher.astro
git commit -m "feat: add theme gallery, sync nav switcher with it"
```

---

### Task 12: Get started, and move the requirements table to the docs

A five-row matrix of caveats is documentation, and right now it is the last thing between a convinced reader and a download.

**Files:**
- Create: `src/components/GetStarted.astro`
- Modify: `src/content/docs/install.md` (receives the requirements table)

- [ ] **Step 1: Check whether the docs already carry the table**

```bash
grep -n "Requirement" src/content/docs/install.md
```

If a requirements table is already there, skip Step 2 — do not duplicate it.

- [ ] **Step 2: Add the table to the install doc (only if Step 1 found nothing)**

Append to `src/content/docs/install.md`:

```markdown
## Requirements

| Requirement | Notes |
| --- | --- |
| macOS | The packaged app targets macOS. x64 WSL2 with WSLg supports a source build. |
| Git | Required for worktrees, diffs, commits, and pull requests. |
| A CLI agent on your `PATH` | Claude Code, Codex, Copilot, or Gemini CLI. |
| GitHub CLI (`gh`) | Optional — needed to create pull requests in-app. |
| Ollama + a pulled model | Optional — only for the Ollama-backed runtimes. |
```

- [ ] **Step 3: Create `GetStarted.astro`**

```astro
---
import Section from './Section.astro'
const version = '0.2.108'
const armDmg = `https://github.com/vippsas/manifold/releases/download/v${version}/Manifold-${version}-arm64.dmg`
---
<Section id="install" eyebrow="Get started">
  <Fragment slot="title">Three steps and a <em>repo</em>.</Fragment>

  <ol class="steps">
    <li><span class="n">1</span> Download the <code>.dmg</code> and drag Manifold to <code>Applications</code></li>
    <li><span class="n">2</span> Make sure one agent CLI is on your <code>PATH</code></li>
    <li><span class="n">3</span> Open a repo. Start an agent.</li>
  </ol>

  <div class="mono-figure">
    <pre><span class="dim">$</span> claude --version     <span class="dim"># or codex / gemini / copilot</span>
<span class="dim">$</span> git --version
<span class="dim">$</span> gh --version         <span class="dim"># optional — for opening PRs in-app</span></pre>
  </div>

  <div class="ctas">
    <a href={armDmg} class="btn-primary">Download for macOS</a>
    <a href="/docs/install" class="hero-intel">Read the install guide</a>
    <a href="https://github.com/vippsas/manifold/releases" class="hero-intel">See all releases</a>
  </div>
</Section>

<style>
  .steps { list-style: none; margin-top: var(--space-xl); display: grid; gap: var(--space-md); max-width: var(--measure); }
  .steps li { color: var(--text-secondary); display: flex; gap: var(--space-md); align-items: baseline; }
  .steps .n { font-family: var(--font-mono); color: var(--accent-gold); font-weight: 700; }
  .steps code { font-family: var(--font-mono); font-size: 0.88em; color: var(--accent-cyan); }
  .ctas { display: flex; gap: var(--space-lg); align-items: center; flex-wrap: wrap; margin-top: var(--space-2xl); }
</style>
```

`.btn-primary` and `.hero-intel` are defined in `Hero.astro`'s scoped style block and will **not** apply here. Move both rules out of `Hero.astro` into `src/styles/theme.css` as global utilities, and delete them from `Hero.astro`:

```css
.btn-primary {
  display: inline-block;
  background: var(--accent-gold);
  color: var(--canvas);
  font-family: var(--font-mono);
  font-weight: 700;
  font-size: 0.9rem;
  padding: 0.85rem 1.75rem;
  border-radius: var(--radius-sm);
  transition: filter 150ms ease;
}
.btn-primary:hover { filter: brightness(1.1); color: var(--canvas); }
.hero-intel { font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent-blue); }
```

- [ ] **Step 4: Verify**

```bash
npm run build
grep -o "Three steps and a" dist/index.html          # expect: a match
grep -c "install-table" dist/index.html              # expect: 0 — the table is gone
grep -o "Requirement" dist/docs/install/index.html   # expect: a match — it moved, not vanished
```

Then in `npm run preview`, confirm the gold download button renders identically in the hero and in Get started — that proves the class move worked.

- [ ] **Step 5: Commit**

```bash
git add src/components/GetStarted.astro src/components/Hero.astro src/styles/theme.css src/content/docs/install.md
git commit -m "feat: replace the requirements table with a three-step install

A matrix of caveats was the last thing between a convinced reader and a
download. It belongs in the docs, and now lives there."
```

---

### Task 13: Compose the page and delete what it replaces

**Files:**
- Rewrite: `src/pages/index.astro`
- Delete: `src/components/FeatureCard.astro`

- [ ] **Step 1: Rewrite `index.astro` as pure composition**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'
import Hero from '../components/Hero.astro'
import ProductShot from '../components/ProductShot.astro'
import LocalFirst from '../components/LocalFirst.astro'
import RealTerminal from '../components/RealTerminal.astro'
import Parallel from '../components/Parallel.astro'
import Loop from '../components/Loop.astro'
import Runtimes from '../components/Runtimes.astro'
import Workspaces from '../components/Workspaces.astro'
import Memory from '../components/Memory.astro'
import Receipt from '../components/Receipt.astro'
import ThemeGallery from '../components/ThemeGallery.astro'
import GetStarted from '../components/GetStarted.astro'
---
<BaseLayout>
  <main>
    <Hero />
    <ProductShot />
    <LocalFirst />
    <RealTerminal />
    <Parallel />
    <Loop />
    <Runtimes />
    <Workspaces />
    <Memory />
    <Receipt />
    <ThemeGallery />
    <GetStarted />
  </main>
</BaseLayout>
```

All styles and the old reveal script move out with the sections they belonged to. If the scroll-reveal is still wanted, it belongs in `BaseLayout.astro` where every page gets it — but the `.reveal` class is no longer applied by any component, so **delete the script from `index.astro` rather than porting it**.

- [ ] **Step 2: Delete the superseded component**

```bash
git rm src/components/FeatureCard.astro
```

Its unused `image`/`imageAlt` props were dead code; removing the file removes them.

- [ ] **Step 3: Update the page description**

In `src/layouts/BaseLayout.astro`, change the default `description` to match the new lead claim:

```js
  description = 'Run Claude Code, Codex, Gemini CLI, Copilot and local models side by side on one codebase — real terminals, isolated git branches, and nothing leaving your Mac.',
```

- [ ] **Step 4: Verify the whole page**

```bash
npm run build
grep -c "FeatureCard\|Learn more" dist/index.html   # expect: 0
grep -c "Conductor" dist/index.html                 # expect: 0
grep -o "Nothing leaves your Mac" dist/index.html   # expect: a match
```

Then `npm run preview` and read the page top to bottom at 1440px and at 390px. Every section must be present, in order, with no overlap or overflow.

- [ ] **Step 5: Commit**

```bash
git add -A src/pages/index.astro src/components src/layouts/BaseLayout.astro
git commit -m "feat: compose the redesigned page, drop FeatureCard"
```

---

### Task 14: Capture and optimise the product screenshots

Deferred to the end deliberately: the layout must be settled before shots are framed to it.

**Files:**
- Create: `public/images/workspace.webp`
- Delete: `public/images/Manifold_ov.png` (once nothing references it)
- Modify: `src/components/ProductShot.astro` (drop the `existsSync` fallback)

- [ ] **Step 1: Start the app**

```bash
cd /Users/svenmalvik/git/manifold && npm install && npm run dev
```

Set the theme to **Manifold Dark** in the app's own title bar control.

- [ ] **Step 2: Stage a shot worth taking**

Open a scratch repository — **not** an employer-internal one. Start three or four agents so the sidebar shows a mix of running, waiting and done states. Open a diff in the editor pane. The window should show, left to right: repositories sidebar, agent terminal mid-stream, diff.

**The capture must contain no employer-internal repository names, no customer identifiers, and no session content from real work.** This is a public marketing asset.

- [ ] **Step 3: Capture at 16:9**

```bash
SP=/private/tmp/claude-501/-Users-svenmalvik-git-manifold-landingpage/d504f38e-1279-44c2-8707-8da1c66cca72/scratchpad
osascript -e 'tell application "System Events" to tell process "Electron" to set size of front window to {2560, 1440}'
osascript -e 'tell application "System Events" to set frontmost of process "Electron" to true'
sleep 2
screencapture -x -o "$SP/workspace-raw.png"
```

Crop to the app window only — the capture is full-screen and will include the menu bar and desktop.

- [ ] **Step 4: Convert and check the budget**

```bash
SP=/private/tmp/claude-501/-Users-svenmalvik-git-manifold-landingpage/d504f38e-1279-44c2-8707-8da1c66cca72/scratchpad
sips -s format jpeg -s formatOptions 82 -Z 2200 "$SP/workspace-raw.png" --out "$SP/workspace.jpg"
cwebp -q 82 "$SP/workspace.jpg" -o public/images/workspace.webp 2>/dev/null \
  || sips -s format jpeg -s formatOptions 78 -Z 2200 "$SP/workspace-raw.png" --out public/images/workspace.jpg
ls -la public/images/
```

Budget: **≤ 250 KB**. If `cwebp` is unavailable (`brew install webp`) the JPEG fallback is acceptable — update the `src` in `ProductShot.astro` to match whichever file was produced.

- [ ] **Step 5: Point the component at the real asset**

In `src/components/ProductShot.astro`, delete the `existsSync` fallback block and the `node:fs` import, and set the `src` directly:

```astro
---
const img = '/images/workspace.webp'
---
```

- [ ] **Step 6: Retire the old asset**

```bash
grep -rn "Manifold_ov" src/ && echo "STILL REFERENCED — fix before deleting"
```

`BaseLayout.astro` uses it as the Open Graph image. Repoint that to the new capture:

```js
const ogImage = 'https://manifold.no/images/workspace.webp'
```

Then, once the grep is clean:

```bash
git rm public/images/Manifold_ov.png
```

- [ ] **Step 7: Verify**

```bash
npm run build
ls -la dist/images/
grep -o "workspace.webp" dist/index.html   # expect: a match
```

Confirm in `npm run preview` that the shot renders sharp on a retina display and that the metal frame reads correctly against both a dark and a light theme.

- [ ] **Step 8: Commit**

```bash
git add -A public/images src/components/ProductShot.astro src/layouts/BaseLayout.astro
git commit -m "feat: replace the empty-form hero image with the real workspace

The previous shot was the empty New agent form — its alt text promised
agents running in parallel and the image delivered a blank field."
```

---

### Task 15: Full verification

No new behaviour. This task exists because the success criteria are cross-cutting and the earlier tasks each only checked their own slice.

- [ ] **Step 1: Build clean**

```bash
rm -rf dist && npm run build
```

Expected: 8 pages, no warnings.

- [ ] **Step 2: Zero third-party requests**

```bash
grep -rniE "googleapis|gstatic|cdn\.|analytics|googletagmanager|hotjar|segment\.io" dist/ | grep -v "\.map:" | head
```

Expected: **no output.** This is the criterion the page's own copy depends on.

- [ ] **Step 3: No competitor reference**

```bash
grep -rci "conductor" dist/ | grep -v ":0" | head
```

Expected: no output.

- [ ] **Step 4: All ten themes render**

`npm run preview`, then for each of the ten ids run this in the console and screenshot the full page:

```js
['manifold-dark','manifold-light','garfield-dark','garfield-light','neon-dark','neon-light','jade-dark','jade-light','platinum-dark','platinum-light']
  .forEach((t,i) => setTimeout(() => document.documentElement.setAttribute('data-theme',t), i*1200))
```

Check specifically: the status legend dots stay distinguishable, `.mono-figure` box-drawing characters stay aligned, and the gold CTA keeps sufficient contrast against the canvas on every light theme.

- [ ] **Step 5: Reduced motion**

DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion: reduce". Reload. The Loop pulse must be static.

- [ ] **Step 6: Lighthouse**

Chrome DevTools → Lighthouse → Desktop, then Mobile. Target ≥ 95 on performance, accessibility and best practices. Record the four scores in the PR body. If accessibility is below 95, the usual causes here are contrast on `--text-muted` in light themes and the swatch buttons' accessible names — both fixable in place.

- [ ] **Step 7: Responsive check**

390px, 768px, 1440px. No horizontal scroll at any width. `.mono-figure` blocks scroll internally rather than widening the page — confirm by checking `document.documentElement.scrollWidth === document.documentElement.clientWidth` at 390px.

- [ ] **Step 8: Open the PR**

```bash
git push -u origin redesign-local-first
gh pr create --title "Redesign manifold.no around the local-first claim" --body "$(cat <<'EOF'
Rebuilds the landing page as an argument rather than a feature list, leading
with the one claim a cloud-tier competitor cannot answer: your code never
leaves your Mac.

## What changed
- Hero leads on local-first; headline set in Instrument Serif
- Real workspace screenshot replaces the empty New-agent form
- New sections: local-first proof, real terminal, parallel worktrees, Loop,
  runtimes (Ollama emphasised), workspaces, memory, the receipt, theme gallery
- Requirements table moved to /docs/install; three-step install in its place
- Default theme is now Manifold Dark; Royal dropped (removed upstream, 10 themes)
- Fonts self-hosted — the site now makes zero third-party requests

## Claims
Every privacy claim is verified against vippsas/manifold @ v0.2.108 and recorded
in the spec's verification table. The page deliberately says "no account, no
telemetry" and never "no network requests" — the updater checks GitHub Releases.

No fabricated social proof, and no competitor is named anywhere.

## Verification
- [ ] `npm run build` clean
- [ ] Zero third-party requests in dist/
- [ ] All ten themes render, light and dark
- [ ] prefers-reduced-motion stops the Loop animation
- [ ] Lighthouse desktop/mobile scores recorded below

Spec: `docs/superpowers/specs/2026-08-10-landingpage-local-first-redesign-design.md`

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Self-review

**Spec coverage.** Sections 0–13 of the spec map to tasks: nav unchanged (no task needed, by design); hero → 4; product shot → 5; local-first → 6; real terminal + parallel → 7; Loop → 8; runtimes + workspaces → 9; memory + receipt → 10; themes → 11; get started → 12; footer unchanged apart from the version line it already has. Theme drift → 2. Font self-hosting → 1. Asset capture → 14. Success criteria → 15. Removals are folded into 12, 13 and 14.

**Deviation from the spec, recorded.** The spec's section 13 asks the footer to gain "the release-cadence line". The receipt (Task 10) already carries "168 releases since March", and repeating it two sections later weakens both. The footer is therefore left unchanged. Flagged rather than silently dropped.

**Known gap.** The spec lists five assets to capture; Task 14 captures only the workspace shot, because sections 4, 6, 8 and 9 are built as mono figures rather than screenshots — figures theme correctly across all ten palettes and cost nothing to maintain, which screenshots do not. If real screenshots are wanted for those sections later, that is a follow-up, not a blocker.

**Type consistency.** `Section.astro` exposes slots `title` and `lede` plus a default slot; every consuming task uses exactly those names. `themes-meta.json` entries are `{ id, label, type, swatch: { bg, fg, accent } }` in both Task 2 and Task 11. The `manifold:theme` CustomEvent is dispatched by both `ThemeGallery.astro` and `ThemeSwitcher.astro` and listened for by both — no name drift.

**Ordering constraint.** Task 3 must precede Tasks 4–12. Task 13 must follow all section tasks. Task 14 may run any time after 13. Tasks 1 and 2 are independent of everything else and of each other.
