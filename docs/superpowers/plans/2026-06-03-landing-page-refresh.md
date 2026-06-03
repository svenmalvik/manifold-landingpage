# Landing Page Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the landing page with a humble, developer-focused single page (nav → hero → agent strip → footer) styled to the app's Manifold Dark theme, and remove obsolete content.

**Architecture:** Single static `index.html` served by GitHub Pages at manifold.no. No build step, no framework, no dependencies. All CSS is inline in `<head>`. Verification is grep-based (content presence/absence) plus a visual render check, since the repo has no test harness.

**Tech Stack:** HTML5, inline CSS, Google Fonts (Inter + JetBrains Mono). Spec: `docs/superpowers/specs/2026-06-03-landing-page-refresh-design.md`.

---

## File Structure

- Modify: `index.html` — the entire page (head meta + inline CSS + body).
- Delete: `simple.png` — no longer referenced after Simple View section is cut.
- Unchanged: `CNAME`, `overview.png`, `package-lock.json`.

Preserved verbatim from the current page: favicon data-URI ghost, the two
v0.2.47 DMG download URLs, the GitHub repo URL, the `<title>` and meta
description.

---

### Task 1: Replace index.html with the new page

**Files:**
- Modify: `index.html` (full replacement)

- [ ] **Step 1: Overwrite `index.html` with the exact content below**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Manifold — One app. Many repos. Even more agents.</title>
  <meta name="description" content="Manifold orchestrates multiple AI agents across isolated branches so they never step on each other's code.">
  <meta property="og:title" content="Manifold — One app. Many repos. Even more agents.">
  <meta property="og:description" content="Manifold orchestrates multiple AI agents across isolated branches so they never step on each other's code.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://manifold.no">
  <meta property="og:image" content="https://manifold.no/overview.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="https://manifold.no/overview.png">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1024 1024' width='1024' height='1024'><rect width='1024' height='1024' rx='192' ry='192' fill='%230A0A0A'/><defs><mask id='g'><rect width='1024' height='1024' fill='white'/><circle cx='410' cy='440' r='52' fill='black'/><circle cx='614' cy='440' r='52' fill='black'/><path d='M430 540Q512 610 594 540Q570 580 512 590Q454 580 430 540Z' fill='black'/></mask></defs><path mask='url(%23g)' fill='%23CCFF00' d='M512 180C340 180 260 310 260 440L260 700Q260 740 290 740Q320 710 350 740Q380 770 410 740Q440 710 470 740Q500 770 530 740Q560 710 590 740Q620 770 650 740Q680 710 710 740Q740 770 764 740L764 440C764 310 684 180 512 180Z'/></svg>">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --canvas: #0A0A0E;
      --surface: #141418;
      --border: #2A2A32;
      --accent: #C9906D;
      --accent-hover: #D6A07D;
      --text: #E8E8F0;
      --text-dim: #9A9AAA;
      --text-dimmer: #6A6A78;
      --chartreuse: #CCFF00;
      --logo-bg: #0A0A0A;
      --font-mono: 'JetBrains Mono', monospace;
      --font-sans: 'Inter', sans-serif;
    }

    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    html { font-size: 16px; }

    body {
      background: var(--canvas);
      color: var(--text);
      font-family: var(--font-sans);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }

    a { color: var(--accent); text-decoration: none; }
    a:hover { color: var(--accent-hover); }
    a:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }

    .container { max-width: 1080px; margin: 0 auto; padding: 0 2rem; }

    /* Nav */
    nav { padding: 1.2rem 0; border-bottom: 1px solid var(--border); }
    .nav-inner { display: flex; justify-content: space-between; align-items: center; }
    .nav-brand { display: flex; align-items: center; gap: 0.6rem; }
    .nav-brand:hover { text-decoration: none; }
    .nav-brand span {
      font-family: var(--font-mono);
      font-weight: 700;
      font-size: 1.05rem;
      color: var(--text);
    }
    .nav-links a {
      font-family: var(--font-mono);
      font-size: 0.82rem;
      color: var(--text-dim);
    }
    .nav-links a:hover { color: var(--text); }

    /* Hero */
    .hero {
      text-align: center;
      padding: 5rem 0 3rem;
      background: radial-gradient(120% 70% at 50% -10%, #16120D 0%, var(--canvas) 55%);
    }
    .wordmark {
      font-weight: 300;
      letter-spacing: 0.4em;
      font-size: clamp(2.4rem, 7vw, 4.6rem);
      line-height: 1;
      color: var(--text);
      padding-left: 0.4em;
    }
    .hero-rule { width: 56px; height: 1px; background: var(--accent); margin: 1.6rem auto 1.4rem; }
    .hero-tagline { font-size: 1.25rem; font-weight: 400; color: var(--text); }
    .hero-lede {
      font-size: 1.02rem;
      color: var(--text-dim);
      max-width: 560px;
      margin: 1rem auto 0;
    }
    .hero-ctas {
      display: flex;
      gap: 1rem;
      align-items: center;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 2rem;
    }
    .btn-primary {
      display: inline-block;
      background: var(--chartreuse);
      color: var(--logo-bg);
      font-family: var(--font-mono);
      font-weight: 700;
      font-size: 0.9rem;
      padding: 0.85rem 1.75rem;
      border: 2px solid var(--chartreuse);
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
    }
    .btn-primary:hover { background: transparent; color: var(--chartreuse); }
    .btn-primary:focus-visible { outline: 2px solid var(--chartreuse); outline-offset: 2px; }
    .hero-intel { font-family: var(--font-mono); font-size: 0.8rem; color: var(--accent); }
    .hero-meta {
      margin-top: 1rem;
      font-family: var(--font-mono);
      font-size: 0.74rem;
      color: var(--text-dimmer);
    }

    /* Screenshot */
    .shot { max-width: 940px; margin: 3rem auto 0; padding: 0 2rem; }
    .shot-frame {
      border: 1px solid var(--border);
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 20px 70px rgba(0, 0, 0, 0.6);
    }
    .shot-frame img { width: 100%; height: auto; display: block; }

    /* Agent strip */
    .strip {
      padding: 1.4rem 0;
      border-top: 1px solid var(--border);
      border-bottom: 1px solid var(--border);
      margin-top: 4rem;
    }
    .strip-inner {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 2.4rem;
      flex-wrap: wrap;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      color: var(--text-dim);
    }
    .strip-inner span::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      background: var(--chartreuse);
      border-radius: 50%;
      margin-right: 0.5rem;
      vertical-align: middle;
    }

    /* Footer */
    footer { padding: 2.5rem 0; }
    .footer-inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    .footer-brand { font-family: var(--font-mono); font-weight: 700; color: var(--accent); }
    .footer-links { font-family: var(--font-mono); font-size: 0.78rem; color: var(--text-dimmer); }
    .footer-links a { color: var(--text-dim); }
    .footer-sep { margin: 0 0.5rem; color: var(--border); }

    /* Responsive */
    @media (max-width: 600px) {
      .container { padding: 0 1rem; }
      .hero { padding: 3rem 0 2rem; }
      .shot { padding: 0 1rem; }
      .strip-inner { gap: 1rem; }
      .footer-inner { flex-direction: column; gap: 1.2rem; text-align: center; }
    }

    @media (prefers-reduced-motion: reduce) {
      * { transition: none !important; }
    }
  </style>
