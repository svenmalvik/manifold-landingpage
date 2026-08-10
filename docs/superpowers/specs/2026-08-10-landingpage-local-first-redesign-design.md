# manifold.no — local-first redesign

Date: 2026-08-10
Status: approved, ready for implementation plan

## Problem

manifold.no today is competent and forgettable. Three concrete failures:

1. **The hero screenshot shows nothing happening.** `public/images/Manifold_ov.png` is the
   empty *New agent* form — a name field, a runtime dropdown, a button. Its alt text
   promises "multiple agents running in parallel"; the image delivers an empty form. The
   single most valuable pixel real estate on the site proves nothing.
2. **The page lists features instead of making an argument.** Six visually identical cards,
   each ending in "Learn more →". A visitor cannot tell from this page why they would pick
   Manifold over the obvious alternative.
3. **The strongest claim Manifold can make is not on the page at all.** Manifold runs
   entirely on the user's machine. Nothing says so.

The best-funded competitor in this category leads on social proof — an animated
"100k+ builders" counter, a Linear/Vercel/Notion/Spotify logo wall, named testimonials —
and monetises a cloud tier at $50/mo individual, $60/mo/user for teams.

Manifold has 14 stars and 3 forks. **Social proof is an unwinnable axis and the page must
not attempt it.** No fake counters, no borrowed logos, no invented testimonials.

## Positioning

**Lead claim: your code never leaves your Mac.**

This is chosen deliberately. The category's leading paid product runs sessions in managed
cloud sandboxes and states in its own FAQ that it must store session inputs and outputs on
its servers, hosted in a single US region. That is a structural consequence of its business
model — it cannot answer this claim without abandoning its revenue.

Manifold answers it by construction.

**The competitor is never named, never linked, and never alluded to.** Every point of
difference is stated as a positive fact about Manifold, or as a plain absence. The reader
who has evaluated the alternative will complete the comparison themselves; the reader who
has not still gets a page that stands on its own.

### Claim verification

Every privacy claim below was verified against `vippsas/manifold` @ v0.2.108 before being
written. This section is load-bearing — do not weaken the verification when editing copy.

| Claim | Evidence | Verdict |
| --- | --- | --- |
| No telemetry or analytics | `git grep -riE "posthog\|mixpanel\|amplitude\|@sentry\|gtag\|plausible\|umami"` over `src/` and `package.json` returns only the English word "plausible" in two test comments | true |
| No account | No auth, login, or sign-in path anywhere in the app | true |
| No Manifold server | No first-party backend. All state under `~/.manifold` | true |
| AI-assisted features are opt-in | `src/shared/defaults.ts:64` sets `provider: 'none'`; `src/main/store/prompt-summarizer.ts` returns a local fallback string unless the user supplies their own key | true |
| Session data is local | Per-project SQLite at `~/.manifold/memory/*.db` | true |
| MIT licensed | `LICENSE` | true |
| 168 releases since March | `gh release list --limit 200 \| wc -l` = 168; repo created 2026-03-05 | true |

**One honest caveat, and the copy must respect it.** The auto-updater
(`electron-updater`) checks GitHub Releases by default. That is an outbound request. It
carries no code and no prompts. The page therefore says *"no telemetry, no analytics, no
account"* — all literally true — and never says the absolute *"Manifold makes no network
requests"*, which would be false.

The page must also not imply that the coding agents themselves run offline by default.
They send code to whichever provider the user configured. The precise and defensible
framing, used verbatim in section 3: **"Prompts go straight from your machine to the
provider you already pay for. Nothing is proxied, stored, or replayed by us."** The
offline claim is made only where it is true — the Ollama runtimes, in section 7.

## Theme

Commit to the app's own design language, documented in `.claude/skills/design/SKILL.md` as
a "Jacob & Co luxury aesthetic". The competitor is doing neutral grayscale minimalism, and
doing it well; matching it means competing on their terms with less budget. The luxury
identity is already designed, already shipping in the product, and is the one axis where a
free tool can look more expensive than a $50/mo one.

- **Default theme changes from `neon-dark` to `manifold-dark`** — rose gold `#C9906D` on
  near-black `#0A0A0E`. The eponymous theme should be the one visitors see. Neon lime is
  the least luxurious of the set and is currently the default.
- Near-black canvas. Darkness is the canvas, not the absence of design.
- Dual metals: rose gold for interactive, white gold for emphasis.
- Brushed-metal separation: `inset 0 1px 0 rgba(255,255,255,.08)` over
  `0 24px 70px -12px rgba(0,0,0,.8)`. Already implemented as `--frame-*`; extend it to
  every framed surface, not just the hero shot.
- Gemstone status colours — running turquoise, waiting amber, done emerald, error ruby.
  Introduce them on the page as a legend so the language is learned before install.
- **Motion is restrained: 150–200ms ease. No spring, no bounce, no entrance choreography.**
  Luxury means restraint, not spectacle. One deliberate exception in section 6, justified
  there.

### Typography

