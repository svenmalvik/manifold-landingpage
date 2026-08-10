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
| Platform | Packaged `.dmg` releases target macOS. x64 WSL2 with WSLg is supported through a local source build (`./install-linux.sh`). No Windows-native build is packaged today. |
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