</head>
<body>
  <main>
    <nav>
      <div class="container nav-inner">
        <a href="/" class="nav-brand">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="26" height="26" aria-hidden="true">
            <rect width="1024" height="1024" rx="192" ry="192" fill="#0A0A0A"/>
            <defs><mask id="gn"><rect width="1024" height="1024" fill="white"/><circle cx="410" cy="440" r="52" fill="black"/><circle cx="614" cy="440" r="52" fill="black"/><path d="M430 540Q512 610 594 540Q570 580 512 590Q454 580 430 540Z" fill="black"/></mask></defs>
            <path mask="url(#gn)" fill="#CCFF00" d="M512 180C340 180 260 310 260 440L260 700Q260 740 290 740Q320 710 350 740Q380 770 410 740Q440 710 470 740Q500 770 530 740Q560 710 590 740Q620 770 650 740Q680 710 710 740Q740 770 764 740L764 440C764 310 684 180 512 180Z"/>
          </svg>
          <span>Manifold</span>
        </a>
        <div class="nav-links">
          <a href="https://github.com/vippsas/manifold">GitHub</a>
        </div>
      </div>
    </nav>

    <header class="hero">
      <div class="container">
        <div class="wordmark">MANIFOLD</div>
        <div class="hero-rule"></div>
        <p class="hero-tagline">One app. Many repos. Even more agents.</p>
        <p class="hero-lede">Run Claude Code, Codex, and other CLI coding agents side by side on the same repo — each on its own isolated branch, in a real terminal.</p>
        <div class="hero-ctas">
          <a href="https://github.com/vippsas/manifold/releases/download/v0.2.47/Manifold-0.2.47-arm64.dmg" class="btn-primary">Download for macOS (Apple Silicon)</a>
          <a href="https://github.com/vippsas/manifold/releases/download/v0.2.47/Manifold-0.2.47.dmg" class="hero-intel">Intel</a>
        </div>
        <p class="hero-meta">Free &amp; open source · macOS · v0.2.47</p>
      </div>
    </header>

    <div class="shot">
      <div class="shot-frame">
        <img src="overview.png" alt="Manifold welcome screen with options to describe a project idea, add a local repository, or clone a repository" width="1600" height="900">
      </div>
    </div>

    <div class="strip">
      <div class="container strip-inner">
        <span>Claude Code</span>
        <span>Codex</span>
        <span>Gemini CLI</span>
        <span>Copilot</span>
        <span>Ollama</span>
      </div>
    </div>
  </main>

  <footer>
    <div class="container footer-inner">
      <span class="footer-brand">Manifold</span>
      <span class="footer-links">
        <a href="https://github.com/vippsas/manifold">GitHub</a>
        <span class="footer-sep">·</span>
        <span>MIT License</span>
        <span class="footer-sep">·</span>
        <span>v0.2.47</span>
      </span>
    </div>
  </footer>
