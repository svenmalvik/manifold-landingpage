---
title: "Workspaces"
description: "Group repositories and run a single agent across all of them."
order: 4
---

<!-- Source: vippsas/manifold README.md (The Workspace + Working Across Multiple Repositories) -->

## The workspace

Manifold opens straight into a full developer workspace, a panelled layout you can rearrange. The panel set includes a repositories sidebar, the agent terminal, search, a file tree, modified files, shell tabs, a web preview, and one or more editor panes.

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

- Create one from the **New Workspace** action in the sidebar, then pick the repositories and the runtime to include.
- The first repository is the agent's working directory; the others are mounted through the runtime's own multi-directory flag (`--add-dir` for Claude, Codex, and Copilot; `--include-directories` for Gemini).
- When the agent starts, Manifold creates a worktree for every git repository in the set, all on the same branch (`manifold/<workspace-name>` by default), and removes them when the session ends.
- Add or remove repositories from a workspace at any time from its sidebar section.

Workspaces are useful when a task spans several repositories at once. One example is landing a change that touches both a backend and a frontend repo. Another is running the same refactor across many services.
