---
title: "Start From Scratch"
description: "Create a new local web app from a one-line description and iterate on it with a live preview."
order: 5
---

<!-- Source: vippsas/manifold README.md (Building a Local App From a Prompt) -->

Manifold can create a new app from a one-line description, without an existing repository. When no project is selected, the sidebar offers **Start from scratch**, and **Start from copied instructions** if you already have a brief to paste.

## What happens

1. Manifold creates a project folder under your storage directory, at `~/.manifold/projects/...`, and registers it automatically.
2. An agent scaffolds the app and keeps iterating on it.
3. Manifold runs `npm install` and `npm run dev`, so the live preview appears straight away.
4. You keep going through a chat panel with the preview beside it. The full terminal, the diff, and the git tools stay one click away.

## The stack it uses

The agent is constrained to one local stack, so the result is predictable and runs without any external service:

- **React 19** and **TypeScript**
- **Vite** for the dev server and build
- **Dexie** over IndexedDB, so data stays in the browser
- **CSS Modules** for styling

## What this is for

This flow is meant for local prototyping. It's the fastest way to turn an idea into something you can click, and to find out whether it's worth building properly.

**Deployment is not implemented.** Nothing here publishes the app or runs it anywhere but your own machine. When a prototype earns a real home, move it into a repository of its own and treat it like any other project.