| Role | Face | Rationale |
| --- | --- | --- |
| Display — hero, section headings | **Instrument Serif** (400 + italic) | The app already sets agent headings in a serif (`--font-display: ui-serif, 'New York', Georgia, …`). Instrument Serif is the high-contrast editorial equivalent that survives on the web. |
| Body / UI | Inter | Already in use. Keep. |
| Meta, labels, code, status | JetBrains Mono | Already in use. Keep. |

Three families, each with a distinct job. The serif is what makes the page stop reading
like every other developer-tool site.

### Theme drift — fix during implementation

`src/themes/data/` vendors **12** themes; the app ships **10** (Garfield, Jade, Manifold,
Neon, Platinum — each light and dark). **Royal Dark and Royal Light no longer exist in the
app** and must be dropped. Re-vendor from `vippsas/manifold` `src/shared/themes/data/` and
regenerate with `npm run themes`. Copy says "ten themes"; the switcher must offer exactly
what the app ships.

Note: visitors with `manifold-theme: royal-*` in localStorage must fall back cleanly to
`manifold-dark` rather than rendering unstyled. The existing guard in `BaseLayout.astro`
validates against `themeIds` and already handles this — verify it still does after the
re-vendor.

## Page structure

Thirteen sections. Each earns its place by advancing the argument.

### 0 — Nav

Structure unchanged: brand, Docs, GitHub, theme switcher, Download. Sticky, blurred,
hairline bottom border. Add nothing.

### 1 — Hero

```
                      M A N I F O L D
                      ──────────────

              Every agent. Every repo.
              Nothing leaves your Mac.

     Run Claude Code, Codex, Gemini CLI, Copilot — and local
     models — side by side on one codebase. Real terminals,
     isolated git branches, all on your own disk.

           [ Download for macOS (Apple Silicon) ]   Intel

        MIT licensed · no account · no telemetry · v0.2.108
```

Headline in Instrument Serif; *Nothing leaves your Mac.* set in italic on its own line.
Keep the letterspaced wordmark and the white-gold hairline rule — both are working.
Background keeps the existing radial gold bloom.

### 2 — Product shot

**Replace the empty-form image with a real workspace capture**: repositories sidebar, an
agent running in a live terminal, a diff open beside it. This is the single highest-value
fix on the page.

Beneath it, a mono legend introducing the status language:

```
● running    ● waiting    ● done    ● error
```

Caption: *Four agents on one repository. Four git worktrees. One window.*

### 3 — Nothing leaves your Mac

The lead claim, proven. Carries a diagram rather than a paragraph.

```
   your Mac
   ┌─────────────────────────────┐
   │  Manifold                   │
   │    agent terminals          │ ──→   the model provider
   │    git worktrees            │        you already pay for
   │    ~/.manifold/  (SQLite)   │
   └─────────────────────────────┘
                 ╳
        no Manifold server
```

> There is no Manifold account, because there is no Manifold server.
>
> Your repositories, your worktrees, your session history and your captured memory live in
> `~/.manifold` on your own disk. Prompts go straight from your machine to the provider you
> already pay for. Nothing is proxied, stored, or replayed by us.

```
Sessions run on your machine — not in someone else's sandbox.
Session history in local SQLite, per project, under ~/.manifold.
AI-assisted features are off by default and use your own key.
MIT licensed — don't take our word for it, read it.
```

### 4 — A real terminal. Not a transcript of one.

> Manifold runs the agent's actual CLI in a real PTY. You see the live stream, ANSI and
> all, and you can type into a running agent mid-task — correct it, answer it, redirect it
> — without restarting the session.
>
> When an agent goes wrong at step nine of twelve, you steer it. You don't start over.

Asset: terminal close-up mid-stream.

### 5 — Four agents. Four branches. One repo.

Worktree diagram: one repository fanning out into four branches named
`manifold/fix-login-bug` style, each with a gemstone status dot.

Copy covers: automatic `<repo>/<task-slug>` branch naming, no collisions, and the four
launch modes — new branch, current branch, existing branch, or an open pull request.

### 6 — Loop: agents that grade their own work

**The section no competitor can copy.** Full-bleed treatment, most visual weight on the
page after the hero.

```
   1  prompt the agent
   2  run your evaluation command
   3  extract a score   exit code · regex · JSON field · LLM judge
   4  score improved?   commit  ·  regressed?  revert
   5  repeat
```

> Set a command that scores your codebase and let an agent grind against it. Every
> iteration that improves the score gets committed. Every iteration that makes things worse
> is thrown away. Per-iteration time limits, logs under `~/.manifold/loop-logs/`, and
> **Restore Best** to jump back to the best commit at any point.

**This is the one place motion is allowed beyond hover transitions.** The five steps may
animate on a slow cycle, because the animation *explains the feature* — it earns its
pixels under the design system's own rule. Honour `prefers-reduced-motion`.

### 7 — Every agent. Including the ones that work offline.

Runtime grid — Claude Code, Codex, Copilot, Gemini CLI, Claude Code (Ollama), Codex
(Ollama).

The two Ollama cards get emphasis and this line:

> Point Claude Code or Codex at a local Ollama model and the loop closes completely: your
> code, your machine, your inference. No API key. No network.

This is where the offline claim is true, and it retroactively proves section 3.

