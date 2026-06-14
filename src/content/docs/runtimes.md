---
title: "Runtimes & Setup"
description: "Install and configure the supported CLI coding agents."
order: 3
---

<!-- Source: vippsas/manifold README.md (Runtime Binaries) -->

Manifold launches real CLI agents. Install at least one and make sure its binary is on your `PATH`.

| Runtime | Binary | Install | Notes |
| --- | --- | --- | --- |
| Claude Code | `claude` | [claude.com/claude-code](https://www.claude.com/product/claude-code) | Built-in runtime. |
| Codex | `codex` | [github.com/openai/codex](https://github.com/openai/codex) | Built-in runtime. |
| Copilot | `copilot` | [github.com/github/copilot-cli](https://github.com/github/copilot-cli) | Built-in runtime. |
| Gemini CLI | `gemini` | [github.com/google-gemini/gemini-cli](https://github.com/google-gemini/gemini-cli) | Built-in runtime. |
| Claude Code (Ollama) | `ollama` | [ollama.com](https://ollama.com) | Launches via `ollama launch claude`; model selection required. |
| Codex (Ollama) | `ollama` | [ollama.com](https://ollama.com) | Launches via `ollama launch codex`; model selection required. |

## Verifying a runtime

After installing, confirm the binary is reachable:

```bash
claude --version    # or codex / gemini / copilot --version
ollama --version    # only for the Ollama-backed runtimes
```

If the command is not found, ensure the install location is on your `PATH`. Manifold appends common directories (`~/.local/bin`, `/opt/homebrew/bin`, `/usr/local/bin`) automatically, but a custom install location may still need to be added to your shell profile.
