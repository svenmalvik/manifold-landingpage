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
| `~/.manifold/debug.log` | Debug log. Check here first when something goes wrong. |
| `~/.manifold/worktrees/...` | Managed git worktrees (default location). |
| `~/.manifold/projects/...` | Locally generated app projects (default location). |

The storage root is configurable in **Settings → Storage Path**.

## Still stuck?

Open an issue or ask in [GitHub Discussions](https://github.com/vippsas/manifold/discussions).
