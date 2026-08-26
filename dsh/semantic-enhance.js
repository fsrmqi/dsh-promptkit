export const SEMANTIC_ENHANCE_PATH = '/dsh-promptkit/semantic-enhance'

function instructionFor(lang) {
  if (lang === 'en') return `You are a prompt rewriter. Rewrite the user's draft into a clear, executable prompt without inventing information.

Use only information present in the draft. Organize it into goal, context, constraints, acceptance criteria, and output format when applicable. Mark missing critical information as [TBD: what needs confirmation]. If the draft is already clear, return it unchanged. Output only the rewritten prompt, with no explanation, title, or Markdown fence.`
  return `你是提示词改写器。请把用户草稿改写为结构清晰、可执行的提示词，但绝不编造信息。

只使用草稿已有信息；按需组织为目标、背景、约束、验收标准和输出形式。缺少关键内容时使用【待确认：需要补充什么】标记。如果草稿已清晰完整，原样返回。只输出改写后的提示词正文，不要解释、标题或 Markdown 围栏。`
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
