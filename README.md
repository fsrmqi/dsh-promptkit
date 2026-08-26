# PromptKit

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![DSH Plugin](https://img.shields.io/badge/DSH-Plugin-blue.svg)](https://github.com/topics/dsh-plugin)
[![Node: >=18](https://img.shields.io/badge/node-%3E%3D18-green.svg)](https://nodejs.org)

> npm 包名 / 仓库名：**`dsh-promptkit`**

开源的 Prompt 构建与增强工具包，包含两个独立可用的能力：

- **`PromptStudio`（方法工坊）**：选择思考方法，用问题 / 事实 / 约束生成可编辑 Prompt。内置 12 个完整 Markdown 方法（带 frontmatter 元数据 + 完整 prompt 正文）。
- **`QuickEnhancer`（对话快捷增强器）**：悬浮在对话旁的按钮（⌘K），把当前输入框提示词做轻量 / 语义增强，或从方法库填充、改造。

## 安装

### 方式一：npm（推荐，免编译权限）

```bash
dsh plugin --profile web add dsh-promptkit
```

### 方式二：GitHub（可钉 commit 实现可复现安装）

```bash
# 最新版
dsh plugin --profile web add github:fsrmqi/dsh-promptkit

# 钉 commit（推荐生产环境）
dsh plugin --profile web add github:fsrmqi/dsh-promptkit#<commit-sha>
```

> **注意**：pnpm ≥ 10 安装 GitHub 依赖时会拒绝运行 `prepare` 脚本，需在 profile 的 `pnpm-workspace.yaml` 中 allowlist：
> ```yaml
> allowBuilds:
>   dsh-promptkit: true
> ```
> 本仓库已将构建产物（`ui/client.js`、`ui/embed.js`）提交到 Git，Git 安装可直接使用无需构建；allowlist 仅在新增 `prepare` 脚本时需要。

### 方式三：tarball（离线 / 审计场景）

```bash
npm pack                    # 产出 dsh-promptkit-0.1.0.tgz
dsh plugin --profile web add ./dsh-promptkit-0.1.0.tgz
```

### 作为 npm 库使用

```bash
npm install dsh-promptkit
```

安装后重启 harness 即可在 DSH Web UI 中看到「方法工坊」和「快捷助手」。

## 设计原则：单一代码源，双消费

PromptKit 核心 **零依赖任何宿主**。它只定义三个解耦接口，具体实现由宿主注入：

| 接口 | 职责 | 开源默认实现 | 宿主侧实现示例 |
| --- | --- | --- | --- |
| `MethodProvider` | 方法源 / 组合 / 模板 / 收藏 / 历史 | `StaticMethodProvider`（内置 12 个 Markdown 方法，localStorage 持久化，`storagePrefix` 可配） | 桥接宿主私有方法源，或直接用 `StaticMethodProvider` |
| `Composer` | 写入目标输入框 | `TextareaComposer`（任意 textarea，含输入订阅） | 接 DSH 消息框 `inputActions` |
| `Enhancer` | 语义增强的模型调用 | `OpenAIEnhancer`（任意 OpenAI 兼容端点） | 接宿主后端或当前会话模型 |

这样 **开源出去的和宿主嵌入的，是同一份核心代码**——差别只在注入什么 adapter，绝不分叉成两份维护。dsh-promptkit 对宿主零感知（Embed Protocol，见下文）。

## 组件 Props

两个组件的可选能力一律「未注入即隐藏对应 UI」：

### `<PromptStudio />`

| Prop | 必填 | 说明 |
| --- | --- | --- |
| `methodProvider` | ✅ | `MethodProvider` 实例 |
| `messages` | | 当前对话 `[{ id, role: 'user'\|'assistant', text }]`，供「从当前对话提取」 |
| `onSend` | | `(text) => Promise`，预览区出现「发送到当前会话」按钮 |
| `composer` | | `Composer` 实例，预览区出现「写入输入框」按钮（另有始终可用的「复制 Prompt」） |
| `getRecentSessions` | | `() => Promise<Array<{ intent?, summary? }>>`，显示「追加最近会话摘要」区块 |
| `searchMemory` | | `(query) => Promise<string>`，显示「按自然语言搜索项目记忆」区块 |

### `<QuickEnhancer />`

| Prop | 必填 | 说明 |
| --- | --- | --- |
| `methodProvider` | ✅ | `MethodProvider` 实例 |
| `composer` | ✅ | `Composer` 实例；生成 / 增强 / 撤销全部经它读写草稿 |
| `enhancer` | | `Enhancer` 实例；未注入时仅保留「轻量 · 零 Token」档位 |
| `messages` | | 当前对话数组，供「加对话」参考与消息选择 |
| `searchMemory` | | `(query) => Promise<string>`，提供「加项目记忆」上下文档位 |

## 用法

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

### 运行示例

```bash
cd promptkit
python3 -m http.server 8080
# 浏览器打开 http://localhost:8080/examples/basic/
```

示例页面用 importmap 直连 `src/`（React 走 esm.sh CDN），无需构建步骤。

## 目录结构

```
dsh-promptkit/
├── src/
│   ├── core/        # 三接口定义（MethodProvider / Composer / Enhancer）
│   ├── lib/         # 通用纯函数（utils.js：分类链 / planPromptEnhancement / conversationMessages / ...）
│   ├── methods/     # 开源方法库（builtin.js → 动态加载 builtin.json，12 个 Markdown 方法）
│   ├── adapters/    # 默认实现（StaticMethodProvider / TextareaComposer / OpenAIEnhancer）
│   ├── ui/          # 组件（foundation.js 基础设施 + studio.js + quick-enhancer.js）
│   └── index.js     # 公共入口（npm 库形态）
├── methods/         # 12 个 Markdown 方法库（从 Memory Center 迁移，带 frontmatter + 完整 prompt 正文）
│   ├── builtin.json # 构建产物（scripts/build-methods.mjs 从 Markdown 解析生成，勿手改）
│   ├── 决策/        # 双向钢人论证、用最小实验替代空想
│   ├── 学习/        # 事实核查、双层解释法、反向拆解、横纵分析法
│   ├── 解决问题/    # 专家会诊、第一性原理、跨领域借解
│   ├── 认识你自己/  # 人生设计术、挖掘隐藏天赋
│   └── 问清问题/    # 苏格拉底式提问
├── dsh/             # 独立 DSH 插件 glue（standalone-glue.js：插槽注册 + 默认 adapter 装配）
├── scripts/         # build-methods.mjs（md → builtin.json）+ build-client.mjs（零依赖浏览器端构建器：standalone + embed 两产物）
├── ui/client.js     # 生成的独立 DSH 浏览器视图（勿手改，npm run build:ui 产出）
├── ui/embed.js      # 生成的标准嵌入产物（Embed Protocol v1，勿手改，供其他插件消费）
├── docs/EMBED.md    # 嵌入协议标准（宿主接入指南）
├── test/            # embed 契约测试（最小宿主环境执行 ui/embed.js，锁定协议面）
├── examples/basic/  # 零构建可运行 demo（importmap + esm.sh）
├── LICENSE          # MIT
└── package.json     # 含 dsh.client manifest（DSH Loader 发现用）
```

## DSH 插件架构

本仓库 `package.json` 声明 `dsh.client`（浏览器端插件 manifest），DSH Web App 的 ModuleLoader 自动发现并加载 `ui/client.js`：

- **内置 12 个 Markdown 方法**（`StaticMethodProvider`，全本地、零后端，prompt 正文随包内联）；
- **方法工坊**挂 `conversation.view` 插槽（DSH 顶部标签页），**快捷助手**挂 `conversation.input.right` 插槽（输入框右侧悬浮按钮）；
- 「写入消息框」桥接 DSH 会话输入框（`conversation.input.right` 注入的 `inputActions`），「发送到当前会话」走 DSH 会话 API；
- **可选语义增强**（模型改写草稿）：配置 `window.DSH_PROMPTKIT_CONFIG = { baseUrl, apiKey, model }` 或 localStorage `dsh-promptkit.config.v1`（任意 OpenAI 兼容端点）；未配置时自动降级为轻量增强（零 Token）。

构建产物 `ui/client.js` 为单文件 lazy-CJS 工厂（`window.__ModuleLoader__.load`），由 `scripts/build-client.mjs` 从 `src/` 剥离 ESM 语法拼接生成——**组件代码只有一份源码**，npm 库形态与 DSH 插件形态共用。

## 嵌入其他插件（Embed Protocol v1）

任何 DSH 插件（宿主）都可以组合 dsh-promptkit 的方法工坊与对话增强器，**dsh-promptkit 对宿主零感知**：

- 标准产物 `ui/embed.js`：IIFE 私有化全部内部符号，仅暴露 `PromptKit` 命名空间（组件 / 方法源 / 基类 / utils），唯一前提是宿主闭包提供 `React`；
- 视觉命名空间 `pk-*` 独立于宿主主题，两插件可同装一个 DSH 实例互不覆盖；
- 宿主自持集成脚本与 adapter（方法源 / 草稿读写 / 模型调用），按 props 契约装配组件；
- 契约有测试锁定（`test/embed.test.js`，7 项），协议面只增不改。

完整契约与接入步骤见 **[docs/EMBED.md](docs/EMBED.md)**。首个参考实现是 memory-center-dsh-plugin（其 `scripts/integrate-promptkit.mjs` + `ui/promptkit-adapters.js` 即标准宿主样例）。

## 宿主对接（写哪些 adapter）

以任意宿主插件为例，经 `PromptKit` 命名空间接入同一份核心：

```js
// 拼接 ui/embed.js 后，宿主闭包内可用 PromptKit（详见 docs/EMBED.md）

// 1) 方法源：直接用内置 12 方法（storagePrefix 隔离本宿主的收藏/历史）
const methodProvider = new PromptKit.StaticMethodProvider({ storagePrefix: 'my-host.' })
//    或继承基类桥接宿主自己的方法源：
//    class HostMethodProvider extends PromptKit.MethodProvider { async list() { ... } }

// 2) 写入目标：桥接 DSH 消息框（conversation.input.right 注入的 input / inputActions）
class DshComposer extends PromptKit.Composer {
  getDraft() { return this.input?.draft ?? '' }
  write(text) { this.inputActions?.setDraft(text) }
  onChange(cb) { return subscribeDraft(cb) }   // 订阅草稿变化
}

// 3) 模型调用（可选）：桥接宿主后端或直连 OpenAI 兼容端点
class HostEnhancer extends PromptKit.Enhancer {
  async enhance({ draft, extra, lang, kind, method }) { /* 宿主模型调用 */ }
  cancel() { /* 透传 AbortController */ }
}

// 4) 对话上下文：DSH snapshot → messages（宿主 glue 职责，可复用工具函数）
const messages = PromptKit.utils.conversationMessages(useSession(value => value))
```

### 方法库来源

12 个方法从 Memory Center 的 `prompts/` 目录迁移而来（Markdown 格式，带 frontmatter 元数据：场景、用途、标签、触发词）。`prompt` 字段提取正文「## Prompt」代码块作为干净模板（对齐 MC 原版行为，剥离文章叙述；无代码块时回退为完整正文）。用户填入问题/事实/约束后，以「本次任务输入」结构块追加在模板之后生成最终 Prompt——模板中的【…】占位符原样保留，作为方法对模型的填写指令，不做正则替换。

新增方法：在 `methods/` 下新建 Markdown 文件（frontmatter 格式同现有），然后 `npm run build:methods` 重新生成 `methods/builtin.json`（`scripts/build-methods.mjs` 解析 frontmatter + 正文；`mode`/`outcome` 在脚本内 `OVERRIDES` 表维护），再 `npm run build:ui` 把新方法内联到 `ui/client.js`。直接 `npm run build` 一条命令完成全部三步。

## 权限与隐私

| 访问项 | 用途 | 可关闭 |
| --- | --- | --- |
| `window.localStorage` | 收藏 / 历史持久化、可选的语义增强配置（`dsh-promptkit.*` 前缀，与其他插件隔离） | 清除 localStorage 即清空，无服务端持久化 |
| DSH 会话输入框（`inputActions.setDraft`） | 「写入输入框」按钮把生成的 Prompt 填入当前对话草稿 | 不点按钮不触发 |
| DSH 会话 API（`session.prompt`） | 「发送到当前会话」按钮把 Prompt 作为消息发出 | 不点按钮不触发 |
| `fetch`（可选） | 仅在用户主动配置语义增强端点时发起请求，调用用户指定的 OpenAI 兼容 API | 不配置则不发起任何网络请求 |

**零遥测**：本插件不收集任何使用数据，不向任何第三方服务发送信息。所有数据存储在用户本地 localStorage，可随时清除。

## 支持环境与兼容性

| 环境 | 要求 |
| --- | --- |
| DeepSeek Harness | Developer Preview（建议 `@deepseek-ai/dsh` 0.1.0-rc.x 及以上） |
| Node.js | ≥ 18（构建脚本使用 `node --test`） |
| 浏览器 | Chrome 90+ / Firefox 88+ / Safari 14+（需支持 ES Modules + `AbortController`） |
| React | ≥ 17（peer dependency，DSH Web App 内置） |

> **兼容性声明**（2026-08-26）：DeepSeek Harness 处于 Developer Preview 阶段，接口可能不兼容变更。本插件基于 `dsh.client` manifest（`platform: "web"`）和 `conversation.view` / `conversation.input.right` 插槽开发，DSH 版本更新后请以 `dsh --dump-config` 实际输出为准。

## 贡献

欢迎提交 Issue 和 PR。请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

新增思考方法只需在 `methods/` 下新建 Markdown 文件，然后 `npm run build` 重新生成——详见 [方法库来源](#方法库来源) 章节。

## License

MIT
