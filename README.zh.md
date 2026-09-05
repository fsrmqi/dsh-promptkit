# PromptKit

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CI](https://github.com/fsrmqi/dsh-promptkit/actions/workflows/ci.yml/badge.svg)](https://github.com/fsrmqi/dsh-promptkit/actions/workflows/ci.yml)
[![DSH Plugin](https://img.shields.io/badge/DSH-Plugin-blue.svg)](https://github.com/topics/dsh-plugin)
[![Node: >=22.6](https://img.shields.io/badge/node-%3E%3D22.6-green.svg)](https://nodejs.org)
[![Listed on dsh-plugin.org](https://dsh-plugin.org/badges/listed.svg)](https://dsh-plugin.org/plugins/fsrmqi/dsh-promptkit)

[English](README.md) · [简体中文](README.zh.md)

当前仓库版本：**0.2.1**（本地版本收口，尚未执行发布）。[升级记录：每版功能与注意事项](docs/UPGRADE-HISTORY.md) · [技术变更清单](CHANGELOG.md)

> 把一段粗糙的草稿变成结构化、可直接执行的提示词——一键完成，就在 DeepSeek Harness 里。

<!-- TODO: 录制 GIF 后替换：写草稿 → 一键增强 → 流式上屏 + 五维诊断，8 秒内 -->
<!-- ![enhance-demo](docs/images/enhance-demo.gif) -->

```bash
dsh plugin --profile web add dsh-promptkit
```

写一段草稿，点 **✦ 增强**，得到一份更清楚、仍保持原意与范围的提示词——流式出现在预览面板，完成后填入消息框，不自动发送。PromptKit 无需单独配置 API Key，语义增强复用 DSH 已配置的会话模型；没有模型路由时会提示先建立会话模型路由。本地轻量增强不需要模型。

## 为什么是 PromptKit

**✦ 一键增强，保持任务粒度。** 默认只做必要的表达整理，不擅自新增计划、验收或交付阶段。五维诊断（概念清晰 · 隐含前提 · 可证伪性 · 可行动性 · 语境契合）是当前界面中可主动开启的审阅工具；它只在确实阻塞原任务时给出简短澄清。

**🎯 22 个思考方法，推荐不等于套用。** 内置完整的 Markdown 方法库（苏格拉底式提问、第一性原理、双向钢人论证、最小实验、项目文档同步……）。智能推荐只提供候选；只有你明确选中后才会用该方法组织改写。

**📚 会闭环的灵感库。** 在诊断卡上明确点「保存到知识区」后，诊断发现（隐含前提、不可证伪要求）才会成为「待验证」假设卡候选。之后补充证据完成验证；已验证的卡可在后续增强中作为上下文注入。

**🔌 零遥测，支持零 Token 模式。** 本地轻量模式离线可用；语义增强会把草稿和选定上下文交给宿主配置的模型服务。项目记忆必须先检索并预览，确认后才会注入；`@` 文件引用由 DSH 原生提及提供，插件不重复实现。

**兼容性：** DSH `0.1.3-alpha.1`（宿主仓库 HEAD 构建）已完成真实 profile 启动验证（安装本地 bundle 后启动 Web、Cookie HTTP 探测、正常退出）；此前 `0.1.2-alpha.2` 已用同一烟测验证。运行 DSH 插件需要 Node `>=22.6`。保留旧版 `0.1.0-rc` 槽位适配，其覆盖来自模拟契约测试，不代表所有旧版本均已完成真机验证。

<details>
<summary><strong>更多能力</strong>（点击展开）</summary>

- **PromptStudio（方法工坊）** — 高级工作台：浏览 22 个方法，填写事实/约束，发送前生成并预览结构化提示词。
- **灵感库（Vault）** — 草稿与成品 Prompt 的本地库：搜索、收藏、项目分组、带版本对比的派生、JSON 备份恢复。
- **流式输出** — 增强结果逐段流式进入预览面板；开启诊断时显示「诊断中」，否则直接输出改写稿，带实时计时与取消按钮。
- **强度三档** — 低（润色）/ 中（细化）/ 高（详述）；只控制表达细致度，不扩大任务范围。
- **发送前自动润色** — 自定义宿主注入 `onSubmitDraft` 并实现 `composer.isInputTarget()` 后可选开启；只拦截消息框 Enter，固定使用保守润色，失败可发送原文一次，发送失败不重试，取消或草稿变化时不发送。独立 DSH 插件未默认接入此发送钩子。
- **技能引用保留** — 改写丢失 `/tdd` 类技能记号时自动检测并补回；关闭提示不会再次改写草稿。
- **`/pk` 快速插入** — 输入 `/pk 关键词` 弹出紧凑灵感候选菜单（方向键 + Enter），绝不抢占 DSH 原生命令。
- **私有方法** — 粘贴 Obsidian 风格 Markdown 提示词卡；仅存本地，可导出 JSON。
- **模板变量** — 灵感条目的 `{{name}}` 占位符在插入前弹出补值面板。

</details>

## 增强闭环

```
写一段粗糙草稿
      │
      ▼
✦ 增强 ──► 保持原意的模型改写（流式）
      │
      ├────► 可选：五维诊断（仅本次查看）
      │
      └────► 用户主动保存并验证的卡，才可作为后续增强上下文
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
npm pack && dsh plugin --profile web add ./dsh-promptkit-0.2.1.tgz
```

安装后刷新浏览器：输入框旁出现 **✦ 增强**，会话页顶部出现「高级方法工坊」标签。升级涉及 Node 插件时，还需通过宿主重载或重启 DSH，避免继续运行缓存的旧代码。npm 命令获取的是已发布版本；验证本仓库当前版本可使用 tarball。完整步骤见 [升级记录](docs/UPGRADE-HISTORY.md)。在独立 DSH 插件中，从增强器点「高级工坊 →」会把草稿预填到工坊并自动切换到对应会话标签。

## 界面

插件只保留一套稳定的完整配置界面：方式选择、对话/项目记忆参考、强度、方法切换及可选五维诊断始终可见。工具栏集中提供收藏草稿、打开灵感库、带入高级工坊与方法收集进度；快捷键 ⌘K 唤起面板，常用方法可从启动按钮扇形菜单直达。

## 作为 npm 库使用

核心零宿主依赖。四个解耦接口，宿主按契约替换实现：

| 接口 | 职责 | 默认实现 |
| --- | --- | --- |
| `MethodProvider` | 方法源 / 组装 / 模板 / 历史 | `StaticMethodProvider`（21 内置 + 私有方法） |
| `Composer` | 读写目标输入框 | `TextareaComposer` |
| `Enhancer` | 语义模型调用 | `OpenAIEnhancer`（任意 OpenAI 兼容端点） |
| `AssetProvider` | 灵感库保存 / 搜索 / 备份 | `StaticAssetProvider` |

```js
import { PromptStudio, QuickEnhancer, StaticMethodProvider, StaticAssetProvider, TextareaComposer } from 'dsh-promptkit/browser'

const methodProvider = new StaticMethodProvider()
const assetProvider = new StaticAssetProvider()
const composer = new TextareaComposer(document.querySelector('textarea'))

<QuickEnhancer methodProvider={methodProvider} assetProvider={assetProvider} composer={composer} messages={messages} />
```

未注入的可选能力会隐藏或降级。支持 `browser` 条件的构建器也可导入根包；默认 Node 入口额外导出 DSH 插件注册能力。运行要求 Node `>=22.6` / React 17+，源码开发测试使用 Node 24.15+。完整契约和已验证组合见 [嵌入协议](docs/EMBED.md) 与 [升级记录](docs/UPGRADE-HISTORY.md#v021)。

## 嵌入其他宿主（Embed Protocol v1）

任何 React 宿主都可以通过标准产物 `ui/embed.js` 组合 PromptKit 组件：IIFE 只暴露 `PromptKit` 命名空间，`pk-*` 视觉命名空间与宿主主题隔离。契约由测试锁定。详见 **[docs/EMBED.md](docs/EMBED.md)**。

## 隐私

| 访问 | 用途 | 可关闭 |
| --- | --- | --- |
| `localStorage` | 灵感库、收藏、历史、偏好与可选详细统计 | 详细统计默认关闭；清除浏览器数据会丢失本地资产，请先备份 |
| 目标输入框 | 按按钮或快捷键填入结果；自定义宿主可显式接入自动发送 | 未接入发送钩子时只写草稿；异步写回前检查草稿是否变化 |
| 本地插件请求 | 语义增强桥接、可选项目记忆检索 | 按对应功能触发 |
| 配置的模型端点 | 处理语义增强的草稿和所选上下文 | 使用轻量模式可避免模型调用 |

**零遥测。** 不上传使用统计。语义增强不是离线处理：模型服务可能位于第三方，提交前应检查草稿和所选上下文中是否含敏感信息。项目记忆与自定义 adapter 的数据处理由宿主实现决定。

## 参与贡献

欢迎 Issue 与 PR——见 [CONTRIBUTING.md](CONTRIBUTING.md)。新增思考方法只需在 `methods/` 下放一个 Markdown 文件（frontmatter + `## Prompt` 块）并运行 `npm run build`。

## 许可证

MIT
