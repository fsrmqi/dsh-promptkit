# PromptKit

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![DSH Plugin](https://img.shields.io/badge/DSH-Plugin-blue.svg)](https://github.com/topics/dsh-plugin)
[![Node: >=18](https://img.shields.io/badge/node-%3E%3D18-green.svg)](https://nodejs.org)

[English](README.md) · [简体中文](README.zh.md)

> npm package / repo name: **`dsh-promptkit`**

An open-source prompt enhancement toolkit for DeepSeek Harness and other React hosts.

- **`QuickEnhancer`** — A floatable or inline component for lightweight or semantic draft enhancement, method suggestions, and method-library actions.
- **`PromptStudio`** — The advanced manual workspace for browsing methods and composing a structured prompt. It ships with 12 complete Markdown methods (frontmatter metadata + full prompt body).

Lightweight enhancement is local and zero-token. In the standalone DSH plugin, semantic enhancement reuses the current session model and writes back to the draft; neither mode sends a message automatically.

## Installation

### Option 1: npm (recommended, no build permission needed)

```bash
dsh plugin --profile web add dsh-promptkit
```

### Option 2: GitHub (pin a commit for reproducible installs)

```bash
# latest
dsh plugin --profile web add github:fsrmqi/dsh-promptkit

# pinned commit (recommended for production)
dsh plugin --profile web add github:fsrmqi/dsh-promptkit#<commit-sha>
```

> **Note**: pnpm ≥ 10 refuses to run `prepare` scripts for GitHub dependencies by default. You need to allowlist it in the profile's `pnpm-workspace.yaml`:
> ```yaml
> allowBuilds:
>   dsh-promptkit: true
> ```
> Build artifacts (`ui/client.js`, `ui/embed.js`) are already committed to Git, so Git installs work out of the box without building. The allowlist is only needed if a `prepare` script is added later.

### Option 3: tarball (offline / audit scenarios)

```bash
npm pack                    # produces dsh-promptkit-0.1.0.tgz
dsh plugin --profile web add ./dsh-promptkit-0.1.0.tgz
```

### As an npm library

```bash
npm install dsh-promptkit
```

## Design Principle: Single Source, Dual Consumption

PromptKit's core **depends on zero hosts**. It defines three decoupled interfaces; the open-source version provides default implementations, and hosts can swap them via the contract:

| Interface | Responsibility | Open-source Default |
| --- | --- | --- |
| `MethodProvider` | Method source / composition / template / favorites / synchronized history | `StaticMethodProvider` (12 built-in methods + local private methods, localStorage persistence, configurable `storagePrefix`) |
| `Composer` | Write to a target input box | `TextareaComposer` (any textarea, with input subscription) |
| `Enhancer` | Semantic model call for enhancement | `OpenAIEnhancer` (any OpenAI-compatible endpoint) |

This way, **the npm library form and the host-embedded form share the exact same core code** — the only difference is which adapter you inject. No forked maintenance. PromptKit is host-agnostic (Embed Protocol, see below).

## Component Props

Both components hide UI for capabilities that are not injected:

### `<PromptStudio />`

| Prop | Required | Description |
| --- | --- | --- |
| `methodProvider` | ✅ | `MethodProvider` instance |
| `messages` | | Current conversation `[{ id, role: 'user'\|'assistant', text }]`, for "extract from current conversation" |
| `onSend` | | `(text) => Promise`, shows a "Send to current session" button in the preview |
| `composer` | | `Composer` instance, shows a "Write to input box" button in the preview ("Copy Prompt" is always available) |
| `getRecentSessions` | | `() => Promise<Array<{ intent?, summary? }>>`, shows an "Append recent session summary" block |
| `searchMemory` | | `(query) => Promise<string>`, shows a "Search project memory by natural language" block |

### `<QuickEnhancer />`

| Prop | Required | Description |
| --- | --- | --- |
| `methodProvider` | ✅ | `MethodProvider` instance |
| `composer` | ✅ | `Composer` instance; all generate / enhance / undo operations read/write drafts through it |
| `enhancer` | | `Enhancer` instance; when not injected, only the "Lightweight · Zero Token" tier remains |
| `messages` | | Current conversation array, for "add conversation" reference and message selection |
| `searchMemory` | | `(query) => Promise<string>`, provides the optional "add project memory" context slot |

## Usage

```js
import {
  PromptStudio, QuickEnhancer,
  StaticMethodProvider, TextareaComposer, OpenAIEnhancer,
} from 'dsh-promptkit'

const methodProvider = new StaticMethodProvider()
const composer = new TextareaComposer(document.querySelector('textarea'))

<PromptStudio methodProvider={methodProvider} composer={composer} />
<QuickEnhancer
  methodProvider={methodProvider}
  composer={composer}
  enhancer={new OpenAIEnhancer({ endpoint, apiKey, model })}
  messages={messages}
/>
```

### Running the example

```bash
cd promptkit
python3 -m http.server 8080
# Open http://localhost:8080/examples/basic/ in browser
```

The example page uses importmap to load `src/` directly (React via esm.sh CDN), no build step required.

## Directory Structure

```
dsh-promptkit/
├── src/
│   ├── core/        # Three interface definitions (MethodProvider / Composer / Enhancer)
│   ├── lib/         # Pure utility functions (utils.js: category chain / planPromptEnhancement / conversationMessages / ...)
│   ├── methods/     # Open method library (builtin.js → dynamically loads builtin.json, 12 Markdown methods)
│   ├── adapters/    # Default implementations (StaticMethodProvider / TextareaComposer / OpenAIEnhancer)
│   ├── ui/          # Components (foundation.js infrastructure + studio.js + quick-enhancer.js)
│   └── index.js     # Public entry point (npm library form)
├── methods/         # 12 Markdown method library (with frontmatter + full prompt body)
│   ├── builtin.json # Build artifact (scripts/build-methods.mjs parses Markdown → json, do not edit by hand)
│   ├── 决策/        # Steel-man / Devil's advocate, Replace speculation with minimal experiments
│   ├── 学习/        # Fact check, Double-layer explanation, Reverse decomposition, Horizontal-vertical analysis
│   ├── 解决问题/    # Expert panel, First principles, Cross-domain borrowing
│   ├── 认识你自己/  # Life design, Uncover hidden talents
│   └── 问清问题/    # Socratic questioning
├── dsh/             # Standalone DSH plugin glue (standalone-glue.js: slot registration + default adapter wiring)
├── scripts/         # build-methods.mjs (md → builtin.json) + build-client.mjs (zero-dependency browser builder: standalone + embed)
├── ui/client.js     # Generated standalone DSH browser view (do not edit, produced by npm run build:ui)
├── ui/embed.js      # Generated standard embed artifact (Embed Protocol v1, do not edit, consumed by other plugins)
├── docs/EMBED.md    # Embed protocol standard (host integration guide)
├── test/            # Embed contract tests (run ui/embed.js in minimal host vm, lock protocol surface)
├── examples/basic/  # Zero-build runnable demo (importmap + esm.sh)
├── LICENSE          # MIT
└── package.json     # Package and DSH bundle manifest
```

## DSH Plugin Architecture

The `ui/` subpackage declares the browser-side `dsh.client` manifest. DSH Web App's ModuleLoader discovers and loads `ui/client.js`:

- **12 built-in Markdown methods** (`StaticMethodProvider`, fully local, zero backend, prompt bodies inlined with the package);
- **QuickEnhancer** mounts on `conversation.input.right`; **PromptStudio** mounts on `conversation.view` as “Advanced Method Studio”;
- "Write to message box" bridges DSH conversation input (`inputActions` injected by `conversation.input.right`), "Send to current session" goes through DSH session API;
- **Semantic enhancement** (model rewrites draft): reuses the current DSH session's selected model route through the plugin's Node half and Harness LLM service. It requires no API key or endpoint, only fills the input box, and asks the user to send one normal message first if the session has not established a model route yet.
- **Context adapters**: `@file` references are preserved without reading file content; project memory is optional and uses a host-provided `searchMemory` adapter.

The build artifact `ui/client.js` is a single-file lazy-CJS factory (`window.__ModuleLoader__.load`), generated by `scripts/build-client.mjs` from `src/` by stripping ESM syntax — **component code has only one source**, shared between npm library form and DSH plugin form.

## Embedding in Other Hosts (Embed Protocol v1)

Any web app or plugin host can compose dsh-promptkit's PromptStudio and QuickEnhancer — **dsh-promptkit is host-agnostic**:

- Standard artifact `ui/embed.js`: IIFE privatizes all internal symbols, only exposes the `PromptKit` namespace (components / method sources / base classes / utils). The only prerequisite is `React` in the host closure;
- Visual namespace `pk-*` is independent from host themes, multiple host instances installed together won't override each other;
- Hosts own their integration scripts and adapters (method source / draft read-write / model calls), assembling components via props contract;
- Contract is locked by tests (`test/embed.test.js`, 7 cases), protocol surface only grows, never breaks.

Full contract and integration steps see **[docs/EMBED.md](docs/EMBED.md)**.

## Host Integration (Which Adapters to Write)

Take any host as an example, access the same core via the `PromptKit` namespace:

```js
// After concatenating ui/embed.js, PromptKit is available in the host closure (see docs/EMBED.md)

// 1) Method source: use built-in 12 methods directly (storagePrefix isolates data for different hosts)
const methodProvider = new PromptKit.StaticMethodProvider({ storagePrefix: 'my-host.' })
//    Or extend the base class to bridge host's own method source:
//    class HostMethodProvider extends PromptKit.MethodProvider { async list() { ... } }

// 2) Write target: bridge host's message input box
class HostComposer extends PromptKit.Composer {
  getDraft() { return /* read current draft from host input box */ }
  write(text) { /* write to host input box */ }
  onChange(cb) { return /* subscribe to draft changes, return unsubscribe function */ }
}

// 3) Model call (optional): bridge host backend or connect directly to OpenAI-compatible endpoint
class HostEnhancer extends PromptKit.Enhancer {
  async enhance({ draft, extra, lang, kind, method }) { /* host model call */ }
  cancel() { /* pass through AbortController */ }
}

// 4) Conversation context: host session snapshot → messages array
const messages = PromptKit.utils.conversationMessages(/* host session data */)
```

### Method Library Source

12 Markdown methods (with frontmatter metadata: scenario, purpose, tags, trigger words). The `prompt` field extracts the `## Prompt` code block from the body as a clean template (strips article narration; falls back to full body when no code block). After user fills in problem/facts/constraints, a "Current task input" structured block is appended after the template to form the final prompt — placeholders like 【…】 in the template are preserved as instructions for the model to fill in, no regex substitution.

To add a new method: create a new Markdown file under `methods/` (same frontmatter format as existing ones), then `npm run build:methods` to regenerate `methods/builtin.json` (`scripts/build-methods.mjs` parses frontmatter + body; `mode`/`outcome` maintained in the `OVERRIDES` table inside the script), then `npm run build:ui` to inline the new method into `ui/client.js`. `npm run build` does all three steps in one command.

### Personal methods

The QuickEnhancer “Advanced settings” panel accepts pasted Obsidian-style Markdown prompt cards. It extracts frontmatter, the title, and the `## Prompt` code block, then stores the resulting private method only in the current browser's localStorage. It never scans, reads, or uploads an Obsidian vault. Private methods can be exported as JSON and restored by appending a backup; they participate in search and automatic matching but are never added to the public repository or package.

## Permissions & Privacy

| Access | Purpose | Can Disable |
| --- | --- | --- |
| `window.localStorage` | Favorites, synchronized method history, private methods, and optional local-only usage signals | Clear localStorage to wipe, no server-side persistence |
| Target input box (Composer) | "Write to input box" button fills generated prompt into current draft | Only triggers when clicked |
| Current session (onSend) | "Send to current session" button sends prompt as a message | Only triggers when clicked |
| `fetch` | Calls the local plugin bridge only when the user selects semantic enhancement; the Node half reuses the current session model | No request until selected |

**Zero telemetry**: This package sends no analytics or usage data to third parties. Local usage counts and feedback, when enabled or recorded, stay in localStorage and can be cleared in the UI.

## Supported Environments & Compatibility

| Environment | Requirement |
| --- | --- |
| DeepSeek Harness | Developer Preview (recommended `@deepseek-ai/dsh` 0.1.0-rc.x or above) |
| Node.js | ≥ 18 (build scripts use `node --test`) |
| Browser | Chrome 90+ / Firefox 88+ / Safari 14+ (requires ES Modules + `AbortController`) |
| React | ≥ 17 (peer dependency, provided by host environment) |

> **Compatibility Note** (2026-08-26): DeepSeek Harness is in Developer Preview, interfaces may change incompatibly. This plugin is built on `dsh.client` manifest (`platform: "web"`) and `conversation.view` / `conversation.input.right` slots. After DSH version updates, refer to actual `dsh --dump-config` output.

## Contributing

Issues and PRs are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) first.

To add a new thinking method, just create a new Markdown file under `methods/`, then `npm run build` to regenerate — see the [Method Library Source](#method-library-source) section for details.

## License

MIT
