# PromptKit

> npm 包名 / 仓库名：**`dsh-promptkit`**

开源的 Prompt 构建与增强工具包，包含两个独立可用的能力：

- **`PromptStudio`（方法工坊）**：选择思考方法，用问题 / 事实 / 约束生成可编辑 Prompt。内置 12 个完整 Markdown 方法（带 frontmatter 元数据 + 完整 prompt 正文）。
- **`QuickEnhancer`（对话快捷增强器）**：悬浮在对话旁的按钮（⌘K），把当前输入框提示词做轻量 / 语义增强，或从方法库填充、改造。

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

## 作为 DSH 插件直接安装

本仓库自带 DSH 浏览器插件形态，无需写任何代码即可在 DSH 中使用：

```bash
# 1. 构建独立浏览器视图（生成 ui/client.js，零依赖拼接，无打包器）
npm run build:ui

# 2. 把本包放入 DSH 插件目录（结构对齐 memory-center-dsh-plugin-ui 模式：
#    package.json 的 dsh.client manifest + ui/client.js，DSH Loader 自动发现）
```

- 插件形态使用**内置 12 个 Markdown 方法**（`StaticMethodProvider`，全本地、零后端，prompt 正文随包内联）；
- 「写入消息框」桥接 DSH 会话输入框（`conversation.input.right`），「发送到当前会话」走 DSH 会话 API；
- 可选开启语义增强（模型改写草稿）：配置 `window.DSH_PROMPTKIT_CONFIG = { baseUrl, apiKey, model }` 或 localStorage `dsh-promptkit.config.v1`（任意 OpenAI 兼容端点）；未配置时自动降级为轻量增强（零 Token）。

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

## License

MIT
