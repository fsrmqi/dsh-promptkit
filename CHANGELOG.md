# 变更日志

本项目的所有重要变更记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)，版本号遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/)。

## [未发布]

### 新增

- 新增「项目文档同步」方法卡：自动匹配“文档同步 / 同步文档 / 更新文档 / 文档更新”等明确复合意图，面向项目近期改动同步 README、docs、CHANGELOG 等直接相关文档；避免被“修改/优化”等泛开发词误归为最小实验或轻量整理。
- 流式增强阶段监控与实时计时：面板阶段细化为「等待模型响应 → 诊断中 → 输出中 → 完成」，流式期间实时显示已用秒数；host 侧 `streamEnhanceWithCurrentSessionModel` 新增 `onEvent` 过程回调（`start` / `first-token` / `prompt-start` / `finish`，含首字延迟与总耗时），SSE 通道在诊断→改写切换时推送 `event: stage`，`DshSessionEnhancer.enhanceStream()` 新增可选 `onStage` 回调；Node 半区为增强链路增加过程日志打点（首字 30s+ 对思考型模型属正常，让「慢」可归因）。
- 增强器与高级方法工坊打通：快捷增强器点「高级工坊 →」除经 sessionStorage 桥预填草稿外，独立 DSH 插件宿主监听桥事件并自动 `openView` 切换到 `promptkit-studio` 会话标签；工坊侧兼容 `window.__promptkitStudioPendingDraft` 内存桥作为 sessionStorage 不可用时的回退。
- 增强器统一为单一完整配置界面：方式选择、上下文、强度、方法切换与可选五维诊断始终可见；增强完成卡提供明确的「撤销上一次填入」按钮。
- 对话增强器工具栏整合：收藏草稿、打开灵感库、高级工坊入口与「方法收集进度」（已用 N / 总数进度条）统一收进统计区下方的集中式工具栏，取代原先分散在面板头部的按钮。

### 修复与改进

- 智能推荐兜底移除：未命中任务信号时不再兜底「苏格拉底式提问 / 第一性原理」，避免普通短问题被误包装成多轮问诊或深度审查；快捷键常用方法直达不受影响。
- 默认改写保持原任务粒度：轻量与语义增强不再擅自新增计划、验收标准、固定输出格式或交付阶段；智能匹配仅推荐方法，用户明确选中后才注入方法模板。
- 五维诊断改为默认关闭的本次审阅工具；诊断不再自动写入知识区，用户须显式点「保存到知识区」。项目记忆必须先检索并预览才可注入；项目记忆、对话和思考卡只补充背景，当前草稿与本次要求优先；自动发送固定使用低强度保守润色。
- 「参考上下文（可选）」独立成组并加分组标签；「应用增强到消息框」主按钮移入决策摘要卡右上角（摘要卡旁新增「应用后仍可编辑，不会自动发送。」提示）。

### 移除

