---
title: "Search & Memory"
description: "Search code, files, and captured session memory — with an optional AI mode."
order: 6
---

<!-- Source: vippsas/manifold README.md (Search And Memory) -->

The workspace includes a search system that goes beyond file text search.

- **Search modes:** `code` (file contents), `files` (file names), `memory` (captured session data), or `everything` (code and memory together).
- **Search scopes:** the current session, all sessions for the current project, or across all registered projects — depending on mode.
- **Match modes:** literal or regex.
- Saved searches and recent searches are persisted per project.
- **Ask AI** can answer questions using the retrieved results as context, or re-sort exact matches by relevance, depending on settings.

## Session memory

Manifold captures session data locally and stores it per project in SQLite:

- **interactions** — prompts sent and responses received.
- **observations** — facts the agent noted during a session.
- **session summaries** — compressed overviews used when resuming long sessions.

That memory powers search and gives the agent relevant history when a session is resumed.
