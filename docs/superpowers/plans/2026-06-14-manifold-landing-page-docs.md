# Manifold Landing Page & Docs Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the single static `index.html` at manifold.no with an Astro site that has a marketing landing page (progressive feature reveals) plus a 7-page documentation section, all in the Manifold royal theme, deployed to GitHub Pages via GitHub Actions.

**Architecture:** One Astro static site. Shared `BaseLayout` (nav + footer + theme) wraps the landing page and a `DocsLayout` (sidebar) wraps docs. Docs content lives as Markdown in an Astro content collection, sourced from the manifold `README.md`. Royal theme colors are CSS custom properties in one `theme.css`. Build output (`dist/`) is published to GitHub Pages by a GitHub Actions workflow; `public/CNAME` keeps the `manifold.no` domain.

**Tech Stack:** Astro 5, TypeScript, Markdown content collections, plain CSS custom properties, GitHub Actions, GitHub Pages.

**Verification model:** This is a static marketing/docs site, so the verification gate for each task is `npm run build` succeeding (no broken imports, no missing content references) plus targeted checks (file exists in `dist/`, expected strings present). Visual confirmation happens via `npm run dev` at the end. There is no unit-test framework in this repo and adding one is out of scope.

**Repo facts (verified):**
- Working dir / repo: `svenmalvik/manifold-landingpage`, branch `manifold/manifold-ws`.
- Existing files at root: `index.html` (old landing), `Manifold_ov.png` (screenshot, 2524×1388), `CNAME` (`manifold.no`), `.gitignore` (ignores `.superpowers/`, `.DS_Store`), `package-lock.json` (empty stub), `docs/` (superpowers specs/plans only).
- No `.github/workflows/` yet. GitHub Pages currently serves from branch root; this plan switches it to GitHub Actions (one manual repo-setting step, called out in Task 9).
- Node v25 / npm 11 available locally.
- Current released app version string used on the page: **v0.2.83** (matches `index.html`).

---

### Task 1: Scaffold the Astro project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore` (modify existing)
- Create: `src/env.d.ts`

- [ ] **Step 1: Replace the stub `package.json`**

Overwrite `package.json` with:

```json
{
  "name": "manifold-landingpage",
  "type": "module",
  "version": "0.2.83",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "astro": "^5.6.0"
  }
}
```

- [ ] **Step 2: Create `astro.config.mjs`**

```js
// @ts-check
import { defineConfig } from 'astro/config'

// Custom domain (manifold.no) served from the site root, so no `base` path.
export default defineConfig({
  site: 'https://manifold.no',
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
})
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 4: Create `src/env.d.ts`**

```ts
/// <reference path="../.astro/types.d.ts" />
```

- [ ] **Step 5: Extend `.gitignore`**

Replace `.gitignore` content with:

```
.superpowers/
.DS_Store
node_modules/
dist/
.astro/
```

- [ ] **Step 6: Install dependencies**

Run: `npm install`
Expected: Astro and its deps install; `node_modules/` and a populated `package-lock.json` are created. No errors.

- [ ] **Step 7: Commit**

```bash
git add package.json astro.config.mjs tsconfig.json src/env.d.ts .gitignore package-lock.json
git commit -m "chore: scaffold Astro project"
```

---

### Task 2: Royal theme tokens and global styles

**Files:**
- Create: `src/styles/theme.css`

- [ ] **Step 1: Create `src/styles/theme.css`**

This is the single source of truth for colors, typography, spacing, and base element styling. Colors are taken from the Royal Dark theme.

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap');

:root {
  /* Surfaces */
  --canvas: #06080F;
  --surface: #0E1017;
  --surface-2: #141722;
  --border: #1A1D28;
  --divider: #14161F;

  /* Text */
  --text-primary: #E6ECF7;
  --text-secondary: #A0A8BB;
  --text-muted: #5E6B82;

  /* Accents */
  --accent-gold: #E2C275;
  --accent-gold-hover: #ECD18F;
  --accent-blue: #8FB4F2;
  --accent-cyan: #7FC8E8;

  /* Status (gemstone) */
  --status-success: #43C97A;
  --status-error: #D2495F;

  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  /* Spacing scale */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  --space-2xl: 64px;

  /* Radius */
  --radius-xs: 2px;
  --radius-sm: 4px;
  --radius-md: 8px;

  /* Shadows */
  --shadow-subtle: 0 2px 8px rgba(0, 0, 0, 0.3);
  --shadow-elevated: 0 8px 24px rgba(0, 0, 0, 0.4);
  --shadow-overlay: 0 20px 70px rgba(0, 0, 0, 0.6);

  /* Layout */
  --max-width: 1080px;
}

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

html { font-size: 16px; scroll-behavior: smooth; }

body {
  background: var(--canvas);
  color: var(--text-primary);
  font-family: var(--font-sans);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

a { color: var(--accent-blue); text-decoration: none; transition: color 150ms ease; }
a:hover { color: var(--accent-cyan); }
a:focus-visible { outline: 2px solid var(--accent-gold); outline-offset: 2px; }

h1, h2, h3, h4 { line-height: 1.2; font-weight: 700; color: var(--text-primary); }

code, pre { font-family: var(--font-mono); }

.container { max-width: var(--max-width); margin: 0 auto; padding: 0 var(--space-xl); }

@media (max-width: 768px) {
  .container { padding: 0 var(--space-md); }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { transition: none !important; animation: none !important; scroll-behavior: auto !important; }
}

/* Scroll-reveal utility (used by feature cards) */
.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 300ms ease, transform 300ms ease;
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 2: Commit**

```bash
git add src/styles/theme.css
git commit -m "feat: add royal theme tokens and global styles"
```

---

### Task 3: Shared brand assets (logo component) and base layout

**Files:**
- Create: `src/components/Logo.astro`
- Create: `src/components/Navigation.astro`
- Create: `src/components/Footer.astro`
- Create: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Create `src/components/Logo.astro`**

The Manifold mark (chartreuse "M" shape on dark rounded square) reused from the current `index.html` favicon SVG. Accepts a `size` prop.

```astro
---
interface Props { size?: number }
const { size = 26 } = Astro.props
---
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width={size} height={size} aria-hidden="true">
  <rect width="1024" height="1024" rx="192" ry="192" fill="#0A0A0A"/>
  <defs><mask id="logomask"><rect width="1024" height="1024" fill="white"/><circle cx="410" cy="440" r="52" fill="black"/><circle cx="614" cy="440" r="52" fill="black"/><path d="M430 540Q512 610 594 540Q570 580 512 590Q454 580 430 540Z" fill="black"/></mask></defs>
  <path mask="url(#logomask)" fill="#CCFF00" d="M512 180C340 180 260 310 260 440L260 700Q260 740 290 740Q320 710 350 740Q380 770 410 740Q440 710 470 740Q500 770 530 740Q560 710 590 740Q620 770 650 740Q680 710 710 740Q740 770 764 740L764 440C764 310 684 180 512 180Z"/>
