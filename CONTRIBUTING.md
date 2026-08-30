# 贡献指南

感谢你考虑为 dsh-promptkit 贡献代码！以下是参与方式。

## 快速上手

源码开发与测试使用 Node 24.15+（CI 使用 Node 24 最新补丁版），以满足 jsdom 的运行要求。发布包本身的 Node 运行时下限仍由 `package.json` 的 `engines` 声明，开发依赖不随安装包安装。

```bash
git clone https://github.com/fsrmqi/dsh-promptkit.git
cd dsh-promptkit
npm ci
npm run build    # 全量语法/入口检查 + 方法库 + 标准/轻量 UI
npm test         # 源码/产物交互、协议、真实 HTTP 与宿主槽位回归
```

构建产物 `ui/client.js`、`ui/client-lite.js` 和 `ui/embed.js` 已提交到 Git。修改源码后需重新 `npm run build`；CI 校验重建后没有产物差异。

QuickEnhancer 的增强事务、文件补全、浮层关闭分别由 `src/ui/quick-enhancer/use-enhancement-flow.js`、`use-file-completion.js`、`use-panel-dismiss.js` 管理。新模块必须加入 `scripts/build-client.mjs` 的共享模块清单；源码入口和拼接产物都要通过交互测试，不能依赖拼接后偶然可见的全局符号。

宿主回归流程见 [DSH 验证清单](docs/DSH-QA.md)。普通 `npm test` 不调用外部模型，真实 HTTP 测试使用本地模型桩，不能代替真机模型验证。

## 新增思考方法

1. 在 `methods/` 对应场景目录下新建 Markdown 文件，文件名即方法标题
2. frontmatter 格式（必须字段：`场景`、`用途`；可选：`标签`、`触发词`、`强触发词`）：
   ````markdown
   ---
   场景: 学习
   用途: 一句话说明这个方法解决什么问题
   标签: [关键词1, 关键词2]
   触发词: 词1, 词2, 词3
   强触发词: 最明确的词1
   ---

   # 方法标题

   正文描述...

   ## Prompt

   ```
   这里是干净的 prompt 模板（会被 build-methods.mjs 提取为 prompt 字段）
   ```
   ````
3. 如果新方法需要 `mode: guided`（逐步追问而非一次性分析）或自定义 `outcome`，编辑 `scripts/build-methods.mjs` 中的 `OVERRIDES` 表
4. 运行 `npm run build` 重新生成 `builtin.json` + `client.js` + `embed.js`

## 代码结构

| 目录 | 职责 | 修改注意 |
| --- | --- | --- |
| `src/core/` | 方法源、Composer、Enhancer、资产源四个接口 | 接口变化需同步更新 `docs/EMBED.md`、相关契约测试和升级记录；历史 Provider 应保留 `onHistoryChange()` 订阅语义 |
| `src/ui/` | React 组件与交互流程 | 修改后运行 `npm run build`，同步标准、轻量和 Embed 三份产物 |
| `src/adapters/` | 默认实现 | 可自由扩展，不影响协议面 |
| `methods/` | 方法库源文件 | Markdown 格式，`build:methods` 解析为 `builtin.json` |
| `scripts/` | 构建脚本 | `build-methods.mjs`（md→json）+ `build-client.mjs`（src→client.js/embed.js） |
| `test/` | 契约测试 | 保护 Embed Protocol 不被意外破坏 |
| `docs/UPGRADE-HISTORY.md` | 每版新增功能、修复和升级操作 | 新版本追加记录，不覆盖历史，不将未发布或未验证事项写成已完成 |

## 版本更新与升级记录

每次版本更新必须同时完成以下事项：

1. 统一 `package.json`、`package-lock.json` 根记录与 `ui/package.json` 的版本号。
2. 在 [升级记录](docs/UPGRADE-HISTORY.md) 顶部追加版本、日期、状态、新增功能、改进/修复、数据或 adapter 升级注意事项和实际验证范围；没有新增功能也要明确说明。
3. 同步 `CHANGELOG.md`、中英文 README 的当前版本与安装命令，以及受影响的接入文档。历史行为保留在旧版条目，当前行为在新版说明。
4. 运行 `npm run build` 和 `npm test`。`npm run check` 会校验各清单版本及当前版本的两份记录是否存在；新增文档不得仅在本地留作未跟踪文件。
5. 用 `npm pack` 生成最终版本 tarball，在临时目录安装，检查导出、21 个内置方法和浏览器/Node 产物。操作验收清单见 [DSH-QA](docs/DSH-QA.md)。
6. 本地提交、推送、Git 标签、npm 发布是独立步骤。只完成本地提交时保留“待发布”状态；实际发布后再更新升级记录状态，不能用文档代替发布结果。

## 私有方法与隐私

- 不要把个人 Prompt、Obsidian 笔记或真实会话内容加入 `methods/`；公开方法必须可安全发布。
- 私有方法通过浏览器 localStorage 导入，不进入仓库、构建产物或测试夹具。
- 本地使用计数和反馈不得上传、不得接入第三方 SDK。

## 提交规范

- 提交前确保 `npm run build` 和 `npm test` 全绿
- Commit message 前缀：`feat:`（新功能）/ `fix:`（修复）/ `docs:`（文档）/ `refactor:`（重构）/ `chore:`（杂项）
- 如果修改了 Embed Protocol 契约面（`PromptKit` 命名空间导出符号），在 commit message 中标注 `BREAKING CHANGE`
- 构建产物（`ui/client.js`、`ui/client-lite.js`、`ui/embed.js`、`methods/builtin.json`）必须随源码一起提交，保证 Git 安装无需构建即可使用

## Issue 与 PR

- Bug 报告请使用 Bug report 模板，附上 DSH 版本和复现步骤
- Feature request 请说明使用场景和期望行为
- PR 请基于 `main` 分支创建，描述清楚改了什么、为什么改

## License

贡献的代码遵循 MIT 许可证，与项目一致。