- 移除宿主输入框上的 `@` 文件引用补全（`FileMenuNode`、`useFileCompletion`、`workspaceFilesRoute` 与 `/dsh-promptkit/workspace-files` 路由）。原因：经拆解 DSH `0.1.2-alpha.2` 的 `dsh-file-reference` 与 `dsh-client-ui-reference` 确认，原生 `@` 提及与插件补全是同一件事且为严格超集（文件 + 会话候选、目录下钻、引号路径、原子行内引用）；插件菜单与原生菜单同时弹出互相遮挡，window 捕获阶段吞键使原生菜单无法键盘操作，整段重写草稿尾段还会破坏原子引用。该功能本是为无原生 `@` 的旧 Web profile 补位，原生覆盖后仅剩冲突价值。
- 嵌入参数 `searchFiles` 一并移除；自定义宿主保留注入不报错但无效果。增强流程对草稿中已有 `@path` 引用的保留保护（`fileMentions`）不受影响。详见 [升级记录](docs/UPGRADE-HISTORY.md#unreleased)。
- 移除极简/完整「界面模式」、首次体验自动展开逻辑及 `display-mode.v1` 兼容读取；不再保留「再细化…」分支。

### 兼容性（DSH 0.1.3-alpha.1 适配复查）

- 对齐基线 `0.1.2-alpha.2` → `0.1.3-alpha.1`（约 330 提交，含 `0.1.2-rc.1`）复查宿主契约：`conversation.input.right` 槽位不再下发 `InputZone { session, input }` owner props（ownerProps 清空，槽位改由 `conversation.composer.bar` 声明渲染）。快捷增强器的草稿真源自动回落到 `useInput` 订阅通道——该通道属 `SessionStandardProps`，对 session 作用域条目在三代宿主（`0.1.0-rc` / `0.1.2-alpha` / `0.1.3-alpha.1+`）均下发，无需用户操作；InputZone 点时快照（0.1.2 下发时）仍优先。
- 复核未受影响契约：`InputActions.setDraft/submit`、`conversation.view`（`viewRequest`/`openView`/`completeViewRequest`）、`useChat` 的 `legacy.nodes` 消息投影（`LegacyConversationSlice` 两版逐字节相同）、node 半区 `ctx.webServer.register` / `ctx.llm.stream` / `agent/created` / `agent/disposed`、bundle patch loader 行约定，均无变化。
- 宿主新增/重命名备查（PromptKit 均未消费）：附件体系 `imageIds`→`attachmentIds`、`addImages/removeImage/pruneImages`→`addAttachments/removeAttachment/pruneAttachments`、`ComposerAttachment` 拆分 image/file 联合、`CommandClaim.images`→`attachments`、新增通用文件上传（`dsh-client-file-upload`）；chat 侧新增 keyed hooks（`UseChatNode`/`UseChatNodeProcess`）与 `loadThrough` 分页回看。
- 三处槽位契约注释更新为三代宿主对照（`dsh/standalone-glue.js` 及重建产物 `ui/client.js`、`ui/client-lite.js`）。

## [0.2.1] - 2026-08-30

状态：待发布；本次仅完成本地版本收口。面向使用者的功能说明与升级操作见 [升级记录](docs/UPGRADE-HISTORY.md#v021)。

### 新增与改进

- 2026-08-31 适配复查：从 `useChat` 的 `legacy.nodes` 读取消息，不再将 `InputZone.session` 状态误作对话；新版快照回归验证实际消息内容。
- 模型流必须以 `finish.reason.kind=stop` 结束；错误、取消、长度截断及缺少终止帧均不能作为成功结果写回草稿。
- 烟测改为安装 `npm pack` 产物，验证登录 Cookie 跳转后的 HTTP 响应，并等待正常退出；超时强制回收子进程后才清理临时 profile。

- 浏览器专用 ESM 入口与条件导出，默认 Node 入口保留 DSH 注册能力。
- 诊断保留部分有效字段并返回格式状态；知识区识别检查通过/真实缺口，使用完整草稿去重。
- 文件检索按会话工作区隔离，使用有界异步索引与短期缓存，结果不完整时明确提示。
- 首次体验以独立的 0~3 次成功进度展开界面，不依赖详细统计开关。

### 修复

- 统一草稿提交守卫，取消、切换会话或新编辑后，旧增强/模板/方法库结果不能覆盖新内容。
- 修复选区增强重复全文、快捷键使用旧档位/旧草稿/旧方法，以及技能提示二次写回。
- 自动增强仅拦截明确的消息框 Enter；增强失败才可发送原文一次，发送失败不重试。
- 流式仅在明确不支持且尚无输出时降级；断流、超时和取消不重复调用模型。
- 修复 React 列表警告、源码引用缺失、文件补全重复拼接 @、窄屏边距及宿主顶栏遮挡。

### 升级与验证

- 自定义发送宿主须实现 composer.isInputTarget()；文件路由须携带 session_id，缺失或未知会话不再回退启动目录。详见升级记录。
- 同步根包、锁文件、UI 清单与安装示例；开发 CI 使用 Node 24，DSH 插件消费运行要求为 Node >=22.6 / React 17+。
- 93 项回归、四组 Node/React 消费安装及产物可复现检查通过；新增 alpha-channel 空 profile 启动烟测，DSH 0.1.2-alpha.2 完成真实启动验证，旧槽位仅声明模拟契约覆盖。

## [0.2.0] - 2026-08-29

### 新增
- **诊断闭环「知识区」：发现 → 用户裁决 → 假设卡 → 增强上下文**：语义增强诊断出的认识缺口（隐含前提/不可证伪要求）自动暂存到灵感库新增的「知识区」tab（localStorage 持久化，上限 12 条，暂存≠存卡、不写 Vault）；用户逐条审阅后**主动决定**——「存为假设卡」写入 Vault（assumption + to_verify，进收件箱待验证队列，provenance 带诊断快照与草稿指纹）或「忽略」（仅从暂存移除）。同一草稿同一维度按指纹查重不重复入区/建卡；诊断卡提供「查看知识区」入口与待审阅计数。存下的卡勾选「用于增强」即注入思考卡上下文（已有注入指令要求不把待核实内容表述为事实），形成「诊断发现缺口 → 验证 → 下次增强受益」的闭环
- **五维诊断哲学化升级 + 方法感知量表**：诊断维度从通用体检表升级为五条哲学启发式——概念清晰（苏格拉底式概念澄清：哪些关键词未定义/一词多义）、隐含前提（第一性原理：草稿默认了哪些未言明假设）、可证伪性（Popper：哪些要求无法被观察或测试判定）、可行动性（实用主义准则：执行会产出什么可观察结果）、语境契合（诠释学：是否重复/矛盾于上下文）。诊断结果直接驱动改写（标记的术语显式定义、假设标【待确认】、不可证伪要求改写为可观察验收表述）；自动匹配到旗舰方法（苏格拉底式提问/第一性原理/双向钢人论证/最小实验/事实核查/假设检验）时，诊断按该方法的检查侧重执行（方法感知量表），未命中回退通用侧重。哲学家名字不进提示词——哲学只作为内部设计依据，用户看到的标签保持朴素；诊断卡标题显示当前侧重方法
- **诊断协议统一下沉**：`[DIAG]` 解析与维度定义从 host 侧下沉到 `src/lib/utils.js`（`parseEnhanceOutput` / `DIAGNOSIS_DIMENSIONS`），host 指令与客户端解析共用一份协议，防止两端漂移；流式期间诊断行先于正文到达，诊断卡随流增量填充，预览段过滤 `[DIAG]`/`===PROMPT===` 标记行只上屏正文
- **@ 文件引用补全菜单**：输入框草稿中输入 `@` 即触发工作区文件检索（防抖 140ms），↑↓ 导航、Enter/点击插入 `@路径 `；host 侧新增 `GET /dsh-promptkit/workspace-files` 只读检索路由（忽略 node_modules/.git/dist 等目录，短路径优先），宿主未提供 `searchFiles` 时菜单自动隐藏
- **Vault 模板变量系统**：灵感条目支持 `{{变量}}` 占位符；填充/追加含变量条目时弹出补值面板（留空保留占位符），确认后才写入草稿
- **语义增强强度三档**：低（≈1x，仅润色）/ 中（≈1.5x，标准结构化，默认）/ 高（≈3x，充分展开），host 指令按档位注入篇幅预算，选择持久化到 localStorage
- **语义增强流式上屏（SSE）**：新增 `POST /dsh-promptkit/semantic-enhance/stream` 路由，模型输出经 `event: delta` 逐段推送；面板显示阶段（等待模型响应 → 输出中 → 完成）与用时，可中途取消；流式链路异常自动退回非流式路由，`Enhancer.enhanceStream()` 为可选契约
- **双策略改写**：有对话/记忆/思考卡上下文时按「提炼意图 + 顺势润色」策略（不套模板、不重复追问），无上下文时保持结构模板策略
- **发送前自动增强（fail-safe）**：宿主注入 `onSubmitDraft` 后可开启；仅拦截普通 Enter（Shift+Enter 换行、⌘/Ctrl+Enter、IME 组合输入一律放行），增强失败/超时自动发送原文，对话不中断
- **技能引用保留**：改写丢失草稿中的 `/xxx` 技能记号时给出「补回」一键操作（还原到稿末「技能引用」节），不再静默丢失
- **Embed utils 扩展**：`templateVariables` / `fillTemplateVariables` / `skillMentions` / `restoreLostSkillMentions` / `splitOutputSegments` / `shouldInterceptSend` 暴露到 `PromptKit.utils`
- **对话增强器交互再优化**：① 决策摘要卡改为可折叠 details（默认展开，summary 右侧显示“拟采用：X”一行提示），窄屏不再挤压主流程；② 把“应用增强到消息框”主按钮从决策摘要卡内部移出，提升为面板底部整宽主行动按钮，形成“填写 → 预览 → 应用”清晰三步流；③ 顺带修复一处损坏按钮样式（非法赋值 `C.actionBg : loadrderRadius: '10px'`）；④ 顶部“收藏当前草稿”由 actionBg 大色块降级为 tealTint 次级按钮，降低对增强主流程的视觉抢占；⑤ “管理灵感库”按钮文案改为“打开灵感库 →”，明确其打开独立右侧栏的语义
- **新增「需求分析」分类 4 张专家方法卡**：需求理解（多轮引导，产出需求理解档案）、需求分析（规格摘要：功能点/边界/业务规则/优先级/待确认项）、需求拆解（用户故事 + Given/When/Then 验收标准 + 最小切片）、需求评审（五维走查 + 可开工门槛），内置方法增至 21 个
- **灵感库资产卡渐进披露 + 认识状态三重编码**：折叠态仅显示类型徽章 + 认识状态（圆点+文字+色，满足 WCAG 不以颜色为唯一信息）+ 标题，点开才展开「为什么重要 / 验证 / 辩证」元数据与操作；认识状态色板覆盖浅色 / 系统暗色 / DSH 暗色三套主题
- **资产卡 P0 收尾（操作行收进展开态）**：原折叠态常驻的操作按钮行（追加 / 用于增强 / 执行下一步 / 填充 / 编辑 / 派生 / 关系 / 比较 / 复制 / 删除）改为仅在卡片展开时渲染（`expandedVaultId === item.id ? ... : null`），折叠态仅留标题 + 认识状态 + 一行正文预览，输入摩擦进一步最小化
- **灵感库抽屉三视图合一（P1 精简）**：原独立的「灵感库 / 思考收件箱 / 关系图谱」合并为同一个抽屉 + 顶部三 tab（灵感库 / 收件箱 / 图谱），消除两个全屏抽屉互相覆盖的迷路问题；收件箱从独立 modal 收进 tab，图谱从 item 内嵌聚焦子图升为独立「全貌」tab（所有节点按异常高亮：红=被推翻 / 黄=待验证 / 灰虚线=久未更新），点击节点聚焦其关联关系；item 的「关系」按钮跳转到图谱 tab 并定位该节点
- **死代码清理**：删除 P1 中性化后遗留的 `attentionPanel` 整行常量（约 2654 字符，`false ? ... : null` 永不渲染）及其伴生的孤儿状态 `vaultAttentionOpen` / `setVaultAttentionOpen`；`grep` 确认全文件无 `attentionPanel` / `vaultAttentionOpen` 残留引用，`npm run check` 全部 16 文件语法通过
- **交互体验五项调整 + 三项截图修复 + 双栏布局重构**：① 灵感库捕获表单默认收起（删掉 `vaultAutoOpenRef` 空库自动展开 effect——异步加载初始为 `[]` 导致误触，改为纯手动「+ 新建」展开；仅在保存草稿时自动打开）；② 对话增强器面板由 `position:fixed;right:8px`（在 DSH transform 容器内退化）回退为 `position:absolute;left:50%;transform:translateX(-50%)` 居中浮动；③ 增强步骤条仅在用户已填补充要求或勾选上下文时出现（默认隐藏=快速增强）；④ 灵感库空状态新增「保存当前草稿为灵感」主按钮；⑤ 设置面板低频操作收进「更多操作」折叠；⑥ **Vault 从 `position:fixed; height:100vh` 全高侧边栏改为面板内流式右栏**——经多轮迭代最终定为 position:fixed 全高右侧栏（zIndex 60），与增强器面板顶层平级渲染、互不嵌套（以最新条目为准）
- **UI 一致性 P1：抽离浮层 `Card` 外壳组件**：quick-enhancer 内散落 5 处写法完全一致的「带边框圆角容器」分区卡片（graphPanel 外层 / vault 列表项 / 设置 import·backup·manage 子面板），统一收敛为 foundation 的 `Card({ tint, fontSize, as, style, children })` 组件（默认 padding:9px / tealLine 淡青边框 / 9px 圆角 / surface 背景，tint→tealTint），未来改卡片外观只改一处。未套用 studio 的 `Panel()`（其依赖 S.* 页面级 token 会改变浮层视觉），保持零视觉变化；`npm run check` 16 文件 + `node --check ui/client.js` 均通过
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