</svg>
```

- [ ] **Step 2: Create `src/components/Navigation.astro`**

Sticky top nav. Links to Docs, GitHub, Download. Active styling via current path.

```astro
---
import Logo from './Logo.astro'
---
<nav class="nav">
  <div class="container nav-inner">
    <a href="/" class="nav-brand">
      <Logo size={26} />
      <span>Manifold</span>
    </a>
    <div class="nav-links">
      <a href="/docs">Docs</a>
      <a href="https://github.com/vippsas/manifold">GitHub</a>
      <a href="https://github.com/vippsas/manifold/releases" class="nav-download">Download</a>
    </div>
  </div>
</nav>

<style>
  .nav {
    position: sticky;
    top: 0;
    z-index: 100;
    padding: var(--space-md) 0;
    background: rgba(6, 8, 15, 0.85);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }
  .nav-inner { display: flex; justify-content: space-between; align-items: center; }
  .nav-brand { display: flex; align-items: center; gap: var(--space-sm); color: var(--text-primary); }
  .nav-brand:hover { color: var(--text-primary); }
  .nav-brand span { font-family: var(--font-mono); font-weight: 700; font-size: 1.05rem; }
  .nav-links { display: flex; align-items: center; gap: var(--space-lg); }
  .nav-links a {
    font-family: var(--font-mono);
    font-size: 0.82rem;
    color: var(--text-secondary);
  }
  .nav-links a:hover { color: var(--accent-gold); }
  .nav-download {
    color: var(--accent-gold) !important;
    border: 1px solid var(--accent-gold);
    padding: var(--space-xs) var(--space-md);
    border-radius: var(--radius-sm);
    transition: background 150ms ease, color 150ms ease;
  }
  .nav-download:hover { background: var(--accent-gold); color: var(--canvas) !important; }
  @media (max-width: 768px) {
    .nav-links { gap: var(--space-md); }
    .nav-links a:not(.nav-download) { display: none; }
  }
</style>
```

- [ ] **Step 3: Create `src/components/Footer.astro`**

```astro
---
import Logo from './Logo.astro'
const version = '0.2.83'
---
<footer class="footer">
  <div class="container footer-inner">
    <div class="footer-brand">
      <Logo size={20} />
      <span>Manifold</span>
      <span class="footer-version">v{version}</span>
    </div>
    <div class="footer-links">
      <a href="https://github.com/vippsas/manifold">GitHub</a>
      <a href="https://github.com/vippsas/manifold/releases">Releases</a>
      <a href="https://github.com/vippsas/manifold/discussions">Discussions</a>
      <a href="https://github.com/vippsas/manifold/blob/main/LICENSE">MIT License</a>
    </div>
  </div>
</footer>

<style>
  .footer { padding: var(--space-2xl) 0; border-top: 1px solid var(--border); margin-top: var(--space-2xl); }
  .footer-inner { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-md); }
  .footer-brand { display: flex; align-items: center; gap: var(--space-sm); font-family: var(--font-mono); font-weight: 700; color: var(--text-primary); }
  .footer-version { color: var(--text-muted); font-weight: 400; }
  .footer-links { display: flex; gap: var(--space-lg); flex-wrap: wrap; }
  .footer-links a { font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-secondary); }
  .footer-links a:hover { color: var(--accent-cyan); }
  @media (max-width: 768px) {
    .footer-inner { flex-direction: column; align-items: flex-start; }
  }
</style>
```

- [ ] **Step 4: Create `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/theme.css'
import Navigation from '../components/Navigation.astro'
import Footer from '../components/Footer.astro'