</body>
</html>
```

- [ ] **Step 2: Verify removed content is gone**

Run: `grep -iE "Simple View|provisioner|feature-card|features-grid|Autoresearch|simple\.png|Not just for developers|mailto" index.html || echo "CLEAN"`
Expected: `CLEAN`

- [ ] **Step 3: Verify required content present**

Run: `grep -c -E "MANIFOLD|One app\. Many repos\.|overview\.png|Manifold-0.2.47-arm64.dmg|summary_large_image|manifold.no/overview.png" index.html`
Expected: `6` (one match per pattern; all present)

- [ ] **Step 4: Verify HTML is well-formed (balanced tags heuristic)**

Run: `grep -c "</" index.html` then visually confirm the file opens with `<!DOCTYPE html>` and ends with `</html>`.
Expected: closing tags present; document well-formed.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: redesign landing page — humble, developer-focused, app-aligned

Restyle to the app's Manifold Dark palette (#0A0A0E / #C9906D / #E8E8F0) with
the elegant letter-spaced MANIFOLD wordmark; reduce to nav -> hero -> agent
strip -> footer. Remove obsolete Simple View and provisioner sections. Refresh
OG image to the current welcome screen and use summary_large_image.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 2: Delete the obsolete simple.png asset

**Files:**
- Delete: `simple.png`

- [ ] **Step 1: Confirm nothing references it**

Run: `grep -rn "simple.png" . --include="*.html" --exclude-dir=.superpowers || echo "NO REFERENCES"`
Expected: `NO REFERENCES`

- [ ] **Step 2: Remove the file**

Run: `git rm simple.png`
Expected: `rm 'simple.png'`

- [ ] **Step 3: Commit**

```bash
git commit -m "chore: remove obsolete simple.png (Simple View section deleted)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

### Task 3: Visual + link verification

**Files:** none (verification only)

- [ ] **Step 1: Render the actual page for a visual check**

Copy the final `index.html` and `overview.png` into the brainstorm content dir
so it renders in the already-open visual companion browser, OR open `index.html`
directly. Confirm: hero wordmark + rose-gold rule, tagline, lede, chartreuse
Download button, Intel link, framed screenshot, agent strip, footer.

- [ ] **Step 2: Confirm responsive behavior**

Resize to ~600px width. Expected: container padding tightens, hero padding
reduces, footer stacks centered, agent strip wraps. Wordmark scales via clamp.

- [ ] **Step 3: Confirm links resolve**

Run: `grep -oE 'href="https://[^"]+"' index.html | sort -u`
Expected: only the v0.2.47 arm64 DMG, the v0.2.47 x64 DMG, the GitHub repo URL,
and the Google Fonts URL. No mailto, no dead anchors.

- [ ] **Step 4: Final diff review**

Run: `git diff --stat HEAD~2` (the two commits from Tasks 1-2)
Expected: `index.html` modified, `simple.png` deleted. Nothing else.

---

## Self-Review

**1. Spec coverage:**
- Hybrid styling / app palette → Task 1 `:root` tokens + wordmark. ✓
- Structure nav → hero → strip → footer → Task 1 body. ✓
- Cut features grid / Simple View / provisioners / extra nav links → Task 1 (absent) + Step 2 grep. ✓
- Kept tagline, agent strip, overview.png → Task 1. ✓
- Delete simple.png → Task 2. ✓
- OG image → manifold.no/overview.png + summary_large_image → Task 1 head. ✓
- Preserve v0.2.47 URLs/version → Task 1 (exact URLs + meta/footer). ✓
- Drop footer Download button → Task 1 footer (links only). ✓
- Responsive + reduced-motion + focus-visible + alt text → Task 1 CSS/markup. ✓

**2. Placeholder scan:** No TBD/TODO; full file content provided; exact commands. ✓

**3. Type/string consistency:** Class names used in CSS match the markup
(`nav-brand`, `wordmark`, `hero-rule`, `hero-tagline`, `hero-lede`, `hero-ctas`,
`btn-primary`, `hero-intel`, `hero-meta`, `shot`/`shot-frame`, `strip`/`strip-inner`,
`footer-inner`/`footer-brand`/`footer-links`/`footer-sep`). Download URLs identical
in hero and consistent with footer version string. ✓

No gaps found.
