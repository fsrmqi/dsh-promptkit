# PromptKit

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/fsrmqi/dsh-promptkit/actions/workflows/ci.yml/badge.svg)](https://github.com/fsrmqi/dsh-promptkit/actions/workflows/ci.yml)
[![DSH Plugin](https://img.shields.io/badge/DSH-Plugin-blue.svg)](https://github.com/topics/dsh-plugin)
[![Node: >=22.6](https://img.shields.io/badge/node-%3E%3D22.6-green.svg)](https://nodejs.org)
[![Listed on dsh-plugin.org](https://dsh-plugin.org/badges/listed.svg)](https://dsh-plugin.org/plugins/fsrmqi/dsh-promptkit)

[English](README.md) · [简体中文](README.zh.md)

Repository version: **0.2.1** (local release preparation; publishing has not been performed). [Upgrade history and migration notes (Chinese)](docs/UPGRADE-HISTORY.md) · [Technical changelog](CHANGELOG.md)

> Turn a rough draft into a structured, executable prompt — in one click, inside DeepSeek Harness.

<!-- TODO: 录制 GIF 后替换：写草稿 → 一键增强 → 流式上屏 + 五维诊断，8 秒内 -->
<!-- ![enhance-demo](docs/images/enhance-demo.gif) -->

```bash
dsh plugin --profile web add dsh-promptkit
```

Write a draft, hit **✦ Enhance**, and receive a clearer prompt that preserves the original intent and scope in the preview panel, then in the composer without sending it. PromptKit needs no separate API key: semantic enhancement reuses a model already configured in DSH. If the session has no model route, it reports that requirement. Local lightweight enhancement needs no model.

## Why PromptKit

**✦ One-click enhancement that preserves task size.** The default path makes only necessary wording improvements; it does not invent plans, acceptance criteria, or delivery phases. Five-dimension diagnosis (clarity · hidden premises · falsifiability · actionability · context fit) is an optional review tool in the current interface.

**🎯 21 thinking methods, recommended rather than imposed.** A built-in library of complete Markdown methods (Socratic questioning, first principles, steel-man, minimal experiments…). Smart matching only suggests a method; it is applied only after the user explicitly selects it.

**📚 A vault that closes the loop.** Diagnosis findings (hidden premises, unfalsifiable requirements) can be saved as "to-verify" assumption cards. Verify them later; checked-in cards feed future enhancements as context. Your prompt quality compounds.

**🔌 Zero telemetry, with a zero-token option.** Local lightweight enhancement works offline. Semantic enhancement sends the draft and selected context to the host's configured model service. Optional project-memory searches make requests when that feature is used; `@` file references come from the native DSH mention menu and are not reimplemented by the plugin.

**Compatibility:** verified by a real DSH `0.1.2-alpha.2` profile boot after installing the local bundle; CI runs the same alpha-channel smoke test. Running the DSH plugin requires Node `>=22.6`. The older `0.1.0-rc` slot adapter is covered by simulated contract tests; this does not establish real-instance compatibility for every older release.

<details>
<summary><strong>More capabilities</strong> (click to expand)</summary>

- **PromptStudio** — the advanced workspace: browse 21 methods, fill in facts/constraints, compose and preview a structured prompt before sending.
- **PromptKit Vault** — local library for drafts and finished prompts: search, favorites, project grouping, derivation with version diff, JSON backup/restore.
- **Streaming output** — results stream into a preview panel; diagnosis appears only when enabled, with a live elapsed-time badge and a cancel button.
- **Strength levels** — low (polish) / mid (refine) / high (detail); they control wording detail only, never task scope.
- **Auto-polish before send** — available when a custom host provides `onSubmitDraft` and `composer.isInputTarget()`. It always uses conservative polish, intercepts only the composer's plain Enter, and may send the original once if polishing fails. Send failure is never retried. Cancellation or a changed draft prevents sending. The standalone DSH plugin does not wire this send hook by default.
- **Skill-mention preservation** — lost `/tdd`-style tokens are restored automatically. Dismissing the notice does not rewrite the draft again.
- **`/pk` quick insert** — type `/pk keywords` for a compact vault candidate menu (arrow keys + Enter), never touching DSH-native commands.
- **Private methods** — paste Obsidian-style Markdown prompt cards; stored locally only, exportable as JSON.
- **Template variables** — `{{name}}` placeholders in vault items prompt a fill-in panel before insertion.

</details>

## The enhancement loop

```
write a rough draft
      │
      ▼
✦ Enhance ──► scope-preserving model rewrite (streaming)
      │
      ├────► optional: five-dimension diagnosis (viewed for this run only)
      │
      └────► only user-saved and verified cards may feed later enhancements
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
npm pack && dsh plugin --profile web add ./dsh-promptkit-0.2.1.tgz
```

After installing, refresh the browser. You'll find **✦ Enhance** beside the composer and **Advanced Method Studio** as a conversation tab. Node-side changes also require the host to reload the plugin or restart DSH; refreshing the page alone may keep cached server code. Registry installs select a published version; use a tarball to test this checkout. See the [upgrade steps](docs/UPGRADE-HISTORY.md#v021). In the standalone DSH plugin, "Studio →" from the enhancer prefills the draft into the studio and switches to that conversation tab automatically.

## Interface

The plugin uses one stable, full configuration interface: mode selection, conversation/memory context, strength, method switching, and the optional five-dimension diagnosis are always available. A toolbar centralizes draft saving, vault access, studio hand-off, and method-collection progress. ⌘K opens the panel; common methods are reachable from the launcher's fan-out menu.

## Using it as an npm library

The core depends on zero hosts. Four decoupled interfaces; hosts swap implementations via the contract:

| Interface | Responsibility | Default |
| --- | --- | --- |
| `MethodProvider` | Method source / composition / templates / history | `StaticMethodProvider` (21 built-ins + private methods) |
| `Composer` | Read/write a target input box | `TextareaComposer` |
| `Enhancer` | Semantic model call | `OpenAIEnhancer` (any OpenAI-compatible endpoint) |
| `AssetProvider` | Vault save / search / backup | `StaticAssetProvider` |

```js
import { PromptStudio, QuickEnhancer, StaticMethodProvider, StaticAssetProvider, TextareaComposer } from 'dsh-promptkit/browser'

const methodProvider = new StaticMethodProvider()
const assetProvider = new StaticAssetProvider()
const composer = new TextareaComposer(document.querySelector('textarea'))

<QuickEnhancer methodProvider={methodProvider} assetProvider={assetProvider} composer={composer} messages={messages} />
```

Missing optional capabilities are hidden or degraded. Bundlers supporting the `browser` condition can also import the root package; its default Node entry additionally exports DSH registration. Runtime requirements are Node `>=22.6` / React 17+; source development and tests use Node 24.15+. See the [embed contract](docs/EMBED.md) and [verified upgrade combinations](docs/UPGRADE-HISTORY.md#v021).

## Embedding in other hosts (Embed Protocol v1)

Any React host can compose PromptKit's components via the standard artifact `ui/embed.js`: an IIFE that only exposes the `PromptKit` namespace, with the `pk-*` visual namespace isolated from host themes. Contract locked by tests. See **[docs/EMBED.md](docs/EMBED.md)**.

## Privacy

| Access | Purpose | Can disable |
| --- | --- | --- |
| `localStorage` | Vault, diagnosis inbox, favorites, history, preferences, onboarding progress (still recorded but no longer drives interface switching), optional detailed statistics | Detailed statistics default off; back up assets before clearing browser data |
| Target input box | Buttons or shortcuts apply results; custom hosts can explicitly wire automatic sending | Without a send hook, only the draft is changed; asynchronous writes check for newer edits |
| Local plugin requests | Semantic bridge, optional project-memory search | Triggered by the corresponding feature |
| Configured model endpoint | Processes semantic drafts and selected context | Use lightweight mode to avoid model calls |

**Zero telemetry.** Usage statistics are not uploaded. Semantic enhancement is not offline: the configured model service may be external, so review drafts and selected context for sensitive information. Project-memory and custom-adapter data handling depends on the host implementation.

## Contributing

Issues and PRs welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). To add a thinking method, drop a Markdown file under `methods/` (frontmatter + a `## Prompt` block) and run `npm run build`.

## License

MIT