interface Props {
  title?: string
  description?: string
}
const {
  title = 'Manifold — A full developer workspace for orchestrating AI agents',
  description = 'Run Claude Code, Codex, Gemini CLI, and other CLI coding agents side by side on the same repo — each on its own isolated branch, in a real terminal.',
} = Astro.props
const ogImage = 'https://manifold.no/images/Manifold_ov.png'
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://manifold.no" />
  <meta property="og:image" content={ogImage} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content={ogImage} />
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024' width='1024' height='1024'><rect width='1024' height='1024' rx='192' ry='192' fill='%230A0A0A'/><defs><mask id='g'><rect width='1024' height='1024' fill='white'/><circle cx='410' cy='440' r='52' fill='black'/><circle cx='614' cy='440' r='52' fill='black'/><path d='M430 540Q512 610 594 540Q570 580 512 590Q454 580 430 540Z' fill='black'/></mask></defs><path mask='url(%23g)' fill='%23CCFF00' d='M512 180C340 180 260 310 260 440L260 700Q260 740 290 740Q320 710 350 740Q380 770 410 740Q440 710 470 740Q500 770 530 740Q560 710 590 740Q620 770 650 740Q680 710 710 740Q740 770 764 740L764 440C764 310 684 180 512 180Z'/></svg>" />
</head>
<body>
  <Navigation />
  <slot />
  <Footer />
</body>
</html>
```

- [ ] **Step 5: Verify build still works (no pages yet means build emits nothing, so just typecheck the config)**

Run: `npm run build`
Expected: Build completes. It may warn "no pages" — acceptable at this stage. No TypeScript/import errors.

- [ ] **Step 6: Commit**

```bash
git add src/components/Logo.astro src/components/Navigation.astro src/components/Footer.astro src/layouts/BaseLayout.astro
git commit -m "feat: add base layout, nav, footer, logo"
```

---

### Task 4: Move screenshot + CNAME into `public/`, add the landing page

**Files:**
- Move: `Manifold_ov.png` → `public/images/Manifold_ov.png`
- Move: `CNAME` → `public/CNAME`
- Delete: `index.html` (old root landing)
- Create: `src/components/Hero.astro`
- Create: `src/components/FeatureCard.astro`
- Create: `src/pages/index.astro`

- [ ] **Step 1: Move static assets into `public/`**

Astro copies everything in `public/` to the build output root verbatim, so `CNAME` lands at `dist/CNAME` and the image at `dist/images/Manifold_ov.png`.

```bash
mkdir -p public/images
git mv Manifold_ov.png public/images/Manifold_ov.png
git mv CNAME public/CNAME
git rm index.html
```

- [ ] **Step 2: Create `src/components/Hero.astro`**

```astro
---
const version = '0.2.83'
const armDmg = `https://github.com/vippsas/manifold/releases/download/v${version}/Manifold-${version}-arm64.dmg`
const intelDmg = `https://github.com/vippsas/manifold/releases/download/v${version}/Manifold-${version}.dmg`
---
<header class="hero">
  <div class="container">
    <div class="wordmark">MANIFOLD</div>
    <div class="hero-rule"></div>
    <h1 class="hero-tagline">A full developer workspace for orchestrating AI agents</h1>
    <p class="hero-lede">
      Run Claude Code, Codex, Gemini CLI, and other CLI coding agents side by side on the
      same codebase — each on its own isolated branch, in a real terminal.
    </p>
    <div class="hero-ctas">
      <a href={armDmg} class="btn-primary">Download for macOS (Apple Silicon)</a>
      <a href={intelDmg} class="hero-intel">Intel</a>
    </div>
    <p class="hero-meta">Free &amp; open source · macOS · v{version}</p>
  </div>
</header>

<style>
  .hero {
    text-align: center;
    padding: var(--space-2xl) 0 var(--space-xl);
    background: radial-gradient(120% 70% at 50% -10%, #0C1424 0%, var(--canvas) 55%);
  }
  .wordmark {
    font-weight: 300;
    letter-spacing: 0.4em;
    font-size: clamp(2.4rem, 7vw, 4.6rem);
    line-height: 1;
    color: var(--text-primary);
    padding-left: 0.4em;
  }
  .hero-rule { width: 56px; height: 1px; background: var(--accent-gold); margin: var(--space-lg) auto; }
  .hero-tagline { font-size: clamp(1.3rem, 3vw, 1.7rem); font-weight: 600; color: var(--text-primary); max-width: 700px; margin: 0 auto; }
  .hero-lede { font-size: 1.05rem; color: var(--text-secondary); max-width: 620px; margin: var(--space-md) auto 0; }
  .hero-ctas { display: flex; gap: var(--space-md); align-items: center; justify-content: center; flex-wrap: wrap; margin-top: var(--space-xl); }
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
  .hero-meta { margin-top: var(--space-md); font-family: var(--font-mono); font-size: 0.74rem; color: var(--text-muted); }
</style>
```

- [ ] **Step 3: Create `src/components/FeatureCard.astro`**

```astro
---
interface Props {
  title: string
  href: string
}
const { title, href } = Astro.props
---
<article class="feature-card reveal">
  <h3 class="feature-title">{title}</h3>
  <p class="feature-desc"><slot /></p>
  <a href={href} class="feature-link">Learn more →</a>
</article>

<style>
  .feature-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-left: 2px solid var(--accent-cyan);
    border-radius: var(--radius-md);
    padding: var(--space-lg);
    transition: transform 200ms ease, box-shadow 200ms ease, opacity 300ms ease;
  }
  .feature-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-elevated); }
  .feature-title { color: var(--accent-gold); font-size: 1.1rem; margin-bottom: var(--space-sm); }
  .feature-desc { color: var(--text-secondary); font-size: 0.95rem; margin-bottom: var(--space-md); }
  .feature-link { font-family: var(--font-mono); font-size: 0.82rem; color: var(--accent-blue); }
  .feature-link:hover { color: var(--accent-cyan); }
</style>
```

- [ ] **Step 4: Create `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro'
import Hero from '../components/Hero.astro'
import FeatureCard from '../components/FeatureCard.astro'

