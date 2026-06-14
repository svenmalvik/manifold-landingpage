# Manifold Landing Page & Documentation Site Design

**Date:** 2026-06-14  
**Status:** Approved  
**Scope:** Complete redesign of manifold.no to include comprehensive landing page with progressive feature reveals and dedicated documentation site.

---

## Overview

Manifold currently has a minimal landing page (hero, screenshot, download links) but lacks:
- Feature highlights and marketing narrative
- Comprehensive documentation (currently users must reference the GitHub README)
- Organized structure for discovery and learning

This design specifies a full landing page + documentation site built with Astro, deployed to GitHub Pages, using the Manifold royal design theme.

**Success Criteria:**
- Landing page clearly communicates "full developer workspace for orchestrating AI agents"
- Users can discover key features (parallel agents, workspace, Loop, search) without visiting GitHub
- Documentation is organized, discoverable, and maintainable (7 core sections sourced from README)
- Royal theme is applied cohesively across landing and docs
- Site loads fast (<2s landing, <1s docs) and is mobile-responsive
- Docs can expand independently post-launch

---

## Architecture

### Project Structure

```
manifold-landingpage/
├── src/
│   ├── layouts/
│   │   ├── BaseLayout.astro        # shared nav, footer, theme
│   │   └── DocsLayout.astro        # docs sidebar + content area
│   ├── pages/
│   │   ├── index.astro             # landing page
│   │   └── docs/
│   │       ├── index.astro         # /docs — getting started
│   │       ├── install.astro       # /docs/install
│   │       ├── runtimes.astro      # /docs/runtimes
│   │       ├── workspaces.astro    # /docs/workspaces
│   │       ├── loop.astro          # /docs/loop
│   │       ├── search.astro        # /docs/search
│   │       └── troubleshooting.astro # /docs/troubleshooting
│   ├── components/
│   │   ├── Navigation.astro
│   │   ├── Hero.astro
│   │   ├── FeatureCard.astro
│   │   ├── CodeBlock.astro
│   │   ├── Table.astro
│   │   └── Sidebar.astro
│   ├── content/
│   │   └── docs/
│   │       ├── getting-started.md
│   │       ├── install.md
│   │       ├── runtimes.md
│   │       ├── workspaces.md
│   │       ├── loop.md
│   │       ├── search.md
│   │       └── troubleshooting.md
│   └── styles/
│       ├── theme.css               # royal theme tokens & global styles
│       └── global.css
├── public/
│   └── images/
│       ├── Manifold_ov.png         # main screenshot
│       ├── feature-*.png           # feature supporting images
│       └── hero-bg.svg
└── astro.config.mjs
```

### Tech Stack

- **Framework:** Astro (static site generation)
- **Styling:** CSS custom properties (tokens) + component styles
- **Content:** Markdown for docs, sourced from `src/content/docs/`
- **Deployment:** GitHub Pages (via GitHub Actions)
- **Design System:** Manifold royal theme colors & typography

### Approach

**Single Astro site** with `/` (landing) and `/docs` (documentation subsection). Unified theme, separate visual emphasis. Landing page is marketing-focused with progressive feature reveals; docs are discoverable, well-organized reference material.

---

## Landing Page Design

### Scroll Flow & Sections

