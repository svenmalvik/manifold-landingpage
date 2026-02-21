# Manifold Landing Page — Design

## Architecture

Single `index.html` file with embedded `<style>` and `<script>` blocks. No build step, no dependencies, no external CSS frameworks.

## Tech Stack

- Static HTML/CSS/JS
- Google Fonts: JetBrains Mono (headlines, code), Inter (body text)
- No build tools, no frameworks

## Color System

| Role | Color | Hex |
|------|-------|-----|
| Background/text | Void Black | `#0A0A0A` |
| Accent | Electric Chartreuse | `#CCFF00` |
| Body text | White | `#FAFAFA` |

Implemented as CSS custom properties.

## Visuals

All visuals are ASCII art in `<pre>` blocks with chartreuse `<span>` highlights:
- Hero: Three terminal panes (Claude Code, Codex, Gemini CLI)
- Section 1: Side-by-side identical terminals
- Section 2: Git branch diagram forking from main
- Section 3: Project switcher list
- Section 4: Multi-pane UI mockup
- Section 5: Three numbered steps

## Animations

CSS-only cursor blink (`@keyframes`). No JS animations, no scroll effects.

## Design Rules

- 0px border-radius on all elements
- No gradients — flat fills only
- No stock photos
- Dense, information-rich layout
- Terminal aesthetic throughout

## Responsive Breakpoints

- Desktop: >1024px — multi-column, 64px+ hero text
- Tablet: 768–1024px — stacked columns, maintained type scale
- Mobile: <768px — single column, 36px hero text

## Page Structure

1. Hero — headline, subheadline, CTA, ASCII terminal panes
2. "The Real Thing" — side-by-side ASCII terminals
3. "Parallel Without the Pain" — feature points + ASCII branch diagram
4. "Multi-Repo, Multi-Agent" — ASCII project switcher
5. "Built for the Terminal" — feature list + ASCII UI mockup
6. "How It Works" — 3-step horizontal layout
7. "Open Source" — GitHub CTA
8. Footer — GitHub link, license, version

## CTAs

- "Download for macOS" — chartreuse fill, black text, sharp corners (placeholder href)
- "View on GitHub" — chartreuse border outline, chartreuse text (placeholder href)