const runtimes = ['Claude Code', 'Codex', 'Gemini CLI', 'Copilot', 'Ollama']
---
<BaseLayout>
  <main>
    <Hero />

    <section class="shot">
      <div class="shot-frame">
        <img src="/images/Manifold_ov.png" alt="Manifold workspace with multiple agents running in parallel" width="2524" height="1388" loading="eager" />
      </div>
      <p class="shot-caption">The Manifold workspace — agents, terminals, diffs, and search in one window.</p>
    </section>

    <section class="features container">
      <h2 class="section-heading">Everything you need to run agents in parallel</h2>
      <div class="feature-grid">
        <FeatureCard title="Parallel Agents" href="/docs/workspaces">
          Run multiple agents on one repository without branch collisions. Each gets its own git worktree on a dedicated branch.
        </FeatureCard>
        <FeatureCard title="Full Agent Terminal" href="/docs">
          Use the real agent terminal directly, with live streaming output and the ability to type input at any time.
        </FeatureCard>
        <FeatureCard title="Workspaces" href="/docs/workspaces">
          Group several repositories into one working set and run a single agent across all of them at once.
        </FeatureCard>
        <FeatureCard title="Automated Loop" href="/docs/loop">
          Run improve-and-evaluate cycles that score each attempt, commit on improvement, and revert on regression.
        </FeatureCard>
        <FeatureCard title="Search &amp; Memory" href="/docs/search">
          Search code, file names, and captured session memory — with an optional AI mode that answers questions.
        </FeatureCard>
        <FeatureCard title="Review Tools" href="/docs">
          Diffs, a file tree, split editors, shell tabs, and embedded localhost previews, all one click away.
        </FeatureCard>
      </div>
    </section>

    <section class="strip">
      <div class="container strip-inner">
        {runtimes.map((r) => <span class="strip-item">{r}</span>)}
      </div>
    </section>

    <section class="install container" id="install">
      <h2 class="section-heading">Get started</h2>
      <p class="install-intro">
        Download the latest <code>.dmg</code>, open it, and drag Manifold to <code>Applications</code>.
      </p>
      <div class="install-table-wrap">
        <table class="install-table">
          <thead><tr><th>Requirement</th><th>Notes</th></tr></thead>
          <tbody>
            <tr><td>macOS</td><td>The packaged app targets macOS only.</td></tr>
            <tr><td>Git</td><td>Required for worktrees, diffs, commits, and pull requests.</td></tr>
            <tr><td>A CLI agent on your <code>PATH</code></td><td>Claude Code, Codex, Copilot, or Gemini CLI.</td></tr>
            <tr><td>GitHub CLI (<code>gh</code>)</td><td>Optional — needed to create pull requests in-app.</td></tr>
            <tr><td>Ollama + a model</td><td>Optional — only for the Ollama-backed runtimes.</td></tr>
          </tbody>
        </table>
      </div>
      <div class="install-ctas">
        <a href="https://github.com/vippsas/manifold/releases" class="btn-primary">See all releases</a>
        <a href="/docs/install" class="hero-intel">Read the install guide</a>
      </div>
    </section>
  </main>
</BaseLayout>

<style>
  .shot { max-width: 940px; margin: var(--space-2xl) auto 0; padding: 0 var(--space-xl); }
  .shot-frame { border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-overlay); }
  .shot-frame img { width: 100%; height: auto; display: block; }
  .shot-caption { text-align: center; color: var(--text-muted); font-size: 0.85rem; margin-top: var(--space-md); }

  .section-heading { text-align: center; font-size: clamp(1.4rem, 3vw, 2rem); margin-bottom: var(--space-xl); }
  .features { margin-top: var(--space-2xl); }
  .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: var(--space-lg); }

  .strip { padding: var(--space-lg) 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); margin-top: var(--space-2xl); }
  .strip-inner { display: flex; justify-content: center; align-items: center; gap: var(--space-xl); flex-wrap: wrap; font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-secondary); }
  .strip-item::before { content: ''; display: inline-block; width: 6px; height: 6px; background: var(--accent-cyan); border-radius: 50%; margin-right: var(--space-sm); vertical-align: middle; }

  .install { margin-top: var(--space-2xl); max-width: 760px; }
  .install-intro { text-align: center; color: var(--text-secondary); margin-bottom: var(--space-lg); }
  .install-intro code, .install-table code { font-family: var(--font-mono); font-size: 0.85em; color: var(--accent-cyan); }
  .install-table-wrap { overflow-x: auto; }
  .install-table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
  .install-table th, .install-table td { text-align: left; padding: var(--space-sm) var(--space-md); border-bottom: 1px solid var(--border); }
  .install-table th { color: var(--accent-blue); font-family: var(--font-mono); font-size: 0.8rem; }
  .install-table td { color: var(--text-secondary); }
  .install-ctas { display: flex; gap: var(--space-md); align-items: center; justify-content: center; flex-wrap: wrap; margin-top: var(--space-xl); }
</style>

<script>
  // Scroll-reveal for feature cards.
  const els = document.querySelectorAll('.reveal')
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement
          el.style.transitionDelay = `${(i % 3) * 100}ms`
          el.classList.add('is-visible')
          io.unobserve(el)
        }
      })
    }, { threshold: 0.1 })
    els.forEach((el) => io.observe(el))
  } else {
    els.forEach((el) => el.classList.add('is-visible'))
  }
</script>
```

- [ ] **Step 5: Build and verify the landing page renders**

Run: `npm run build`
Expected: Build succeeds. `dist/index.html` exists, `dist/CNAME` exists, `dist/images/Manifold_ov.png` exists.

Verify with:
```bash
test -f dist/index.html && test -f dist/CNAME && test -f dist/images/Manifold_ov.png && echo OK
grep -q "A full developer workspace" dist/index.html && echo "hero OK"
grep -q "manifold.no" dist/CNAME && echo "cname OK"
```
Expected: `OK`, `hero OK`, `cname OK`.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add landing page with hero, features, install"
```