#### 1. Navigation Bar (Sticky)
- Left: Logo + "Manifold" wordmark (gold, #E2C275)
- Right: "Docs", "GitHub", Downloads links
- Background: Navy (#06080F) with subtle bottom border (#1A1D28)
- Hover states: Links turn gold, 150ms ease
- Mobile: Logo + hamburger menu

#### 2. Hero Section (Full Viewport Height)
- **Background:** Radial gradient (navy to deep blue) for depth
- **Wordmark:** "MANIFOLD" in large serif-style display, gold (#E2C275), tracking 0.4em
- **Tagline:** "A full developer workspace for orchestrating AI agents" (primary text, #E6ECF7)
- **Lede:** "Run Claude Code, Codex, Gemini CLI, and others side by side on the same codebase — each on its own isolated branch, in a real terminal." (secondary text, #A0A8BB)
- **CTAs:**
  - Primary: "Download for macOS (Apple Silicon)" — gold background, navy text, 12px padding, 4px radius
  - Secondary: "Intel" — blue text link
- **Meta:** "Free & open source · macOS · v0.2.83" (small, dimmed)
- **Spacing:** Centered, max-width 600px content area

#### 3. Screenshot Section
- Full-width `Manifold_ov.png` with subtle border (#1A1D28) and shadow (var(--shadow-elevated))
- Caption: "Manifold workspace with multiple agents running in parallel"
- Padding: 3rem top/bottom, 2rem left/right

#### 4. Feature Cards Section (Progressive Reveal)
Five feature cards, each with:
- **Title:** Gold (#E2C275)
- **Description:** 2-3 lines, secondary text
- **Icon/Supporting image:** Small 200x120px screenshot or icon
- **"Learn more" link:** Blue (#8FB4F2), underline on hover
- **Visual accent:** Left border in cyan (#7FC8E8)
- **Spacing:** Staggered fade-in animation on scroll (300ms ease, 100ms stagger between cards)

**Features highlighted:**
1. **Parallel Agents** — Run multiple agents without branch collisions using isolated worktrees
2. **Full Terminal** — Live streaming output and manual input at any time, real shells
3. **Workspaces** — Operate across multiple repositories with a single agent
4. **Loop** — Automated improvement cycles that evaluate, commit on success, revert on failure
5. **Code Review Tools** — Diffs, file tree, split editors, search, and localhost previews

#### 5. Install Section
- **Title:** "Get Started" (gold)
- **Requirements table:**
  - Requirement | Notes (matching README format)
  - macOS | The packaged app and build scripts target macOS only
  - Git | Required for repository management, worktrees, diffs, commits, PRs
  - One supported CLI agent | Claude Code, Codex, Copilot, Gemini CLI
  - GitHub CLI (gh) | Optional, required for creating PRs
  - Ollama + model | Optional, only for Ollama-backed runtimes
- **Download buttons:**
  - "Download v0.2.83 for macOS (Apple Silicon)" — primary gold button
  - "Intel" — secondary link
- **Link:** "See all releases on GitHub"

#### 6. Runtimes Strip
- Horizontal row of supported agents with small icons/text and cyan status dots
- "Supported: Claude Code · Codex · Gemini CLI · Copilot · Ollama"
- Subtle top/bottom borders in #1A1D28

#### 7. Footer
- Left: "Manifold" logo + "v0.2.83"
- Right: Links to GitHub, Releases, Discussions, MIT License
- Divider dots between links (cyan #7FC8E8)
- Background: Navy (#06080F) with subtle top border

### Visual Style

**Colors (Royal Dark Theme):**
- Canvas: #06080F
- Surface: #0E1017
- Text Primary: #E6ECF7
- Text Secondary: #A0A8BB
- Accent (Gold): #E2C275
- Accent (Blue): #8FB4F2
- Accent (Cyan): #7FC8E8
- Status (Green): #43C97A
- Border: #1A1D28

**Typography:**
- Headings: Inter Bold, 16px base, tracking 0.4em (wordmark style)
- Body: Inter Regular, 16px, 1.6 line-height
- Mono: JetBrains Mono for code/technical text

**Interactions:**
- Button hover: 150ms ease, gold → slight brightness increase (filter: brightness(1.12))
- Link hover: 150ms ease, blue text + gold underline
- Scroll reveals: Fade-in + 20px slide-up, 300ms ease (feature cards)

**Spacing Scale:** 8px, 16px, 24px, 32px (multiples of 8px)

**Layout:**
- Max-width: 1080px (content area)
- Desktop padding: 2rem
- Mobile padding: 1rem
- Mobile breakpoint: 768px

---

## Documentation Site Design

### Structure

**Navigation:** Sidebar (desktop) or hamburger (mobile) with 7 sections:
1. Getting Started
2. Install & Requirements
3. Runtimes & Setup
4. Workspaces
5. Loop
6. Search
7. Troubleshooting

**Layout:**
- Left sidebar (300px fixed on desktop, collapsible on mobile)
- Main content area (max-width 720px)
- Current section highlighted in gold, others in blue

### Documentation Pages

#### Page 1: Getting Started (`/docs/`)
- **Purpose:** Entry point, quick overview
- **Content:**
  - What is Manifold in 2 sentences
  - When to use it (use cases)
  - Key features recap
  - "5-minute demo" link or animated GIF
  - Quick links to Install, Getting Started, Troubleshooting
- **Length:** 3-5 min read

#### Page 2: Install & Requirements (`/docs/install`)
- **Purpose:** Step-by-step install and verification
- **Content:**
  - System requirements table (macOS, Git, CLI agent, optional gh/Ollama)
  - Download links (Apple Silicon, Intel)
  - Release history link
  - "Verify Your Setup" section (bash commands to test prerequisites)
  - Common issues and solutions
- **Length:** 2-3 min read

#### Page 3: Runtimes & Setup (`/docs/runtimes`)
- **Purpose:** Per-runtime installation and configuration
- **Content:**
  - Table: Runtime name | Binary | Install link | Notes
  - Expanded sections for each:
    - Claude Code (with claude.com/claude-code link)
    - Codex (with GitHub link)
    - Copilot (with GitHub link)
    - Gemini CLI (with GitHub link)
    - Ollama (with ollama.com link, model selection notes)
  - PATH configuration tip (macOS, Homebrew, etc.)
- **Length:** 5-10 min read

#### Page 4: Workspaces (`/docs/workspaces`)
- **Purpose:** How to group repos and run agents across them
- **Content:**
  - What is a workspace (concept)
  - When to use workspaces (use cases)
  - Step-by-step: Create a workspace, add repos, run an agent
  - Multi-directory flag explanation (--add-dir, --include-directories)
  - Worktree naming convention (manifold/<workspace-name>)
  - Best practices
- **Length:** 5-7 min read

#### Page 5: Loop (`/docs/loop`)
- **Purpose:** Automated improvement cycles
- **Content:**
  - How Loop works (prompt → evaluate → commit/revert cycle)
  - When to use Loop (iterative improvements)
  - Starting a Loop session (step-by-step)
  - Configuration options
  - Examples (refactoring, test improvement)
  - Stopping and resuming
- **Length:** 5-7 min read

#### Page 6: Search (`/docs/search`)
- **Purpose:** Finding code, files, memory, answers
- **Content:**
  - Search modes: full-text, AI mode
  - Searching code vs. file names vs. session memory
  - AI mode explanation (agent answers questions about the repo)
  - Query examples and tips
  - Search across workspaces
- **Length:** 3-5 min read

#### Page 7: Troubleshooting (`/docs/troubleshooting`)
- **Purpose:** Common issues and solutions
- **Content:**
  - "Runtime binary not found" → PATH configuration
  - "Git worktree conflicts" → explain isolation
  - "Agent hung or stopped" → restart logic
  - "Pull request creation failed" → requires gh CLI
  - "Search not working" → indexing explanation
  - Links to GitHub Issues and Discussions
- **Length:** 5-7 min read

### Content Sourcing & Maintenance

**Source of truth:** Manifold app README.md in the manifold repo

**Sourcing strategy:**
- Each doc file includes a frontmatter comment: `<!-- Source: manifold/README.md lines 40-60 -->`
- Content is NOT automatically synced (maintains editorial independence)
- When README is updated, maintainer reviews landing page docs and updates as needed
- Docs can expand beyond README with examples, use cases, and detailed walkthroughs

**Markdown frontmatter example:**
```yaml
---
title: "Runtimes & Setup"
description: "Install and configure supported AI agents"
order: 3
---

<!-- Source: manifold/README.md lines 40-60 -->

## Installation

[content here]
```

### Styling & Components

**Code blocks:**
- Monaco syntax highlighting using Royal Dark theme
- Copy-to-clipboard button
- Line numbers for longer blocks

**Tables:**
- Navy background (#06080F)
- Blue header row (#0E1017)
- Alternating row backgrounds (cyan tint, #0A1A20) for readability
- Gold borders between columns

**Callout boxes:**
- "Note" (blue left border): tips and clarifications
- "Warning" (red left border): cautions, gotchas
- "Tip" (green left border): best practices

**Internal links:** Blue (#8FB4F2), underline on hover

---

## Design System & Theme

### Colors (Royal Dark)

| Use | Token | Hex |
| --- | --- | --- |
| Canvas/Background | --canvas | #06080F |
| Surface/Card | --surface | #0E1017 |
| Text Primary | --text-primary | #E6ECF7 |
| Text Secondary | --text-secondary | #A0A8BB |
| Text Muted | --text-muted | #5E6B82 |
| Accent (Gold) | --accent-gold | #E2C275 |
| Accent (Blue) | --accent-blue | #8FB4F2 |
| Accent (Cyan) | --accent-cyan | #7FC8E8 |
| Status (Success) | --status-success | #43C97A |
| Status (Error) | --status-error | #D2495F |
| Border | --border | #1A1D28 |

### Typography

- **Font Sans:** Inter (headings, body)
- **Font Mono:** JetBrains Mono (code, technical)
- **Base Size:** 16px
- **Line Height:** 1.6 (body), 1.2 (headings)
- **Heading Weight:** 700 (bold)
- **Body Weight:** 400 (regular)

### Spacing Scale

- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

### Radius & Shadows

- **Border Radius:** 4px (buttons, cards), 2px (subtle)
- **Shadows:**
  - Subtle: `0 2px 8px rgba(0, 0, 0, 0.3)`
  - Elevated: `0 8px 24px rgba(0, 0, 0, 0.4)`
  - Overlay: `0 20px 70px rgba(0, 0, 0, 0.6)`

### Animations

- **Hover transitions:** 150ms ease
- **Scroll reveals:** 300ms ease fade-in + 20px slide-up
- **Stagger (feature cards):** 100ms delay between each card
- **Chevron/expand:** 100ms ease

---

## Deployment & Performance

### Build & Deploy

- **Framework:** Astro (static output)
- **Hosting:** GitHub Pages
- **Domain:** manifold.no (via CNAME)
- **CI/CD:** GitHub Actions on push to `main`
  - Trigger: `npm run build`
  - Output: `dist/` directory
  - Deploy: to `gh-pages` branch
- **Build time:** <10 seconds
- **Page load time targets:**
  - Landing page: <2s (90+ Lighthouse score)
  - Docs pages: <1s
  - Mobile: optimized at 375px

### Versioning

- Landing page version matches app version (currently v0.2.83)
- Update hero meta + footer on every app release
- Docs version in sidebar for transparency

### Mobile Responsiveness

- Desktop: 1080px max-width, 2rem padding
- Tablet (768px): 1000px max-width, 1.5rem padding
- Mobile (375px): full-width, 1rem padding
- Navigation: hamburger menu below 768px
- Docs sidebar: drawer/collapse below 768px
- Feature cards: stack vertically on mobile

---

## Content Sync & Maintenance Strategy

### Initial Setup
1. Copy content from manifold/README.md into `src/content/docs/*.md`
2. Add source comments (e.g., `<!-- Source: README.md lines 40-60 -->`) to track origin
3. Expand docs with examples, walkthroughs, and cross-links as needed
4. Keep landing page feature descriptions brief, linking to docs for details

### Ongoing Maintenance
- When manifold/README.md is updated, review changes
- Update landing page docs to reflect app changes (no automatic sync)
- Docs can grow independently with tutorials, use cases, and community feedback
- Version in footer/sidebar reflects current app version

### Future Expansion
- Add video tutorials to Getting Started
- Expand Troubleshooting with user-reported issues
- Add "Examples & Workflows" section for common patterns
- Community-contributed guides

---

## Success Criteria (Validation)

✓ Landing page at manifold.no clearly communicates the value proposition  
✓ Users can discover key features without visiting GitHub  
✓ Documentation is organized, searchable, and well-formatted  
✓ Royal design theme is applied cohesively across landing and docs  
✓ Site loads fast (<2s landing, <1s docs) and is mobile-responsive  
✓ Docs are sourced from README with clear attribution  
✓ Docs can expand independently post-launch  
✓ GitHub Pages deployment works on every push to `main`  
✓ Links to GitHub Releases, Discussions, and license work  

---

## Timeline & Next Steps

**Implementation:** Use superpowers:writing-plans to create detailed implementation plan with task breakdown, file creation order, and build sequence.

**Post-Launch:**
- Monitor load times and Lighthouse scores
- Gather user feedback on docs usefulness
- Expand troubleshooting based on common GitHub issues
- Add tutorials and use-case examples as community contributions grow
