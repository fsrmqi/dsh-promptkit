# 贡献指南

感谢你考虑为 dsh-promptkit 贡献代码！以下是参与方式。

## 快速上手

```bash
git clone https://github.com/fsrmqi/dsh-promptkit.git
cd dsh-promptkit
npm run build    # check + build:methods + build:ui
npm test         # embed 契约测试
```

构建产物 `ui/client.js` 和 `ui/embed.js` 已提交到 Git，clone 后可直接使用。修改 `src/` 后需重新 `npm run build`。

## 新增思考方法

1. 在 `methods/` 对应场景目录下新建 Markdown 文件，文件名即方法标题
2. frontmatter 格式（必须字段：`场景`、`用途`；可选：`标签`、`触发词`、`强触发词`）：
   ```markdown
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
   ```
3. 如果新方法需要 `mode: guided`（逐步追问而非一次性分析）或自定义 `outcome`，编辑 `scripts/build-methods.mjs` 中的 `OVERRIDES` 表
4. 运行 `npm run build` 重新生成 `builtin.json` + `client.js` + `embed.js`

## 代码结构

| 目录 | 职责 | 修改注意 |
| --- | --- | --- |
| `src/core/` | 三大接口定义 | 改接口 = 破坏 Embed Protocol 契约，需同步更新 `docs/EMBED.md` 和 `test/embed.test.js`；历史 Provider 应保留 `onHistoryChange()` 订阅语义 |
| `src/ui/` | React 组件 | 修改后必须 `npm run build:ui` 重新生成 `ui/client.js` |
| `src/adapters/` | 默认实现 | 可自由扩展，不影响协议面 |
| `methods/` | 方法库源文件 | Markdown 格式，`build:methods` 解析为 `builtin.json` |
| `scripts/` | 构建脚本 | `build-methods.mjs`（md→json）+ `build-client.mjs`（src→client.js/embed.js） |
| `test/` | 契约测试 | 保护 Embed Protocol 不被意外破坏 |

## 私有方法与隐私

- 不要把个人 Prompt、Obsidian 笔记或真实会话内容加入 `methods/`；公开方法必须可安全发布。
- 私有方法通过浏览器 localStorage 导入，不进入仓库、构建产物或测试夹具。
- 本地使用计数和反馈不得上传、不得接入第三方 SDK。

## 提交规范

- 提交前确保 `npm run build` 和 `npm test` 全绿
- Commit message 前缀：`feat:`（新功能）/ `fix:`（修复）/ `docs:`（文档）/ `refactor:`（重构）/ `chore:`（杂项）
- 如果修改了 Embed Protocol 契约面（`PromptKit` 命名空间导出符号），在 commit message 中标注 `BREAKING CHANGE`
- 构建产物（`ui/client.js`、`ui/embed.js`、`methods/builtin.json`）必须随源码一起提交，保证 Git 安装无需构建即可使用

## Issue 与 PR

- Bug 报告请使用 Bug report 模板，附上 DSH 版本和复现步骤
- Feature request 请说明使用场景和期望行为
- PR 请基于 `main` 分支创建，描述清楚改了什么、为什么改

## License

贡献的代码遵循 MIT 许可证，与项目一致。
