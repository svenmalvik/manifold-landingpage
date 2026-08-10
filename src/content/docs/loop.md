---
title: "Loop"
description: "Automated improve-and-evaluate cycles that commit on improvement."
order: 6
---

<!-- Source: vippsas/manifold README.md (Automated Loop) -->

The **Loop** dock panel runs an automated improve-and-evaluate cycle on an agent session. It ships as a bundled [plugin](/docs/plugins), `manifold.loop`, and is enabled out of the box.

1. Prompt the agent with your instruction.
2. Run a user-defined evaluation command.
3. Extract a numeric score from the result: a process exit code, a regex match on stdout, a field from JSON output, or an LLM judge.
4. Commit the changes if the score improved, or discard them and revert to the previous state if it regressed.
5. Repeat until you stop it or the maximum number of iterations is reached.

Each iteration has a configurable time limit; if the agent exceeds it, Manifold stops it automatically. Results are logged per worktree under `~/.manifold/loop-logs/`. The panel tracks the best score so far and offers **Restore Best** to jump back to the commit that produced it.

## When to use Loop

- Iterative improvements where success is measurable (test pass rate, benchmark score, lint count).
- Refactors you want to keep only if a metric improves.
- Any task where you can express "better" as a number that an evaluation command can emit.
