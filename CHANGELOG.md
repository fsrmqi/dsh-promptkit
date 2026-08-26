# 变更日志

本项目的所有重要变更记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### 待发布
- 首次发布到 GitHub + npm
- 待添加 GitHub topic `dsh-plugin`

## [0.1.0] - 2026-08-26

### 新增
- **PromptStudio（方法工坊）**：选择思考方法 → 填写问题/事实/约束 → 生成可编辑 Prompt 预览 → 写入输入框或发送到会话
- **QuickEnhancer（对话快捷增强器）**：悬浮在对话旁的按钮（⌘K），支持轻量增强（零 Token）和语义增强（可选 OpenAI 兼容端点）
- **内置 12 个 Markdown 思考方法**：双向钢人论证、用最小实验替代空想、事实核查、双层解释法、反向拆解、横纵分析法、专家会诊、第一性原理、跨领域借解、人生设计术、挖掘隐藏天赋、苏格拉底式提问
- **Embed Protocol v1**：`ui/embed.js` 标准嵌入产物，任何 DSH 插件可按协议组合方法工坊与对话增强器（`PromptKit` 命名空间，IIFE 私有化，`pk-*` 视觉命名空间隔离）
- **三接口解耦设计**：`MethodProvider` / `Composer` / `Enhancer`，开源默认实现 + 宿主可注入自定义 adapter
- **零依赖构建**：`scripts/build-client.mjs` 从 `src/` 剥离 ESM 语法拼接为单文件浏览器工厂，无打包器
- **契约测试**：`test/embed.test.js`（7 项），在最小宿主环境执行 `ui/embed.js`，锁定协议面
- **运行示例**：`examples/basic/` 零构建 demo（importmap + esm.sh CDN）
- **DSH 插件 manifest**：`package.json` 声明 `dsh.client`（`platform: "web"`），DSH Web App ModuleLoader 自动发现
- **协议文档**：`docs/EMBED.md`（宿主接入五步 + 契约面定义 + 变更政策）
