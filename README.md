# PromptKit

> npm 包名 / 仓库名：**`dsh-promptkit`**

开源的 Prompt 构建与增强工具包，包含两个独立可用的能力：

- **`PromptStudio`（方法工坊）**：选择思考方法，用问题 / 事实 / 约束生成可编辑 Prompt。
- **`QuickEnhancer`（对话快捷增强器）**：悬浮在对话旁的按钮（⌘K），把当前输入框提示词做轻量 / 语义增强，或从方法库填充、改造。

## 设计原则：单一代码源，双消费

PromptKit 核心 **零依赖任何宿主**。它只定义三个解耦接口，具体实现由宿主注入：

| 接口 | 职责 | 开源默认实现 | Memory Center 闭源实现 |
| --- | --- | --- | --- |
| `MethodProvider` | 方法源 / 组合 / 模板 / 收藏 / 历史 | `StaticMethodProvider`（内置 10 个通用方法，localStorage 持久化） | 接 MC 私有 catalog |
| `Composer` | 写入目标输入框 | `TextareaComposer`（任意 textarea，含输入订阅） | 接 DSH 消息框 `inputActions` |
| `Enhancer` | 语义增强的模型调用 | `OpenAIEnhancer`（任意 OpenAI 兼容端点） | 接当前会话模型 |

这样 **开源出去的和你自用的，是同一份核心代码**——差别只在注入什么 adapter，绝不分叉成两份维护。

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
│   ├── methods/     # 开源方法库（builtin.js，10 个通用思考方法）
│   ├── adapters/    # 默认实现（StaticMethodProvider / TextareaComposer / OpenAIEnhancer）
│   ├── ui/          # 组件（foundation.js 基础设施 + studio.js + quick-enhancer.js）
│   └── index.js     # 公共入口（npm 库形态）
├── dsh/             # 独立 DSH 插件 glue（standalone-glue.js：插槽注册 + 默认 adapter 装配）
├── scripts/         # build-client.mjs：零依赖浏览器端构建器（standalone / --mc 两模式）
├── ui/client.js     # 生成的独立 DSH 浏览器视图（勿手改，npm run build:ui 产出）
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

- 插件形态使用**内置 10 个通用思考方法**（`StaticMethodProvider`，全本地、零后端）；
- 「写入消息框」桥接 DSH 会话输入框（`conversation.input.right`），「发送到当前会话」走 DSH 会话 API；
- 可选开启语义增强（模型改写草稿）：配置 `window.DSH_PROMPTKIT_CONFIG = { baseUrl, apiKey, model }` 或 localStorage `dsh-promptkit.config.v1`（任意 OpenAI 兼容端点）；未配置时自动降级为轻量增强（零 Token）。

构建产物 `ui/client.js` 为单文件 lazy-CJS 工厂（`window.__ModuleLoader__.load`），由 `scripts/build-client.mjs` 从 `src/` 剥离 ESM 语法拼接生成——**组件代码只有一份源码**，npm 库形态与 DSH 插件形态共用。

## 宿主对接（闭源侧怎么做）

以 Memory Center / DSH 插件为例，写三个 adapter 即可接入同一份核心：

```js
// 1) 方法源：桥接 MC 私有 catalog
class MemoryCenterMethodProvider extends MethodProvider {
  async list() { return (await fetchView(sessionId, 'prompt-catalog')).methods }
  async compose(input) { return fetchView(sessionId, 'prompt-compose', input) }
  async getTemplate(methodId) { return fetchView(sessionId, 'prompt-template', { method_id: methodId }) }
  // 收藏 / 历史可沿用 localStorage（key 与开源版一致），或落到 MC 存储
}

// 2) 写入目标：桥接 DSH 消息框
class DshComposer extends Composer {
  getDraft() { return input.draft }
  write(text) { inputActions.setDraft(text) }
  onChange(cb) { return subscribeDraft(cb) }   // 订阅草稿变化
}

// 3) 模型调用：桥接当前会话模型
class MemoryCenterEnhancer extends Enhancer {
  async enhance({ draft, extra, lang, kind, method }) { /* 调 /memory-center/semantic-enhance */ }
  cancel() { /* 透传 AbortController */ }
}

// 4) 对话上下文：DSH snapshot → messages（本包不感知 snapshot 结构）
const messages = conversationMessages(useSession(value => value))
```

## License

MIT
