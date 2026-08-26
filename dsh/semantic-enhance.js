export const SEMANTIC_ENHANCE_PATH = '/dsh-promptkit/semantic-enhance'

function instructionFor(lang) {
  if (lang === 'en') return `You are a prompt rewriter. Rewrite the user's draft into a clear, executable prompt without inventing information.

Only use information present in the draft.

# Output structure (use as needed, mark missing items with [TBD])
- Goal
- Background
- Known information
- Constraints
- Acceptance criteria
- Output requirements

# Rules
- Keep the same language as the draft; never switch languages;
- Always restructure the draft even if it looks clear; do not return it unchanged;
- Keep numbers, proper nouns, file paths, and code snippets verbatim;
- Mark missing critical information as [TBD: what needs confirmation]; do not assume for the user;
- If the draft is already a prompt (has an imperative tone), reformat only; do not change its meaning;
- Output only the rewritten prompt: no explanation, no title, no Markdown fence.

# Example
User draft: Optimize the login flow, users keep forgetting their passwords.
Rewritten prompt:
Goal: Improve the login experience for users who forget passwords.
Background: Users frequently forget passwords.
Known information: [TBD: current login and recovery flow]
Constraints: [TBD: account-system constraints]
Acceptance criteria: [TBD: measurable success criteria]
Output requirements: [TBD: expected deliverable]
[TBD: where the current forgot-password flow lives]`
  return `你是提示词改写助手。把用户草稿改写为结构化、可直接执行的提示词。

只使用草稿里已有的信息，绝不编造、推断或补全用户没给的内容。

# 输出结构（按需组织，缺失项标注【待确认：…】）
- 目标
- 背景
- 已知信息
- 约束
- 验收标准
- 输出要求

# 硬规则
- 输出语言必须与草稿一致，禁止切换语言；
- 草稿即使看起来清晰也要做结构化整理，不要原样返回；
- 关键数字、日期、专有名词、文件路径、代码片段原样保留；
- 必要信息缺失时用【待确认：需要补充什么】标出，不要替用户默认；
- 若草稿本身已经是一条提示词（带指令口吻），只整理格式，不许改动语义；
- 只输出改写后的提示词正文，不要解释、标题或 Markdown 围栏。

# 示例
用户草稿：帮我优化登录，用户总忘记密码。
改写为：
目标：改善用户忘记密码时的登录体验。
背景：用户经常忘记密码。
已知信息：【待确认：当前登录与找回密码流程】
约束：【待确认：账号体系限制】
验收标准：【待确认：可衡量的成功标准】
输出要求：【待确认：期望交付物】
【待确认：当前忘记密码的完整流程和入口在哪里】`
}

function requestText({ draft, extra, method, lang }) {
  const guide = method?.title && method?.template
    ? `方法指导（仅作结构参考，按此结构组织输出）：\n${String(method.title)}\n${String(method.template).slice(0, 2000)}`
    : ''
  return [draft, extra ? `用户额外要求：${extra}` : '', guide, `（输入语言：${lang || 'zh'}）`].filter(Boolean).join('\n\n')
}

export async function enhanceWithCurrentSessionModel({ llm, route, sessionId, draft, extra, lang, method, signal }) {
  if (!route?.provider || !route?.model) throw new Error('当前会话尚未建立模型路由，请先正常发送一次消息。')
  const source = String(draft || '').trim()
  if (!source) throw new Error('消息框为空，无法进行语义增强。')
  const text = requestText({ draft: source, extra: String(extra || ''), method, lang })
  let output = ''
  for await (const chunk of llm.stream({
    provider: route.provider,
    model: route.model,
    system: instructionFor(lang),
    messages: [{ role: 'user', content: [{ type: 'text', text }], source: { kind: 'plugin', plugin: 'dsh-promptkit' } }],
    maxTokens: Math.max(1200, Math.min(source.length * 2, 4000)),
    sessionId,
    purpose: 'dsh-promptkit-semantic-enhance',
    ...(signal ? { signal } : {}),
  })) {
    if (chunk.type === 'text-delta') output += chunk.text
    if (chunk.type === 'block-end' && chunk.block?.type === 'text' && !output) output += chunk.block.text
  }
  if (!output.trim()) throw new Error('语义增强模型未返回文本。')
  return { prompt: output.trim(), model: route.model }
}

async function readJson(req) {
  let raw = ''
  for await (const chunk of req) {
    raw += chunk
    if (raw.length > 32_768) throw new Error('请求内容过大。')
  }
  try { return JSON.parse(raw || '{}') } catch { throw new Error('请求格式无效。') }
}

function reply(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
  res.end(JSON.stringify(body))
}

export function semanticEnhanceRoute({ llm, routes }) {
  return {
    kind: 'exact',
    path: SEMANTIC_ENHANCE_PATH,
    async handler(req, res) {
      if (req.method !== 'POST') { res.writeHead(405, { allow: 'POST' }); res.end(); return }
      const url = new URL(req.url || SEMANTIC_ENHANCE_PATH, 'http://localhost')
      const sessionId = String(url.searchParams.get('session_id') || '')
      if (!sessionId) { reply(res, 400, { error: 'session_id_required' }); return }
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 30_000)
      const abort = () => controller.abort()
      req.on('close', abort)
      try {
        const body = await readJson(req)
        const result = await enhanceWithCurrentSessionModel({ llm, route: routes.get(sessionId), sessionId, draft: body.draft, extra: body.extra, lang: body.lang, method: body.method, signal: controller.signal })
        reply(res, 200, result)
      } catch (error) {
        const timeoutMessage = controller.signal.aborted ? '模型响应超时，请稍后重试。' : String(error?.message || error)
        reply(res, controller.signal.aborted ? 504 : 503, { error: 'semantic_enhance_failed', next_action: timeoutMessage })
      } finally {
        clearTimeout(timeout)
        req.off('close', abort)
      }
    },
  }
}
