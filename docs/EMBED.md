# dsh-promptkit Embed Protocol v1

让 dsh-promptkit 的方法工坊（PromptStudio）与对话增强器（QuickEnhancer）嵌入**任意 React/DSH 宿主**的标准协议。dsh-promptkit 对宿主零感知：它只发布标准产物与契约，宿主自持集成脚本和 adapter。

本文对应包版本 **0.2.1**，`PromptKit.version` 仍为 Embed 命名空间版本 `'1'`，两者不是同一个版本号。升级行为差异与数据保留说明见 [升级记录](UPGRADE-HISTORY.md#v021)。

## 1. 标准产物：`ui/embed.js`

浏览器直接使用 ESM 时可导入 `dsh-promptkit/browser`；支持 `browser` 条件的构建器也会自动选择这一入口。默认 Node 入口保留 DSH 插件注册导出，浏览器入口不静态依赖 Node 半区。

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
- **默认本地优先**：内置方法、私有方法、收藏、历史与灵感资产均可在浏览器本地工作；`Enhancer` 与 `searchMemory` 只会在宿主主动注入且用户触发时调用。
- **运行环境**：浏览器（用到 `window.localStorage`、`AbortController`、`fetch`）。

## 2. 宿主接入五步

1. **依赖**：`"dsh-promptkit": "file:../dsh-promptkit"`（本地路径）或未来发布后的 registry 版本。
2. **集成脚本**（宿主自持）：读取 `node_modules/dsh-promptkit/ui/embed.js`，拼接进宿主 `client.js` 的工厂闭包内（建议用标记块管理，见 MC 的 `scripts/integrate-promptkit.mjs` 参考）。拼接处只需保证闭包内有 `React`。
3. **写宿主 adapter**：实现宿主自己的 `MethodProvider` / `AssetProvider` / `Composer` / `Enhancer`（或直接使用 `PromptKit.StaticMethodProvider` 和 `PromptKit.StaticAssetProvider`）。
4. **装配组件**：把 `PromptKit.PromptStudio` / `PromptKit.QuickEnhancer` 挂到 DSH 插槽（`conversation.view` / `conversation.input.right`），按 §3 传 props。
5. **数据隔离**：实例化 `StaticMethodProvider({ storagePrefix: '你的插件名.' })`，避免与其他插件的 localStorage 冲突。

## 3. 契约

语义增强返回 `{ prompt, model?, diagnosis?, diagnosisMeta? }`。`diagnosis` 可以只有部分维度；`diagnosisMeta` 包含 `status`（`complete/partial/missing`）、`missingDimensions` 和 `warnings`，不包含草稿或原始输出。空正文禁止应用；旧输出没有诊断时仍可使用。解析器支持中英文维度标签、外层协议围栏和缺分隔符，流式预览不显示未完整传输的协议标记。

`enhanceStream()` 为可选能力。只有明确抛出 `fallback=true` 且尚未输出时才调用 `enhance()`，普通网络/模型错误或取消直接终止。组件在写回前校验原草稿是否变化，避免迟到响应覆盖用户的新编辑。

知识区只暂存隐含前提/可证伪性中的实际缺口。新模型指令在这两项描述前使用 `[OK]` 或 `[GAP]`，UI 隐藏标记；旧输出仅过滤明确的无问题陈述，不靠宽泛关键词删除可能的缺口。新去重键包含完整草稿，旧截断记录保留供审阅，不与不同长稿强行合并。首次体验单独保存 0~3 次成功进度，详细使用统计仍遵守用户开关。

`@` 文件引用补全已移除：DSH 原生 `@` 提及（文件 + 会话候选、目录下钻、原子行内引用）是同类能力的超集，插件在宿主输入框上重复提供会导致双菜单重叠与键盘冲突。完整缘由与迁移注意见 [升级记录](UPGRADE-HISTORY.md#unreleased)。草稿中已有的 `@path` 引用在增强时仍受「保留 @ 文件引用」保护，发送后由 DSH 原生机制读取文件。

接入 `onSubmitDraft` 的宿主须实现 `composer.isInputTarget(target)`，明确识别消息框节点；`TextareaComposer` 已提供。自动增强仅拦截该节点的 Enter，其他输入框、IME 和带修饰键的操作不受影响。增强失败可发送原文一次，发送失败只报告结果未确认，绝不自动重发。选区适配器可实现 `onSelectionChange(callback)`，使片段预览随选区更新。

### 3.1 `PromptKit` 命名空间（v1 冻结面）

| 符号 | 类型 | 说明 |
|---|---|---|
| `version` | `'1'` | 协议版本 |
| `PromptStudio` | Component | 方法工坊（挂 `conversation.view`） |
| `QuickEnhancer` | Component | 对话增强器（挂 `conversation.input.right`，即 `ConversationQuickAction`） |
| `StaticMethodProvider` / `StaticAssetProvider` | class | 内置方法源 / 本地灵感库，`{ storagePrefix }` 可配 |
| `MethodProvider` / `AssetProvider` / `Composer` / `Enhancer` | class | 宿主 adapter 基类 |
| `TextareaComposer` / `OpenAIEnhancer` | class | 通用 adapter（任意 `<textarea>` / OpenAI 兼容端点） |
| `utils` | object | 纯函数集（`conversationMessages`、`fileMentions`、`planPromptEnhancement`、`recommendMethods` 等），宿主 glue 可复用 |
| `builtinMethods` | Method[] | 21 个方法原始数据（宿主自建 provider 时直接消费） |

### 3.2 组件 props

两个组件均**零宿主依赖**：所有外部能力经 props 注入，未注入的可选能力对应 UI 自动隐藏/降级。

| prop | 必填 | 类型 | 说明 |
|---|---|---|---|
| `methodProvider` | ✓ | MethodProvider | 方法源 + compose + 收藏/历史 |
| `assetProvider` | 可选 | AssetProvider | 灵感资产保存、搜索、收藏与备份；未注入时隐藏灵感库 |
| `composer` | QuickEnhancer ✓ | Composer | 读写草稿（桥接会话输入框） |
| `enhancer` | 可选 | Enhancer | 语义增强；未注入时仅保留零 Token 档位 |
| `messages` | 可选 | `{id, role, text}[]` | 当前对话（供「从当前对话提取」） |
| `onSend` | PromptStudio 可选 | `(text) => Promise` | 工坊由用户主动发送生成的 Prompt |
| `onSubmitDraft` | QuickEnhancer 可选 | `(text) => void \| Promise` | 显式接入自动增强后的发送；Composer 须识别目标输入节点 |
| `getRecentSessions` | PromptStudio 可选 | `() => Promise` | 追加最近会话摘要 |
| `searchMemory` | 可选 | `(query) => Promise<string \| {text: string, sources?: object[]}>` | Studio 返回字符串；QuickEnhancer 也可消费摘要与来源对象 |
| `nudgeEnabled` | QuickEnhancer 可选 | boolean | 宿主级助推开关，默认开启，与用户本地开关共同决定是否展示 |
| `storagePrefix` | 可选 | string | QuickEnhancer 本地状态前缀（默认 `'promptkit.'`） |

### 3.3 灵感库的键盘边界

QuickEnhancer 仅对 `/pk 关键词` 或 `/pk:关键词` 打开灵感候选；不会监听或拦截其他 `/` 命令。候选打开后，`↑↓` 选择、Enter 仅插入资产到草稿、Esc 仅关闭候选，不会触发宿主发送。灵感抽屉还支持原资产编辑、派生版本及父版本正文对比；这些能力只依赖 `AssetProvider.save()` 的稳定 `id` 和可选 `parentId` 字段。

`StaticAssetProvider` 还支持可选的思考卡字段：`thinkingKind`（问题/事实/假设/决策等）、`epistemicStatus`（已证实/推断/待核实/个人偏好）、`rationale`、`nextAction`、`dialectic`（观点/反观点/综合）和 `relatedIds`。未知宿主可忽略这些字段；需要呈现语义化资产时应原样保留它们。

QuickEnhancer 可选择最多 3 张资产作为语义增强的上下文包。仅在用户选择语义档并点击增强时，卡片的类型、认识状态、解释、下一步及正文才会随 `Enhancer.enhance({ extra })` 显式传入；轻量档不会读取这些资产。保存增强结果时，`provenance.contextAssetIds` 记录所用资产。

### 3.4 MethodProvider 接口

```js
list(): Promise<Method[]>          // Method = { id, title, category, purpose, tags[], triggerKeywords[], prompt, mode: 'guided'|'structured', outcome }
search(query): Promise<Method[]>
getById(id): Promise<Method|null>
compose({ methodId, question, facts, constraints, options }): Promise<{ prompt, method }>
getTemplate(methodId): Promise<{ prompt }>
getFavorites()/setFavorites(ids)/getHistory()/pushHistory(item)   // 收藏与历史持久化
onHistoryChange(callback): () => void                             // 可选：历史更新订阅
```

`compose` 语义：**模板在前 + 「本次任务」结构化输入块在后**（不替换模板内占位符）。

`onHistoryChange` 用于让同一宿主中的 QuickEnhancer 和 PromptStudio 同步「最近方法」。自定义 Provider 若实现历史持久化，应实现该可选订阅；`StaticMethodProvider` 已通过同页事件与 `storage` 事件实现。

### 3.5 协议保障

Composer 至少实现 `getDraft()/write()`，并建议实现 `onChange()` 以同步用户编辑；选区能力使用 `getSelection()/replaceSelection()` 与可选 `onSelectionChange()`。`isInputTarget()` 默认不接受任何节点，避免自定义宿主未适配时拦截其他输入框的发送键。

自动化覆盖见 `test/ui-regression.test.js`（源码/产物、选区、快捷键、写回与发送保护）、`test/protocol-regression.test.js`（解析与工作区索引）、`test/transport-regression.test.js`（本地 HTTP）。真机和安装包验收范围见 [DSH-QA](DSH-QA.md) 与 [升级记录](UPGRADE-HISTORY.md#v021)。

`test/embed.test.js` 在最小宿主环境（仅 mock `React` + `localStorage`）中执行 `ui/embed.js`，锁定命名空间、内置方法、compose、历史订阅、私有方法、`@文件` 解析、storagePrefix 隔离、视觉命名空间和 IIFE 零符号泄漏。宿主升级 dsh-promptkit 后建议重跑该套件确认协议未破坏。

## 4. 变更政策

- v1 契约面**只增不改**：新增命名空间符号不升版本；修改/删除任何既有符号 → 升 `version` 并在本文档记录迁移指南。
- 内部符号（IIFE 内非导出面）不构成契约，宿主**禁止**依赖。
