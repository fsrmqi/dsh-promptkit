# PromptKit

开源的 Prompt 构建与增强工具包，包含两个独立可用的能力：

- **`PromptStudio`（方法工坊）**：选择思考方法，用问题 / 事实 / 约束生成可编辑 Prompt。
- **`QuickEnhancer`（对话快捷增强器）**：悬浮在对话旁的按钮，把当前输入框提示词做轻量 / 语义增强，或从方法库填充、改造。

## 设计原则：单一代码源，双消费

PromptKit 核心 **零依赖任何宿主**。它只定义三个解耦接口，具体实现由宿主注入：

| 接口 | 职责 | 开源默认实现 | Memory Center 闭源实现 |
| --- | --- | --- | --- |
| `MethodProvider` | 方法源 / 组合 / 模板 | `StaticMethodProvider`（内置 7 个通用方法） | 接 MC 私有 catalog |
| `Composer` | 写入目标输入框 | `TextareaComposer`（任意 textarea） | 接 DSH 消息框 `inputActions` |
| `Enhancer` | 语义 / 轻量增强的模型调用 | `OpenAIEnhancer`（任意 LLM） | 接当前会话模型 |

这样 **开源出去的和你自用的，是同一份核心代码**——差别只在注入什么 adapter，绝不分叉成两份维护。

## 目录结构

```
promptkit/
├── src/
│   ├── core/        # 三接口定义（MethodProvider / Composer / Enhancer）
│   ├── lib/         # 通用纯函数（utils.js：cleanSummary / planPromptEnhancement / ...）
│   ├── methods/     # 精选开源方法库子集（builtin.js）
│   ├── adapters/    # 示例实现（StaticMethodProvider / TextareaComposer / OpenAIEnhancer）
│   ├── ui/          # 组件（foundation.js 基础设施 + studio.js + quick-enhancer.js）
│   └── index.js     # 公共入口
├── examples/        # 最小可运行 demo（规划中）
└── package.json
```

## 当前状态（迁移中）

- ✅ 基础设施、工具函数、方法库、示例 adapter、三接口 已全部就位
- ✅ 两个组件已从 Memory Center 原样搬迁（`src/ui/studio.js` / `src/ui/quick-enhancer.js`）
- ✅ 私有 localStorage 命名空间已从 `memory-center.*` 改为 `promptkit.*`
- 🚧 两个组件内部仍引用 `useResource` / `fetchView` / `useSession` / `inputActions` / `input` 等宿主私有运行时（见文件内 `TODO(开源解耦)`）。下一阶段将改为接收注入的 `deps`，使其可脱离 Memory Center 独立运行。

## 用法（接口化完成后）

```js
import {
  PromptStudio, QuickEnhancer,
  StaticMethodProvider, TextareaComposer, OpenAIEnhancer,
} from 'promptkit'

// 自选 adapter 注入即可，核心零改动
<PromptStudio methodProvider={new StaticMethodProvider()} composer={/* your Composer */} onSend={/* your sender */} />
<QuickEnhancer
  methodProvider={/* your MethodProvider */}
  composer={new TextareaComposer(textareaEl)}
  enhancer={new OpenAIEnhancer({ endpoint, apiKey, model })}
  messages={messages}
/>
```

## License

MIT
