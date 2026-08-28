# 变更日志

本项目的所有重要变更记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

## [Unreleased]

### 待发布
- **新增「需求分析」分类 4 张专家方法卡**：需求理解（多轮引导，产出需求理解档案）、需求分析（规格摘要：功能点/边界/业务规则/优先级/待确认项）、需求拆解（用户故事 + Given/When/Then 验收标准 + 最小切片）、需求评审（五维走查 + 可开工门槛），内置方法增至 21 个
- **灵感库资产卡渐进披露 + 认识状态三重编码**：折叠态仅显示类型徽章 + 认识状态（圆点+文字+色，满足 WCAG 不以颜色为唯一信息）+ 标题，点开才展开「为什么重要 / 验证 / 辩证」元数据与操作；认识状态色板覆盖浅色 / 系统暗色 / DSH 暗色三套主题
- **资产卡 P0 收尾（操作行收进展开态）**：原折叠态常驻的操作按钮行（追加 / 用于增强 / 执行下一步 / 填充 / 编辑 / 派生 / 关系 / 比较 / 复制 / 删除）改为仅在卡片展开时渲染（`expandedVaultId === item.id ? ... : null`），折叠态仅留标题 + 认识状态 + 一行正文预览，输入摩擦进一步最小化
- **灵感库抽屉三视图合一（P1 精简）**：原独立的「灵感库 / 思考收件箱 / 关系图谱」合并为同一个抽屉 + 顶部三 tab（灵感库 / 收件箱 / 图谱），消除两个全屏抽屉互相覆盖的迷路问题；收件箱从独立 modal 收进 tab，图谱从 item 内嵌聚焦子图升为独立「全貌」tab（所有节点按异常高亮：红=被推翻 / 黄=待验证 / 灰虚线=久未更新），点击节点聚焦其关联关系；item 的「关系」按钮跳转到图谱 tab 并定位该节点
- **死代码清理**：删除 P1 中性化后遗留的 `attentionPanel` 整行常量（约 2654 字符，`false ? ... : null` 永不渲染）及其伴生的孤儿状态 `vaultAttentionOpen` / `setVaultAttentionOpen`；`grep` 确认全文件无 `attentionPanel` / `vaultAttentionOpen` 残留引用，`npm run check` 全部 16 文件语法通过
- QuickEnhancer 与 PromptStudio 的入口调整
- 自动方法匹配统一草稿、对话、可选记忆和 `@文件` 引用上下文，并允许一键改用建议方法
- 独立 DSH 插件的语义增强复用当前会话模型，不要求用户配置 API Key 或 endpoint
- 支持粘贴 Obsidian 风格 Markdown 卡片导入本地私有方法
- 可选本地用法计数、增强后本地 👍/👎 反馈与二次确认清空
- `MethodProvider.onHistoryChange()`：QuickEnhancer 与 PromptStudio 同步最近方法
- `@文件` 引用识别与可选 `searchMemory` adapter
- 首次发布到 GitHub + npm；待添加 GitHub topic `dsh-plugin`

## [0.1.0] - 2026-08-26

### 新增
- **PromptStudio（方法工坊）**：选择思考方法 → 填写问题/事实/约束 → 生成可编辑 Prompt 预览 → 写入输入框或发送到会话
- **QuickEnhancer（对话快捷增强器）**：悬浮在对话旁的按钮（⌘K），支持轻量增强（零 Token）与可注入语义增强
- **内置 12 个 Markdown 思考方法**：双向钢人论证、用最小实验替代空想、事实核查、双层解释法、反向拆解、横纵分析法、专家会诊、第一性原理、跨领域借解、人生设计术、挖掘隐藏天赋、苏格拉底式提问
- **Embed Protocol v1**：`ui/embed.js` 标准嵌入产物，任何 DSH 插件可按协议组合方法工坊与对话增强器（`PromptKit` 命名空间，IIFE 私有化，`pk-*` 视觉命名空间隔离）
- **三接口解耦设计**：`MethodProvider` / `Composer` / `Enhancer`，开源默认实现 + 宿主可注入自定义 adapter
- **零依赖构建**：`scripts/build-client.mjs` 从 `src/` 剥离 ESM 语法拼接为单文件浏览器工厂，无打包器
- **契约测试**：`test/embed.test.js`（7 项），在最小宿主环境执行 `ui/embed.js`，锁定协议面
- **运行示例**：`examples/basic/` 零构建 demo（importmap + esm.sh CDN）
- **DSH 插件 manifest**：`ui/package.json` 声明 `dsh.client`（`platform: "web"`），DSH Web App ModuleLoader 自动发现
- **协议文档**：`docs/EMBED.md`（宿主接入五步 + 契约面定义 + 变更政策）