---

### Task 5: Docs content collection (Markdown sourced from README)

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/docs/getting-started.md`
- Create: `src/content/docs/install.md`
- Create: `src/content/docs/runtimes.md`
- Create: `src/content/docs/workspaces.md`
- Create: `src/content/docs/loop.md`
- Create: `src/content/docs/search.md`
- Create: `src/content/docs/troubleshooting.md`

- [ ] **Step 1: Create the content collection config `src/content.config.ts`**

```ts
import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    order: z.number(),
  }),
})

export const collections = { docs }
```

- [ ] **Step 2: Create `src/content/docs/getting-started.md`**

```markdown
---
title: "Getting Started"
description: "What Manifold is, who it's for, and how to get running."
order: 1
---

<!-- Source: vippsas/manifold README.md (intro + Highlights) -->

Manifold is a macOS desktop app for running AI coding assistants — Claude Code, Codex, Gemini CLI, Copilot, and Ollama-backed runtimes — side by side on the same codebase.

Each agent can get its own git worktree (a separate checkout on a dedicated branch) when you want isolation, so multiple agents work the same repo without branch conflicts. Agents run in **real terminals**, not wrapper UIs, so you read and steer their output directly. Around the terminals, Manifold adds the workspace tools you expect: code browsing, diffs, shell tabs, search, previews, commits, and pull requests.

## When to use Manifold

- You want to run **several agents in parallel** on one repository without them stepping on each other.
- You want to **see and steer** what an agent is doing in a real terminal.
- You want a **single workspace** for diffs, search, previews, commits, and pull requests around your agents.
- You want to run **one agent across multiple repositories** at once.

## Highlights

- Run multiple agents in parallel on one repository without branch collisions.
- Use the full agent terminal directly, with live streaming output and manual input at any time.
- Group several repositories into a **Workspace** and run one agent across all of them.
- Launch work on a new branch, the current branch, an existing branch, or an open pull request.
- Run automated **Loop** cycles that prompt, evaluate, and commit on improvement or revert on regression.
- Review changes with diffs, a file tree, split editors, shell tabs, and embedded localhost previews.
- Search code, file names, or captured session memory — with an optional AI mode.
- Keep project state, chat history, dock layout, open files, and shell tabs across restarts.

## Next steps

- [Install Manifold](/docs/install) and check the requirements.
- [Set up your runtimes](/docs/runtimes) (Claude Code, Codex, and more).
- Learn about [Workspaces](/docs/workspaces), [Loop](/docs/loop), and [Search](/docs/search).
```

- [ ] **Step 3: Create `src/content/docs/install.md`**

```markdown
---
title: "Install & Requirements"
description: "Download Manifold, check prerequisites, and verify your setup."
order: 2
---

<!-- Source: vippsas/manifold README.md (Install + Requirements + Verify) -->

## Download