### 8 — One agent. Many repositories.

Workspaces. Backend, frontend and infra in one working set; one agent sees all of them
from the start. Worktrees created on the same branch across every repo in the set and torn
down when the session ends. Mounted through each runtime's own flag — `--add-dir` for
Claude, Codex and Copilot, `--include-directories` for Gemini.

> No orchestration layer. No per-tool approval step. The agent just has all of it.

Note the feature is opt-in via **Settings → General → Enable Workspaces**.

### 9 — It remembers.

Search and memory. Four modes — code, files, memory, everything. Three scopes — this
session, this project, every project. Literal or regex. Saved and recent searches per
project. Optional Ask AI over the results.

> Manifold captures what happened — prompts, responses, observations the agent noted,
> session summaries — into per-project SQLite. Resume a stopped session weeks later and the
> agent gets its history back.

### 10 — The receipt

The comparison section, containing no comparison. Mono, generous leading, no ornament.

```
No account to create.
No seat price.
No Pro tier.
No server in the middle.
No telemetry.
No lock-in — it's your git, your branches, your disk.
```

> Free under the MIT licence. 168 releases since March. Fork it if we get it wrong.

Nothing else. The whitespace does the work.

### 11 — Ten themes

> Ten themes ship with the app. This page wears them too.

A row of ten swatches that re-theme the entire page live on click. The switcher exists
today as a nav dropdown; promoting it to a section converts a utility into proof of craft —
and it is genuinely delightful. The nav dropdown stays for wayfinding.

### 12 — Get started

**Delete the requirements table.** A five-row matrix of caveats is documentation, and it is
the last thing between a convinced reader and a download. Move it to `/docs/install`.

```
1   Download the .dmg and drag Manifold to Applications
2   Make sure one agent CLI is on your PATH
3   Open a repo. Start an agent.


$ claude --version     # or codex / gemini / copilot
$ git --version
$ gh --version         # optional — for opening PRs in-app
```

CTAs: **Download for macOS** · Read the install guide · See all releases.

### 13 — Footer

Unchanged, plus the release-cadence line.

## What gets removed

| Removed | Because |
| --- | --- |
| `Manifold_ov.png` as hero | Empty form; proves nothing |
| The six uniform feature cards | Replaced by argued sections |
| The requirements table | Moved to `/docs/install`; it blocks conversion |
| Royal Dark / Royal Light | No longer exist in the app |

`FeatureCard.astro` supports an `image` prop that no caller uses. Either use it in the
runtime grid or delete the prop — do not leave it dead.

## Assets to capture

From a running dev instance, all in **manifold-dark**, window sized to a 16:9 crop:

1. Full workspace — sidebar, running agent terminal, open diff → section 2
2. Terminal close-up mid-stream → section 4
3. Loop panel with score history and Restore Best → section 6
4. Search panel, memory mode → section 9
5. Workspace sidebar with a multi-repo working set → section 8

Serve at 2× and compress to WebP. The current PNG is 2524px wide and unoptimised; the
redesign must not make the page heavier. **Budget: no section image above 250 KB.**

Capture on a scratch repository. Shots must contain no employer-internal repository names,
no customer identifiers, and no session content from real work.

## Non-goals

- No fabricated social proof of any kind — no star counts, no user numbers, no logo wall,
  no testimonials. Revisit only when the numbers are real and flattering.
- No pricing page. There is no price.
- No blog or changelog surface. GitHub Releases is the changelog; link it.
- No naming, screenshotting, or linking of any competitor.
- No newsletter capture, no cookie banner, no third-party scripts. The page must be able to
  keep the promise its own copy makes.

## Success criteria

1. A visitor who has already evaluated the paid alternative can state, unprompted, the
   three things Manifold does differently.
2. Every factual claim traces to the verification table or to `vippsas/manifold` source.
3. The page ships zero third-party requests — no fonts from a CDN at runtime, no analytics.
   **Self-host Instrument Serif, Inter and JetBrains Mono.** `theme.css` currently pulls
   Inter and JetBrains Mono from `fonts.googleapis.com`; that must be removed. A page whose
   headline is "nothing leaves your Mac" cannot report the visitor to Google.
4. Lighthouse ≥ 95 across performance, accessibility and best practices.
5. All ten themes render every section correctly, light and dark.
6. `prefers-reduced-motion` disables the Loop animation.

## Risks

**Install friction — checked, and it is fine.** A page that argues trust cannot hand the
reader a Gatekeeper warning thirty seconds later. Verified: `package.json` sets
`hardenedRuntime: true`, `notarize: true` and a signing entitlements file, so the `.dmg`
opens cleanly. No warning copy is needed in section 12.

**macOS-only.** Linux is a source build and Windows is unsupported. The page should not
hide this — the hero meta line already says macOS, and section 12 links the install guide
for the WSL2 path. Accept as-is.

**The argument depends on the reader knowing the alternative.** Sections 3, 7 and 10 land
hardest on someone who has already priced a cloud agent product. A cold reader gets a page
about a local-first tool, which is still coherent — but the persuasion is weaker. This is
the accepted cost of never naming a competitor, and it is the right trade.
