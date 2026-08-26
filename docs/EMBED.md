# dsh-promptkit Embed Protocol v1

让 dsh-promptkit 的方法工坊（PromptStudio）与对话增强器（QuickEnhancer）嵌入**任意宿主 DSH 插件**的标准协议。dsh-promptkit 对宿主零感知：它只发布标准产物与契约，集成脚本和 adapter 由宿主自持。首个参考实现是 [memory-center-dsh-plugin](https://github.com/)（MC），未来任何插件按本文档即可接入，dsh-promptkit 无需改动。

## 1. 标准产物：`ui/embed.js`

```
const PromptKit = (React => {
  /* 全部内部符号私有化（foundation / utils / core / 方法库 / 组件 / adapter） */
  return { version: '1', PromptStudio, QuickEnhancer, StaticMethodProvider, ... }
})(React)
```

特性：

- **IIFE 私有化**：内部符号（`C`、`S`、`utils`、`Composer` 等）不进入宿主闭包，与宿主同名符号零冲突（有契约测试保障）。
- **唯一前提**：宿主闭包内存在 `React`（DSH 插件工厂的标准符号，来自 `require('react')`）。`h` 在 IIFE 内部自建。
- **视觉命名空间**：CSS 变量与 class 一律 `pk-*` / `--pk-*` 前缀，与宿主主题（如 MC 的 `--mc-*`）互不覆盖，两插件可同装一个 DSH 实例。
- **零外部依赖**：无网络请求、无后端调用（`OpenAIEnhancer` 仅在宿主主动实例化时才发起 fetch）。
- **运行环境**：浏览器（用到 `window.localStorage`、`AbortController`、`fetch`）。

## 2. 宿主接入五步

1. **依赖**：`"dsh-promptkit": "file:../dsh-promptkit"`（本地路径）或未来发布后的 registry 版本。
2. **集成脚本**（宿主自持）：读取 `node_modules/dsh-promptkit/ui/embed.js`，拼接进宿主 `client.js` 的工厂闭包内（建议用标记块管理，见 MC 的 `scripts/integrate-promptkit.mjs` 参考）。拼接处只需保证闭包内有 `React`。
3. **写宿主 adapter**：实现宿主自己的 `MethodProvider` / `Composer` / `Enhancer`（或直接用 `PromptKit.StaticMethodProvider` 内置方法源）。
4. **装配组件**：把 `PromptKit.PromptStudio` / `PromptKit.QuickEnhancer` 挂到 DSH 插槽（`conversation.view` / `conversation.input.right`），按 §3 传 props。
5. **数据隔离**：实例化 `StaticMethodProvider({ storagePrefix: '你的插件名.' })`，避免与其他插件的 localStorage 冲突。

## 3. 契约

### 3.1 `PromptKit` 命名空间（v1 冻结面）

| 符号 | 类型 | 说明 |
|---|---|---|
| `version` | `'1'` | 协议版本 |
| `PromptStudio` | Component | 方法工坊（挂 `conversation.view`） |
| `QuickEnhancer` | Component | 对话增强器（挂 `conversation.input.right`，即 `ConversationQuickAction`） |
| `StaticMethodProvider` | class | 内置 12 方法源，`{ storagePrefix }` 可配 |
| `MethodProvider` / `Composer` / `Enhancer` | class | 三大基类（宿主 adapter 继承实现） |
| `TextareaComposer` / `OpenAIEnhancer` | class | 通用 adapter（任意 `<textarea>` / OpenAI 兼容端点） |
| `utils` | object | 纯函数集（`conversationMessages`、`planPromptEnhancement`、`recommendMethods` 等），宿主 glue 可复用 |
| `builtinMethods` | Method[] | 12 个方法原始数据（宿主自建 provider 时直接消费） |

### 3.2 组件 props

两个组件均**零宿主依赖**：所有外部能力经 props 注入，未注入的可选能力对应 UI 自动隐藏/降级。

| prop | 必填 | 类型 | 说明 |
|---|---|---|---|
| `methodProvider` | ✓ | MethodProvider | 方法源 + compose + 收藏/历史 |
| `composer` | QuickEnhancer ✓ | Composer | 读写草稿（桥接会话输入框） |
| `enhancer` | 可选 | Enhancer | 语义增强；未注入时仅保留零 Token 档位 |
| `messages` | 可选 | `{id, role, text}[]` | 当前对话（供「从当前对话提取」） |
| `onSend` | 可选 | `(text) => Promise` | 直接发送生成的 Prompt 到当前会话 |
| `getRecentSessions` | 可选 | `() => Promise` | 追加最近会话摘要 |
| `searchMemory` | 可选 | `(query) => Promise<string>` | 项目记忆检索 |
| `storagePrefix` | 可选 | string | QuickEnhancer 本地状态前缀（默认 `'promptkit.'`） |

### 3.3 MethodProvider 接口

```js
list(): Promise<Method[]>          // Method = { id, title, category, purpose, tags[], triggerKeywords[], prompt, mode: 'guided'|'structured', outcome }
search(query): Promise<Method[]>
getById(id): Promise<Method|null>
compose({ methodId, question, facts, constraints, options }): Promise<{ prompt, method }>
getTemplate(methodId): Promise<{ prompt }>
getFavorites()/setFavorites(ids)/getHistory()/pushHistory(item)   // 收藏与历史持久化
```

`compose` 语义：**模板在前 + 「本次任务」结构化输入块在后**（不替换模板内占位符）。

### 3.4 协议保障

`test/embed.test.js`（7 项契约测试）在最小宿主环境（仅 mock `React` + `localStorage`）中执行 `ui/embed.js`，锁定：命名空间完整性、12 方法、compose 契约、storagePrefix 隔离、`pk-*` 视觉命名空间、IIFE 零符号泄漏。宿主升级 dsh-promptkit 后建议重跑该套件确认协议未破坏。

## 4. 变更政策

- v1 契约面**只增不改**：新增命名空间符号不升版本；修改/删除任何既有符号 → 升 `version` 并在本文档记录迁移指南。
- 内部符号（IIFE 内非导出面）不构成契约，宿主**禁止**依赖。