Download the latest `.dmg` from the [GitHub Releases page](https://github.com/vippsas/manifold/releases), open it, and drag Manifold to `Applications`.

## Requirements

| Requirement | Notes |
| --- | --- |
| macOS | The packaged app and build scripts currently target macOS only. |
| Git | Required for repository management, worktrees, diffs, commits, and pull request flows. |
| One supported CLI agent on your `PATH` | Manifold checks for the runtime binaries directly. |
| GitHub CLI (`gh`) | Optional, but required for creating pull requests from inside the app. |
| Ollama + at least one pulled model | Optional, only needed for the Ollama-backed runtimes. |

## Verify your setup

Before launching Manifold, confirm the prerequisites are reachable from your shell:

```bash
git --version            # any recent Git
gh --version             # optional, needed for pull request creation
claude --version         # or: codex --version / gemini --version / copilot --version
```

If a runtime command is not found, install it (see [Runtimes & Setup](/docs/runtimes)) and make sure its binary is on your `PATH`.

## PATH on macOS

On startup, Manifold reads the `PATH` from your shell profile and appends common binary directories like `~/.local/bin`, `/opt/homebrew/bin`, and `/usr/local/bin`, so CLIs installed via Homebrew or similar tools are found even when Manifold is launched from Finder.
```

- [ ] **Step 4: Create `src/content/docs/runtimes.md`**

```markdown
---
title: "Runtimes & Setup"
description: "Install and configure the supported CLI coding agents."
order: 3
---

<!-- Source: vippsas/manifold README.md (Runtime Binaries) -->

Manifold launches real CLI agents. Install at least one and make sure its binary is on your `PATH`.

| Runtime | Binary | Install | Notes |
| --- | --- | --- | --- |
| Claude Code | `claude` | [claude.com/claude-code](https://www.claude.com/product/claude-code) | Built-in runtime. |
| Codex | `codex` | [github.com/openai/codex](https://github.com/openai/codex) | Built-in runtime. |
| Copilot | `copilot` | [github.com/github/copilot-cli](https://github.com/github/copilot-cli) | Built-in runtime. |
| Gemini CLI | `gemini` | [github.com/google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli) | Built-in runtime. |
| Claude Code (Ollama) | `ollama` | [ollama.com](https://ollama.com) | Launches via `ollama launch claude`; model selection required. |
| Codex (Ollama) | `ollama` | [ollama.com](https://ollama.com) | Launches via `ollama launch codex`; model selection required. |

## Verifying a runtime

After installing, confirm the binary is reachable:

```bash
claude --version    # or codex / gemini / copilot --version
ollama --version    # only for the Ollama-backed runtimes
```

If the command is not found, ensure the install location is on your `PATH`. Manifold appends common directories (`~/.local/bin`, `/opt/homebrew/bin`, `/usr/local/bin`) automatically, but a custom install location may still need to be added to your shell profile.
```

- [ ] **Step 5: Create `src/content/docs/workspaces.md`**

```markdown
---
title: "Workspaces"
description: "Group repositories and run a single agent across all of them."
order: 4
---

<!-- Source: vippsas/manifold README.md (The Workspace + Working Across Multiple Repositories) -->

## The workspace

Manifold opens straight into a full developer workspace — a panelled layout you can rearrange. The panel set includes a repositories sidebar, the agent terminal, search, a file tree, modified files, shell tabs, a web preview, and one or more editor panes.

Key workflows:

- Open an existing local repository or clone one from GitHub.
- Start an agent on a fresh worktree branch (named `<repo>/<task-slug>`, e.g. `manifold/fix-login-bug`).
- Start an agent directly on the current branch when you don't want a worktree.
- Continue work from an existing branch or an open pull request.
- Resume a stopped agent in place.
- Generate commit messages and pull request descriptions with the same runtime the session used.
- Detect merge conflicts and see how far ahead or behind the base branch you are.

## Working across multiple repositories

A **Workspace** groups several repositories into one working set so a single agent can operate across all of them at once.

- Create one from the **New Workspace** action in the sidebar and pick the repositories — and the runtime — to include.
- The first repository is the agent's working directory; the others are mounted through the runtime's own multi-directory flag (`--add-dir` for Claude, Codex, and Copilot; `--include-directories` for Gemini).
- When the agent starts, Manifold creates a worktree for every git repository in the set, all on the same branch (`manifold/<workspace-name>` by default), and removes them when the session ends.
- Add or remove repositories from a workspace at any time from its sidebar section.

Workspaces are useful when a task spans several repositories at once — for example, landing a change that touches both a backend and a frontend repo, or running the same refactor across many services.
```

- [ ] **Step 6: Create `src/content/docs/loop.md`**

```markdown
---
title: "Loop"
description: "Automated improve-and-evaluate cycles that commit on improvement."
order: 5
---

<!-- Source: vippsas/manifold README.md (Automated Loop) -->

The **Loop** dock panel runs an automated improve-and-evaluate cycle on an agent session:

1. Prompt the agent with your instruction.
2. Run a user-defined evaluation command.
3. Extract a numeric score from the result — a process exit code, a regex match on stdout, a field from JSON output, or an LLM judge.
4. Commit the changes if the score improved, or discard them and revert to the previous state if it regressed.
5. Repeat until you stop it or the maximum number of iterations is reached.

Each iteration has a configurable time limit; if the agent exceeds it, Manifold stops it automatically. Results are logged per worktree under `~/.manifold/loop-logs/`. The panel tracks the best score so far and offers **Restore Best** to jump back to the commit that produced it.

## When to use Loop

- Iterative improvements where success is measurable (test pass rate, benchmark score, lint count).
- Refactors you want to keep only if a metric improves.
- Any task where you can express "better" as a number that an evaluation command can emit.
```

- [ ] **Step 7: Create `src/content/docs/search.md`**

```markdown
---
title: "Search & Memory"
description: "Search code, files, and captured session memory — with an optional AI mode."
order: 6
---

<!-- Source: vippsas/manifold README.md (Search And Memory) -->

The workspace includes a search system that goes beyond file text search.

- **Search modes:** `code` (file contents), `files` (file names), `memory` (captured session data), or `everything` (code and memory together).
- **Search scopes:** the current session, all sessions for the current project, or across all registered projects — depending on mode.
- **Match modes:** literal or regex.
- Saved searches and recent searches are persisted per project.
- **Ask AI** can answer questions using the retrieved results as context, or re-sort exact matches by relevance, depending on settings.

## Session memory

Manifold captures session data locally and stores it per project in SQLite:

- **interactions** — prompts sent and responses received.
- **observations** — facts the agent noted during a session.
- **session summaries** — compressed overviews used when resuming long sessions.

That memory powers search and gives the agent relevant history when a session is resumed.
```

- [ ] **Step 8: Create `src/content/docs/troubleshooting.md`**

```markdown
---
title: "Troubleshooting"
description: "Common issues and where to look when something goes wrong."
order: 7
---

<!-- Source: vippsas/manifold README.md (Requirements, Local Data, Verify) -->

## A runtime binary is "not found"

Manifold checks for runtime binaries on your `PATH`. If a runtime isn't detected:

- Run `claude --version` (or `codex` / `gemini` / `copilot` / `ollama --version`) in your shell to confirm it's installed.
- Ensure the install location is on your `PATH`. Manifold appends `~/.local/bin`, `/opt/homebrew/bin`, and `/usr/local/bin` automatically; a custom location may need adding to your shell profile.
- See [Runtimes & Setup](/docs/runtimes) for install links.

## Pull request creation fails

Creating pull requests from inside the app requires the GitHub CLI (`gh`). Install it and run `gh auth login`, then confirm with `gh --version`.

## Where Manifold stores its data

By default, Manifold stores state under `~/.manifold/`:

| Path | Purpose |
| --- | --- |
| `~/.manifold/config.json` | User settings (storage path, default runtime, theme). |
| `~/.manifold/projects.json` | Registered projects (name, path, base branch). |
| `~/.manifold/memory/*.db` | Per-project SQLite memory stores. |
| `~/.manifold/loop-logs/*.jsonl` | Automated Loop iteration logs (one per worktree). |
| `~/.manifold/debug.log` | Debug log — check here first when something goes wrong. |
| `~/.manifold/worktrees/...` | Managed git worktrees (default location). |
| `~/.manifold/projects/...` | Locally generated app projects (default location). |

The storage root is configurable in **Settings → Storage Path**.

## Still stuck?

Open an issue or ask in [GitHub Discussions](https://github.com/vippsas/manifold/discussions).
```

- [ ] **Step 9: Build to verify the collection parses**

Run: `npm run build`
Expected: Build succeeds (it will still emit only `index.html` until docs pages exist in Task 6, but the content collection schema must validate). No Zod schema errors.

- [ ] **Step 10: Commit**

```bash
git add src/content.config.ts src/content/docs
git commit -m "feat: add docs content sourced from README"
```

---

### Task 6: Docs layout, sidebar, and dynamic docs pages

**Files:**
- Create: `src/components/DocsSidebar.astro`
- Create: `src/layouts/DocsLayout.astro`
- Create: `src/pages/docs/[...slug].astro`
- Create: `src/pages/docs/index.astro`

- [ ] **Step 1: Create `src/components/DocsSidebar.astro`**

```astro
---
import { getCollection } from 'astro:content'
const docs = (await getCollection('docs')).sort((a, b) => a.data.order - b.data.order)
const current = Astro.url.pathname.replace(/\/$/, '')
---
<nav class="docs-sidebar" aria-label="Documentation">
  <ul>
    {docs.map((doc) => {
      const href = doc.id === 'getting-started' ? '/docs' : `/docs/${doc.id}`
      const isActive = current === href || (href === '/docs' && current === '/docs')
      return (
        <li>
          <a href={href} class={isActive ? 'active' : ''}>{doc.data.title}</a>
        </li>
      )
    })}
  </ul>
</nav>

<style>
  .docs-sidebar ul { list-style: none; }
  .docs-sidebar li { margin-bottom: var(--space-xs); }
  .docs-sidebar a {
    display: block;
    padding: var(--space-sm) var(--space-md);
    border-radius: var(--radius-sm);
    font-size: 0.9rem;
    color: var(--text-secondary);
    border-left: 2px solid transparent;
    transition: background 150ms ease, color 150ms ease, border-color 150ms ease;
  }
  .docs-sidebar a:hover { background: var(--surface); color: var(--text-primary); }
  .docs-sidebar a.active { color: var(--accent-gold); border-left-color: var(--accent-gold); background: var(--surface); }
</style>
```

- [ ] **Step 2: Create `src/layouts/DocsLayout.astro`**

```astro
---
import BaseLayout from './BaseLayout.astro'
import DocsSidebar from '../components/DocsSidebar.astro'

interface Props {
  title: string
  description: string
}
const { title, description } = Astro.props
---
<BaseLayout title={`${title} — Manifold Docs`} description={description}>
  <div class="docs-shell container">
    <aside class="docs-aside">
      <DocsSidebar />
    </aside>
    <article class="docs-content">
      <h1 class="docs-title">{title}</h1>
      <div class="docs-body">
        <slot />
      </div>
    </article>
  </div>
</BaseLayout>

<style>
  .docs-shell { display: grid; grid-template-columns: 240px 1fr; gap: var(--space-2xl); padding-top: var(--space-2xl); padding-bottom: var(--space-2xl); align-items: start; }
  .docs-aside { position: sticky; top: 80px; }
  .docs-content { max-width: 720px; min-width: 0; }
  .docs-title { font-size: clamp(1.6rem, 4vw, 2.2rem); margin-bottom: var(--space-lg); color: var(--accent-gold); }

  .docs-body :global(h2) { font-size: 1.3rem; margin: var(--space-xl) 0 var(--space-md); color: var(--text-primary); }
  .docs-body :global(h3) { font-size: 1.05rem; margin: var(--space-lg) 0 var(--space-sm); color: var(--text-primary); }
  .docs-body :global(p) { color: var(--text-secondary); margin-bottom: var(--space-md); }
  .docs-body :global(ul), .docs-body :global(ol) { color: var(--text-secondary); margin: 0 0 var(--space-md) var(--space-lg); }
  .docs-body :global(li) { margin-bottom: var(--space-xs); }
  .docs-body :global(a) { color: var(--accent-blue); }
  .docs-body :global(a:hover) { color: var(--accent-cyan); }
  .docs-body :global(code) { font-family: var(--font-mono); font-size: 0.85em; color: var(--accent-cyan); background: var(--surface); padding: 1px 5px; border-radius: var(--radius-xs); }
  .docs-body :global(pre) { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-md); padding: var(--space-md); overflow-x: auto; margin-bottom: var(--space-md); }
  .docs-body :global(pre code) { background: none; padding: 0; color: var(--text-primary); }
  .docs-body :global(table) { width: 100%; border-collapse: collapse; font-size: 0.9rem; margin-bottom: var(--space-md); display: block; overflow-x: auto; }
  .docs-body :global(th), .docs-body :global(td) { text-align: left; padding: var(--space-sm) var(--space-md); border-bottom: 1px solid var(--border); }
  .docs-body :global(th) { color: var(--accent-blue); font-family: var(--font-mono); font-size: 0.8rem; }
  .docs-body :global(td) { color: var(--text-secondary); }

  @media (max-width: 768px) {
    .docs-shell { grid-template-columns: 1fr; gap: var(--space-lg); }
    .docs-aside { position: static; }
  }
</style>
```

- [ ] **Step 3: Create the catch-all docs page `src/pages/docs/[...slug].astro`**

This renders every doc EXCEPT `getting-started` (which is served at `/docs` by the index page in Step 4). Returning no param for `getting-started` keeps the URL clean and avoids a duplicate of `/docs`.

```astro
---
import { getCollection, render } from 'astro:content'
import DocsLayout from '../../layouts/DocsLayout.astro'

export async function getStaticPaths() {
  const docs = await getCollection('docs')
  return docs
    .filter((doc) => doc.id !== 'getting-started')
    .map((doc) => ({ params: { slug: doc.id }, props: { doc } }))
}

const { doc } = Astro.props
const { Content } = await render(doc)
---
<DocsLayout title={doc.data.title} description={doc.data.description}>
  <Content />
</DocsLayout>
```

- [ ] **Step 4: Create the docs home `src/pages/docs/index.astro`**

Serves the `getting-started` doc at `/docs`.

```astro
---
import { getEntry, render } from 'astro:content'
import DocsLayout from '../../layouts/DocsLayout.astro'

const doc = await getEntry('docs', 'getting-started')
if (!doc) throw new Error('getting-started doc not found')
const { Content } = await render(doc)
---
<DocsLayout title={doc.data.title} description={doc.data.description}>
  <Content />
</DocsLayout>
```

- [ ] **Step 5: Build and verify all docs pages render**

Run: `npm run build`
Expected: Build succeeds. These files exist:
```bash
test -f dist/docs/index.html && echo "docs home OK"
for p in install runtimes workspaces loop search troubleshooting; do
  test -f dist/docs/$p/index.html && echo "$p OK" || echo "$p MISSING"
done
grep -q "Install &amp; Requirements\|Install & Requirements" dist/docs/install/index.html && echo "install content OK"
```
Expected: `docs home OK`, six `OK` lines, `install content OK`.

- [ ] **Step 6: Commit**

```bash
git add src/components/DocsSidebar.astro src/layouts/DocsLayout.astro src/pages/docs
git commit -m "feat: add docs layout, sidebar, and pages"
```

---

### Task 7: GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

Uses the official Astro/GitHub Pages action pattern.

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - name: Install dependencies
        run: npm ci
      - name: Build
        run: npm run build
      - name: Upload Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: deploy site to GitHub Pages via Actions"
```

- [ ] **Step 3: Note the manual repo setting (do not skip)**

In the GitHub repo: **Settings → Pages → Build and deployment → Source** must be switched from "Deploy from a branch" to **"GitHub Actions"**. This is the one step that cannot be done from code; record it in the PR description so the maintainer flips it before/after merge. `public/CNAME` preserves the `manifold.no` custom domain through the Actions deploy.

---

### Task 8: Final verification (dev server + production preview)

**Files:** none (verification only)

- [ ] **Step 1: Production build + preview, then smoke-test the routes**

Run:
```bash
npm run build && npm run preview &
```
Wait ~2s for the preview server, then check key routes return 200 and contain expected content:
```bash
BASE=http://localhost:4321
curl -fsS $BASE/ | grep -q "A full developer workspace" && echo "landing OK"
curl -fsS $BASE/docs | grep -q "Getting Started" && echo "docs home OK"
curl -fsS $BASE/docs/workspaces | grep -q "Working across multiple repositories" && echo "workspaces OK"
curl -fsS $BASE/docs/loop | grep -q "improve-and-evaluate" && echo "loop OK"
```
Expected: `landing OK`, `docs home OK`, `workspaces OK`, `loop OK`. Then stop the preview server (`kill %1`).

Note: Astro's `preview` defaults to port 4321; if it reports a different port, use that.

- [ ] **Step 2: Confirm no broken internal links**

Every internal link target must resolve to a built file. Check the set referenced across the site:
```bash
for p in "" docs docs/install docs/runtimes docs/workspaces docs/loop docs/search docs/troubleshooting; do
  f="dist/${p:+$p/}index.html"
  test -f "$f" && echo "$f OK" || echo "$f MISSING"
done
```
Expected: all `OK`.

- [ ] **Step 3: Visual check (manual)**

Run `npm run dev`, open `http://localhost:4321`, and confirm:
- Hero, screenshot, feature cards (with scroll-reveal), runtimes strip, install table all render in the royal palette.
- Nav "Docs" link works; docs sidebar highlights the active page; tables and code blocks are styled.
- Resize to mobile width: nav collapses, feature grid stacks, docs sidebar moves above content.

Stop the dev server when done.

---

## Self-Review Notes

**Spec coverage check:**
- Hero / value prop → Task 4 (Hero.astro). ✓
- Screenshots → Task 4 (shot section, Manifold_ov.png moved to public). ✓
- Highlights / feature list → Task 4 (FeatureCard grid). ✓
- Install guide + requirements table → Task 4 (install section) + Task 5 (install.md). ✓
- Docs section (getting started, runtimes, workspaces, loop, search, troubleshooting) → Tasks 5 & 6. ✓
- Footer links (GitHub, Releases, Discussions, License) → Task 3 (Footer.astro). ✓
- Royal theme → Task 2 (theme.css). ✓
- GitHub Pages deploy + CNAME → Task 7 + Task 4 (public/CNAME). ✓
- Sync with README → Task 5 (source comments in each .md). ✓

**Type/name consistency:** Collection name `docs` is used identically in `content.config.ts`, `getCollection('docs')`, `getEntry('docs', ...)`. Doc ids (`getting-started`, `install`, `runtimes`, `workspaces`, `loop`, `search`, `troubleshooting`) match filenames and the routing filter in `[...slug].astro`. Version string `0.2.83` used in package.json, Hero, Footer.

**Placeholder scan:** No TBD/TODO; every code step contains full file content.
