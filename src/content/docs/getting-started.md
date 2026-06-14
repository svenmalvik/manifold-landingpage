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
