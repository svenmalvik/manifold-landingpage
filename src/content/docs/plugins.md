---
title: "Plugins"
description: "What ships with Manifold, how to write your own, and where the capability boundary sits."
order: 8
---

<!-- Source: vippsas/manifold src/shared/plugins/manifest.ts, src/main/plugins/, docs/architecture/plugins.md, resources/plugins/* -->

Manifold's own features are plugins. The automated Loop is one of them, so the extension model is the one the app is built on.

## What ships

| Plugin | Id | What it does |
| --- | --- | --- |
| Autoresearch Loop | `manifold.loop` | The improve-and-evaluate cycle. See [Loop](/docs/loop). |
| Statistics | `manifold.statistics` | Per-runtime quality metrics and recent sessions across every repository. |
| Worktrees | `manifold.worktrees` | Every managed worktree, in one view. |
| Watch | `manifold.watch` | Hand the agent a video and get frames, a transcript, and a report. |

Three `hello` plugins also ship as API samples, including one that demonstrates the VS Code shim. They are examples rather than features.

## Writing your own

Manifold scans two directories at startup:

- bundled plugins, shipped inside the app
- your own plugins, in `~/.manifold/plugins`

A plugin is a folder with a `package.json`. It needs `name`, `publisher`, `version`, and an `engines.manifold` range. Every plugin that ships with the app declares `^0.3.0`, so match that. The id becomes `publisher.name`, and both parts are restricted to lowercase letters, digits, and hyphens, so an id can never contain a path separator.

```json
{
  "name": "release-notes",
  "publisher": "acme",
  "version": "0.1.0",
  "engines": { "manifold": "^0.3.0" },
  "main": "./index.js",
  "capabilities": ["workspace:read", "storage"]
}
```

A malformed manifest is reported as an error and logged. It never stops the app from starting.

## Capabilities

Each plugin declares the capabilities it needs, and the host enforces that list. An unrecognised capability rejects the whole manifest instead of being ignored, so a typo can't widen what a plugin can reach.

Three capabilities are available to any plugin you write:

| Capability | What it allows |
| --- | --- |
| `storage` | A per-plugin key and value store, guarded against path escapes. |
| `workspace:read` | Read the current workspace and its repositories. |
| `configuration` | Read the plugin's own configuration. |

Seven more are granted only to plugins that ship inside the app, whatever a manifest asks for: `workspace:manage`, `agent:control`, `agent:spawn`, `lm`, `transcription:read`, `verdicts:read`, and `verdicts:write`.

So a plugin that reads the workspace, keeps its own state, or contributes a view is yours to write and drop in. One that drives an agent, spawns one, or reaches the language model has to be built in. If your team needs that reach, [get in touch](/enterprise) and it can ship as a built-in under the same MIT licence.

## How plugins are isolated

- Each plugin runs in a forked host process, not in the app's main process and not in the interface.
- Plugin webviews are served over their own URL scheme with a nonce content security policy.
- Per-plugin storage is written under the plugin's id, and the id can't contain a path separator.

The [security page](/security) covers the same boundary from a reviewer's point of view.

## VS Code extensions

Manifold reads a manifest with an `engines.vscode` entry as a VS Code extension. A subset works unmodified: the entry point, activation events, commands, and tree views. Imported extensions are never granted capabilities.
