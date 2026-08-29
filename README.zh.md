# PromptKit

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/fsrmqi/dsh-promptkit/actions/workflows/ci.yml/badge.svg)](https://github.com/fsrmqi/dsh-promptkit/actions/workflows/ci.yml)
[![DSH Plugin](https://img.shields.io/badge/DSH-Plugin-blue.svg)](https://github.com/topics/dsh-plugin)
[![Node: >=18](https://img.shields.io/badge/node-%3E%3D18-green.svg)](https://nodejs.org)
[![Listed on dsh-plugin.org](https://dsh-plugin.org/badges/listed.svg)](https://dsh-plugin.org/plugins/fsrmqi/dsh-promptkit)

[English](README.md) · [简体中文](README.zh.md)

> 把一段粗糙的草稿变成结构化、可直接执行的提示词——一键完成，就在 DeepSeek Harness 里。

<!-- TODO: 录制 GIF 后替换：写草稿 → 一键增强 → 流式上屏 + 五维诊断，8 秒内 -->
<!-- ![enhance-demo](docs/images/enhance-demo.gif) -->

```bash
dsh plugin --profile web add dsh-promptkit
```

装完即可用。写一段草稿，点 **✦ 增强**，得到一份结构化提示词——流式出现在预览面板，绝不自动发送。无需 API Key、无需配置：直接复用当前会话的模型。

## 为什么是 PromptKit

**✦ 一键增强，带诊断。** 改写之前，插件先从五个维度审视你的草稿（概念清晰 · 隐含前提 · 可证伪性 · 可行动性 · 语境契合）并给出结论。改写由诊断驱动——未定义的术语被显式定义，假设被标记，模糊要求变成可验证的验收表述。

**🎯 21 个思考方法，自动匹配。** 内置完整的 Markdown 方法库（苏格拉底式提问、第一性原理、双向钢人论证、最小实验……）。增强器根据草稿的信号词自动选择——或在方法工坊里浏览全部方法。

**📚 会闭环的灵感库。** 诊断发现（隐含前提、不可证伪要求）可存为「待验证」假设卡。之后补充证据完成验证；已验证的卡在后续增强中作为上下文注入。你的提示词质量会复利增长。

**🔌 零配置、零遥测、零 Token 可选。** 语义增强复用会话模型；本地轻量模式完全离线可用。不主动触发就没有任何请求离开你的机器。

**兼容性：** 同时支持 DSH `0.1.2-alpha.1+` 与旧版 `0.1.0-rc` 槽位契约，自动适配——两个版本的真实实例均已验证。

<details>
<summary><strong>更多能力</strong>（点击展开）</summary>

- **PromptStudio（方法工坊）** — 高级工作台：浏览 21 个方法，填写事实/约束，发送前生成并预览结构化提示词。
- **灵感库（Vault）** — 草稿与成品 Prompt 的本地库：搜索、收藏、项目分组、带版本对比的派生、JSON 备份恢复。
- **流式输出** — 增强结果逐段流式进入预览面板，带用时徽章与取消按钮。
- **强度三档** — 低（润色）/ 中（标准）/ 高（约 3 倍展开）篇幅预算。
- **发送前自动增强** — 可选；拦截普通 Enter，任何失败自动回退发送原文，绝不阻塞发送。
- **技能引用保留** — 改写丢失 `/tdd` 类技能记号时自动检测，一键补回。
- **`@file` 补全** — 输入 `@` 检索工作区文件（只读文件名，不读内容）。
- **`/pk` 快速插入** — 输入 `/pk 关键词` 弹出紧凑灵感候选菜单（方向键 + Enter），绝不抢占 DSH 原生命令。
- **私有方法** — 粘贴 Obsidian 风格 Markdown 提示词卡；仅存本地，可导出 JSON。
- **模板变量** — 灵感条目的 `{{name}}` 占位符在插入前弹出补值面板。

</details>

## 增强闭环

```
写一段粗糙草稿
      │
      ▼
✦ 增强 ──► 五维诊断 ──► 模型改写（流式）
      │                       │
      │                       ▼
      │              发现自动暂存到「知识区」
      │                       │
      │              你来决定：存为假设卡
      │                       │
      └────► 已验证的卡反哺后续增强 ◄┘
```

## 安装

**npm（推荐）**

```bash
dsh plugin --profile web add dsh-promptkit
```

**GitHub（钉 commit，可复现安装）**

```bash
dsh plugin --profile web add github:fsrmqi/dsh-promptkit#<commit-sha>
```

> 构建产物已提交 Git——GitHub 安装开箱即用，无需本地构建。

**tarball（离线 / 审计）**

```bash
npm pack && dsh plugin --profile web add ./dsh-promptkit-0.1.0.tgz
```

安装后刷新浏览器：输入框旁出现 **✦ 增强**，会话页顶部出现「高级方法工坊」标签。

## 界面模式

插件默认**极简模式**：草稿 → 增强 → 结果，屏幕上没有别的。成功增强 3 次后自动解锁完整界面（方法库、灵感库、统计、强度档位）。也可在 **设置 → 界面模式** 手动锁定。

## 作为 npm 库使用

核心零宿主依赖。四个解耦接口，宿主按契约替换实现：

| 接口 | 职责 | 默认实现 |
| --- | --- | --- |
| `MethodProvider` | 方法源 / 组装 / 模板 / 历史 | `StaticMethodProvider`（21 内置 + 私有方法） |
| `Composer` | 读写目标输入框 | `TextareaComposer` |
| `Enhancer` | 语义模型调用 | `OpenAIEnhancer`（任意 OpenAI 兼容端点） |
| `AssetProvider` | 灵感库保存 / 搜索 / 备份 | `StaticAssetProvider` |

```js
import { PromptStudio, QuickEnhancer, StaticMethodProvider, StaticAssetProvider, TextareaComposer } from 'dsh-promptkit'

const methodProvider = new StaticMethodProvider()
const assetProvider = new StaticAssetProvider()
const composer = new TextareaComposer(document.querySelector('textarea'))

<QuickEnhancer methodProvider={methodProvider} assetProvider={assetProvider} composer={composer} messages={messages} />
```

未注入的能力对应 UI 自动隐藏——完整 props 契约见 [docs/EMBED.md](docs/EMBED.md)。

## 嵌入其他宿主（Embed Protocol v1）

任何 React 宿主都可以通过标准产物 `ui/embed.js` 组合 PromptKit 组件：IIFE 只暴露 `PromptKit` 命名空间，`pk-*` 视觉命名空间与宿主主题隔离。契约由测试锁定。详见 **[docs/EMBED.md](docs/EMBED.md)**。

## 隐私

| 访问 | 用途 | 可关闭 |
| --- | --- | --- |
| `localStorage` | 灵感库、收藏、历史、可选的本地使用信号 | 清除 localStorage；无服务端存储 |
| 目标输入框 | 把生成的提示词填入草稿 | 仅点击时触发 |
| `fetch` | 仅语义增强走本地插件桥 | 不触发就没有请求 |

**零遥测。** 不向第三方发送任何数据；使用信号（默认关闭）永远留在浏览器内。

## 参与贡献

欢迎 Issue 与 PR——见 [CONTRIBUTING.md](CONTRIBUTING.md)。新增思考方法只需在 `methods/` 下放一个 Markdown 文件（frontmatter + `## Prompt` 块）并运行 `npm run build`。

## 许可证

MIT
