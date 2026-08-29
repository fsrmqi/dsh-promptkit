# PromptKit

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/fsrmqi/dsh-promptkit/actions/workflows/ci.yml/badge.svg)](https://github.com/fsrmqi/dsh-promptkit/actions/workflows/ci.yml)
[![DSH Plugin](https://img.shields.io/badge/DSH-Plugin-blue.svg)](https://github.com/topics/dsh-plugin)
[![Node: >=18](https://img.shields.io/badge/node-%3E%3D18-green.svg)](https://nodejs.org)
[![Listed on dsh-plugin.org](https://dsh-plugin.org/badges/listed.svg)](https://dsh-plugin.org/plugins/fsrmqi/dsh-promptkit)

[English](README.md) · [简体中文](README.zh.md)

> Turn a rough draft into a structured, executable prompt — in one click, inside DeepSeek Harness.

<!-- TODO: 录制 GIF 后替换：写草稿 → 一键增强 → 流式上屏 + 五维诊断，8 秒内 -->
<!-- ![enhance-demo](docs/images/enhance-demo.gif) -->

```bash
dsh plugin --profile web add dsh-promptkit
```

That's it. Write a draft, hit **✦ Enhance**, get a structured prompt back — streaming into a preview panel, never auto-sent. No API key, no config: it reuses the model of your current session.

## Why PromptKit

**✦ One-click enhancement with diagnosis.** Before rewriting, the plugin examines your draft on five dimensions (clarity · hidden premises · falsifiability · actionability · context fit) and shows the verdict. The rewrite is driven by the diagnosis — undefined terms get defined, assumptions get flagged, vague requirements become testable ones.

**🎯 21 thinking methods, matched automatically.** A built-in library of complete Markdown methods (Socratic questioning, first principles, steel-man, minimal experiments…). The enhancer picks one based on your draft's signal words — or browse the full library in the Method Studio.

**📚 A vault that closes the loop.** Diagnosis findings (hidden premises, unfalsifiable requirements) can be saved as "to-verify" assumption cards. Verify them later; checked-in cards feed future enhancements as context. Your prompt quality compounds.

**🔌 Zero-config, zero-telemetry, zero-token option.** Semantic enhancement rides your session's model. A local, zero-token lightweight mode works fully offline. Nothing leaves your machine unless you trigger it.

**Compatibility:** works on DSH `0.1.2-alpha.1+` **and** adapts automatically to the older `0.1.0-rc` slot contracts — verified on real instances of both.

<details>
<summary><strong>More capabilities</strong> (click to expand)</summary>

- **PromptStudio** — the advanced workspace: browse 21 methods, fill in facts/constraints, compose and preview a structured prompt before sending.
- **PromptKit Vault** — local library for drafts and finished prompts: search, favorites, project grouping, derivation with version diff, JSON backup/restore.
- **Streaming output** — enhancement results stream segment-by-segment into a preview panel with elapsed-time badge and cancel button.
- **Strength levels** — low (polish) / mid (standard) / high (expand ~3x) length budgets.
- **Auto-enhance before send** — optional; intercepts plain Enter, falls back to the original draft on any failure, never blocks a send.
- **Skill-mention preservation** — `/tdd`-style skill tokens lost in rewriting are detected and restored with one click.
- **`@file` completion** — type `@` to search workspace files (read-only name listing; content untouched).
- **`/pk` quick insert** — type `/pk keywords` for a compact vault candidate menu (arrow keys + Enter), never touching DSH-native commands.
- **Private methods** — paste Obsidian-style Markdown prompt cards; stored locally only, exportable as JSON.
- **Template variables** — `{{name}}` placeholders in vault items prompt a fill-in panel before insertion.

</details>

## The enhancement loop

```
write a rough draft
      │
      ▼
✦ Enhance ──► five-dimension diagnosis ──► model rewrite (streaming)
      │                                            │
      │                                            ▼
      │                            findings auto-staged in the Knowledge tab
      │                                            │
      │                              you decide: save as assumption card
      │                                            │
      └──────────────► verified cards feed future enhancements ◄┘
```

## Installation

**npm (recommended)**

```bash
dsh plugin --profile web add dsh-promptkit
```

**GitHub (pin a commit for reproducible installs)**

```bash
dsh plugin --profile web add github:fsrmqi/dsh-promptkit#<commit-sha>
```

> Build artifacts are committed to Git — GitHub installs work out of the box without building.

**tarball (offline / audit)**

```bash
npm pack && dsh plugin --profile web add ./dsh-promptkit-0.1.0.tgz
```

After installing, refresh the browser. You'll find **✦ Enhance** beside the composer and **Advanced Method Studio** as a conversation tab.

## Interface modes

The plugin ships in a **simple mode** by default: draft → enhance → result, nothing else on screen. After 3 successful enhancements it automatically unlocks the full interface (method library, vault, statistics, strength levels). You can lock either mode in **Settings → Interface mode**.

## Using it as an npm library

The core depends on zero hosts. Four decoupled interfaces; hosts swap implementations via the contract:

| Interface | Responsibility | Default |
| --- | --- | --- |
| `MethodProvider` | Method source / composition / templates / history | `StaticMethodProvider` (21 built-ins + private methods) |
| `Composer` | Read/write a target input box | `TextareaComposer` |
| `Enhancer` | Semantic model call | `OpenAIEnhancer` (any OpenAI-compatible endpoint) |
| `AssetProvider` | Vault save / search / backup | `StaticAssetProvider` |

```js
import { PromptStudio, QuickEnhancer, StaticMethodProvider, StaticAssetProvider, TextareaComposer } from 'dsh-promptkit'

const methodProvider = new StaticMethodProvider()
const assetProvider = new StaticAssetProvider()
const composer = new TextareaComposer(document.querySelector('textarea'))

<QuickEnhancer methodProvider={methodProvider} assetProvider={assetProvider} composer={composer} messages={messages} />
```

Components hide UI for capabilities that are not injected — see the full props contract in [docs/EMBED.md](docs/EMBED.md).

## Embedding in other hosts (Embed Protocol v1)

Any React host can compose PromptKit's components via the standard artifact `ui/embed.js`: an IIFE that only exposes the `PromptKit` namespace, with the `pk-*` visual namespace isolated from host themes. Contract locked by tests. See **[docs/EMBED.md](docs/EMBED.md)**.

## Privacy

| Access | Purpose | Can disable |
| --- | --- | --- |
| `localStorage` | Vault, favorites, history, optional local-only usage signals | Clear localStorage; no server persistence |
| Target input box | Fills generated prompt into your draft | Only on click |
| `fetch` | Local plugin bridge for semantic enhancement only | No request until triggered |

**Zero telemetry.** Nothing is sent to third parties; usage signals (off by default) never leave the browser.

## Contributing

Issues and PRs welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). To add a thinking method, drop a Markdown file under `methods/` (frontmatter + a `## Prompt` block) and run `npm run build`.

## License

MIT
