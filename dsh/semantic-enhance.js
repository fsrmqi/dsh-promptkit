export const SEMANTIC_ENHANCE_PATH = '/dsh-promptkit/semantic-enhance'
export const SEMANTIC_ENHANCE_STREAM_PATH = '/dsh-promptkit/semantic-enhance/stream'

// 增强强度档位只控制表达细节，不得扩大任务范围或凭空增加交付阶段。
//   low  ≈ 原文 1 倍：只做措辞与结构润色
//   mid  ≈ 原文 1.5 倍：补足必要的执行边界
//   high ≈ 原文 3 倍上限：可补充细节，但仍保留原任务的粒度与语气
const STRENGTH_BUDGET = { low: 1.0, mid: 1.5, high: 3.0 }

function normalizeStrength(strength) {
  return STRENGTH_BUDGET[strength] ? strength : 'mid'
}

function strengthRule(lang, strength) {
  const budget = STRENGTH_BUDGET[normalizeStrength(strength)]
  if (lang === 'en') {
    return `- Length budget: up to about ${budget}x the draft. ${strength === 'low' ? 'Polish wording and structure only; do not expand content.' : strength === 'high' ? 'Add detail only when it directly helps execute the original request; never add workstreams, acceptance criteria, or delivery phases the user did not ask for.' : 'Clarify only the necessary execution boundaries; keep it compact.'}`
  }
  return `- 篇幅最多约为草稿的 ${budget} 倍。${strength === 'low' ? '只做措辞与结构润色，不展开内容。' : strength === 'high' ? '只补充直接有助于执行原请求的细节；不得新增用户未要求的工作流、验收标准或交付阶段。' : '只澄清必要的执行边界，保持紧凑。'}`
}

// 双策略：无会话上下文时按结构模板规范化；有上下文时先提炼真实意图、
// 保留草稿原始表达框架顺势润色，不套模板、不重复追问上下文已给出的信息。
function strategyRule(lang, hasContext) {
  if (!hasContext) return ''
  return lang === 'en'
    ? `- Strategy (context-aware): read the conversation context first, distill the user's real intent, then polish the draft along its original expression. Do NOT force a template; do NOT re-ask for information the context already provides.`
    : `- 策略（有上下文）：先通读会话上下文提炼真实意图，再顺着草稿原有表达润色；不要套结构模板，也不要重复追问上下文已经给出的信息。`
}

function instructionFor(lang, { strength, hasContext } = {}) {
  const strengthLine = strengthRule(lang, strength)
  const strategyLine = strategyRule(lang, hasContext)
  if (lang === 'en') return `You are a prompt rewriter. Rewrite the user's draft into a clear, executable prompt without inventing information.

Base the rewrite only on information present in the draft${hasContext ? ' and the conversation context' : ''}; never fabricate facts. Note: the rewritten prompt MAY instruct its executor to verify facts on its own (read code, consult docs, run commands) — that is not fabrication; verification instructions are part of the prompt.

# Output shape
Use the draft's natural form whenever possible. Add headings or bullets only when they make the request clearer; do not manufacture a full template, project plan, audit checklist, or staged deliverable.

# Information acquisition priority (core rule)
For genuinely essential missing information, prefer a short instruction to inspect the relevant source of truth. Do not prescribe commands, inventories, boundaries, or reporting formats unless the draft requires them. Ask the user only for a decision that cannot be discovered by the executor; otherwise keep uncertainty concise.

# Rules
- Keep the same language as the draft; never switch languages;
- Preserve the task type, scope, autonomy, and conversational tone of the draft. Do not turn a simple request into a project plan, audit, investigation, or multi-stage SOP;
- If the draft is already clear, make only minimal edits; returning a lightly polished version is valid;
- Keep numbers, proper nouns, file paths, code snippets, and skill mentions (slash tokens like /tdd) verbatim;
- If the draft is already a prompt (has an imperative tone), reformat only; do not change its meaning;
${strengthLine}
${strategyLine}
- Output only the rewritten prompt: no explanation, no title, no Markdown fence.

# Example
User draft: Optimize the login flow, users keep forgetting their passwords.
Rewritten prompt:
Please improve the login experience for users who forget their passwords. First review the current password-recovery flow and its existing constraints, then make the smallest useful improvements. Briefly summarize what changed and any open decisions.`
  return `你是提示词改写助手。把用户草稿改写为结构化、可直接执行的提示词。

改写时只依据草稿里已有的信息${hasContext ? '和会话上下文' : ''}，不得虚构、推断或补全用户没给的事实。注意：改写产物可以指示执行者自行查证事实（读代码、查文档、跑命令），这不是编造——查证指令本身就是提示词的一部分。

# 输出形式
尽量沿用草稿自然的表达。只有确实能提升清晰度时才加标题或列表；不得为了套模板而生成完整结构、项目计划、审计清单或分阶段交付。

# 信息获取优先级（核心规则）
只有缺失信息确实影响执行时，才简短指示执行者查看相关事实来源。不要擅自规定命令、盘点范围、时间边界或汇报格式，除非草稿本身需要。只有执行者无法自行获知的决策才向用户索取；其余不确定性保持简洁。

# 硬规则
- 输出语言必须与草稿一致，禁止切换语言；
- 保留草稿的任务类型、范围、自主程度与对话语气；不得把一句普通请求改成项目计划、审计、调查或多阶段 SOP；
- 草稿已经清楚时只做最小编辑；轻度润色后接近原文是有效结果；
- 关键数字、日期、专有名词、文件路径、代码片段、技能引用记号（/tdd 这类斜杠记号）原样保留；
- 若草稿本身已经是一条提示词（带指令口吻），只整理格式，不许改动语义；
${strengthLine}
${strategyLine}
- 只输出改写后的提示词正文，不要解释、标题或 Markdown 围栏。

# 示例
用户草稿：帮我优化登录，用户总忘记密码。
改写为：
请改善用户忘记密码时的登录体验。先查看现有找回密码流程及其限制，再做最小且有价值的改进；完成后简要说明改了什么，以及仍需决定的事项。`
}

// 诊断维度（哲学启发式，2026-08）：五个维度各有明确的思想根源，但提示词里
// 不出现哲学家名字——哲学只作为内部设计依据，模型看到的是具体检测指令，
// 用户看到的标签保持朴素（见 DIAGNOSIS_LABELS）。这避免「哲学腔」空泛输出。
//
//   concept_clarity  概念澄清（苏格拉底式审问）：哪些关键词未定义、一词多义？
//                    「优化」是优化速度还是体验？未定义的概念让指令无法一致执行。
//   hidden_premise   隐含前提（第一性原理）：草稿默认了哪些未言明的假设？
//                    （默认了用户量、默认了技术栈、默认了数据可得性……）
//   falsifiability   可证伪性（Popper）：哪些要求无法被观察或测试判定？
//                    不可证伪的要求（「做好一点」）等于没有要求。
//   actionability    可行动性（实用主义准则）：执行这份提示词会产出什么
//                    可观察的不同结果？答不上来说明它还不构成有效指令。
//   context_fit      语境契合（诠释学）：这份草稿是否在重复上下文已给的信息？
//                    是否与已确认的事实冲突？
//
// 诊断与改写联动：诊断不只「打分」，其发现直接驱动改写动作——
// 未定义概念→改写中显式定义或二选一；隐含前提→标【待确认】或显式写出；
// 不可证伪要求→改写为可观察的验收表述。
// 维度键序与解析协议（[DIAG] + ===PROMPT===）统一由 src/lib/utils.js 提供，
// host 指令与客户端解析共用同一份定义，避免两端漂移。
import { DIAGNOSIS_LABELS, parseEnhanceOutput } from '../src/lib/enhance-output.js'

// 诊断标签：客户端渲染顺序以此为准（host/client 各持一份，协议键保持一致）。
export { DIAGNOSIS_LABELS }

// 方法感知诊断量表：用什么思想框架改写，就用同一框架体检。
// 键为内置方法标题（21 个方法库的旗舰子集）；未命中的方法回退通用侧重。
// 每条 rubric 是注入诊断指令的额外检查侧重（一行、可执行、不带哲学人名）。
const METHOD_DIAGNOSIS_RUBRICS = {
  '苏格拉底式提问': '侧重：找出草稿里未加审视便接受的说法，逐个追问「为什么成立」；未定义术语优先标记。',
  '第一性原理': '侧重：把草稿中的复合概念拆到不可再拆的事实与假设；标记一切「大家都说」式依据。',
  '双向钢人论证': '侧重：检查草稿是否只呈现单边理由；改写前先为对立立场构建最强版本。',
  '用最小实验替代空想': '侧重：检查每项计划是否附带可观察的验证动作；无法设计实验的诉求标记为待澄清。',
  '事实核查': '侧重：区分草稿中的已证实事实与推断；把「应该/可能/听说」开头的句子单独归类。',
  '假设检验': '侧重：把草稿中的预期改写为可被数据支持或推翻的命题；标记缺失的基线与度量。',
}

function diagnosisRubric(methodTitle, lang) {
  const rubric = methodTitle ? METHOD_DIAGNOSIS_RUBRICS[methodTitle] : ''
  if (!rubric) return ''
  return lang === 'en' ? `Method-specific focus: ${rubric}` : `方法侧重：${rubric}`
}

function diagnosisInstruction(lang, methodTitle) {
  const rubric = diagnosisRubric(methodTitle, lang)
  const rubricLine = rubric ? `\n${rubric}` : ''
  if (lang === 'en') return `Before rewriting, examine the draft with five questions. Output the diagnosis block first, then the rewritten prompt. Diagnosis format (exactly one line per dimension, no extra text):
[DIAG] concept_clarity: <which key terms are undefined or ambiguous; one short sentence>
[DIAG] hidden_premise: <which unstated assumptions the draft silently relies on; one short sentence>
[DIAG] falsifiability: <which requirements cannot be judged by observation or test; one short sentence>
[DIAG] actionability: <what observable outcome executing this prompt would produce, or why none; one short sentence>
[DIAG] context_fit: <does the draft repeat or contradict what the context already establishes; one short sentence>
For hidden_premise and falsifiability, prefix the sentence with [GAP] only when an actual issue exists; otherwise use [OK]. Never invent a gap to fill a dimension.
Then a single line "===PROMPT===" and the rewritten prompt.
Treat the diagnosis as optional review notes, not requirements to expand the task. Only reflect a finding in the rewrite when it blocks execution of the user's original request; keep it to one concise clarification. Never add acceptance criteria, investigations, reporting phases, or a user-question list merely to address a diagnosis.${rubricLine}`
    return `改写前先用五个问题审视草稿。先输出诊断块，再输出改写结果。诊断格式（每个维度恰好一行，不要多余文字）：
[DIAG] concept_clarity: <哪些关键词未定义或一词多义；一句话>
[DIAG] hidden_premise: <草稿默认了哪些未言明的假设；一句话>
[DIAG] falsifiability: <哪些要求无法被观察或测试判定；一句话>
[DIAG] actionability: <执行这份提示词会产出什么可观察的结果，或为什么没有；一句话>
[DIAG] context_fit: <草稿是否重复或矛盾于上下文已确立的信息；一句话>
hidden_premise 与 falsifiability 的描述必须以 [GAP]（确有缺口）或 [OK]（检查通过）开头；没有问题时不要为了凑维度编造缺口。
然后单独一行 ===PROMPT===，其后是改写后的提示词正文。
诊断是可选的审阅备注，不是扩张任务的理由。只有某项发现确实阻塞原任务执行时，才在改写中用一句简短澄清处理；不得为了回应诊断而新增验收标准、调查、汇报阶段或向用户索取信息清单。${rubricLine}`
}

// parseEnhanceOutput 统一从 src/lib/utils.js 导入（host/client 共用一份协议解析）。

function requestText({ draft, extra, method, lang }) {
  const guide = method?.title && method?.template
    ? `方法指导（仅作结构参考，按此结构组织输出）：\n${String(method.title)}\n${String(method.template).slice(0, 2000)}`
    : ''
  return [draft, extra ? `用户额外要求：${extra}` : '', guide, `（输入语言：${lang || 'zh'}）`].filter(Boolean).join('\n\n')
}

// 统一的流式调用：逐段回调 onDelta（诊断行 + 提示词正文都会经过这里），
// 最终 resolve { diagnosis, prompt, model }。enhanceWithCurrentSessionModel 退化为它的非流式包装。
// onEvent 回调（可选）汇报过程节点：start / first-token / diagnosis / prompt / finish，
// 供路由层打印日志或推送阶段帧；不传时零开销。
export async function streamEnhanceWithCurrentSessionModel({ llm, route, sessionId, draft, extra, lang, method, strength, hasContext = false, diagnose = false, signal, onDelta, onEvent }) {
  if (!route?.provider || !route?.model) throw new Error('当前会话尚未建立模型路由，请先正常发送一次消息。')
  const source = String(draft || '').trim()
  if (!source) throw new Error('消息框为空，无法进行语义增强。')
  const emit = (type, payload) => { try { onEvent?.(type, payload) } catch {} }
  const normalizedStrength = normalizeStrength(strength)
  const text = requestText({ draft: source, extra: String(extra || ''), method, lang })
  // 方法感知诊断：匹配到旗舰方法时，诊断按该方法的检查侧重执行。
  const system = [instructionFor(lang, { strength: normalizedStrength, hasContext }), diagnose ? diagnosisInstruction(lang, method?.title) : ''].filter(Boolean).join('\n\n')
  let output = ''
  let finished = false
  let promptPhase = false
  const startedAt = Date.now()
  let firstTokenAt = 0
  emit('start', { model: route.model, draftChars: source.length })
  for await (const chunk of llm.stream({
    provider: route.provider,
    model: route.model,
    system,
    messages: [{ role: 'user', content: [{ type: 'text', text }], source: { kind: 'plugin', plugin: 'dsh-promptkit' } }],
    // maxTokens 覆盖「思考 + 正文」：思考型模型（如 deepseek-v4 系）的推理会消耗同一预算，
    // 上限给足以免思考吃光额度后正文为空（真机实测 1200 token 全被思考吃掉）。
    maxTokens: Math.max(4000, Math.min(Math.round(source.length * STRENGTH_BUDGET[normalizedStrength] * 2 + 2000), 8000)),
    sessionId,
    purpose: 'dsh-promptkit-semantic-enhance',
    // 注意：不要硬编码 reasoningEffort —— 部分模型/网关未声明支持 "off" 时会直接
    // 拒绝请求（UNSUPPORTED_REASONING_EFFORT）；思考开销由上面的 maxTokens 预算兜底。
    ...(signal ? { signal } : {}),
  })) {
    signal?.throwIfAborted()
    if (chunk.type === 'finish') {
      const kind = chunk.reason?.kind
      if (kind === 'aborted') throw Object.assign(new Error('模型调用已取消，草稿未改动。'), { name: 'AbortError' })
      if (kind === 'error') throw new Error('模型调用失败，草稿未改动。', { cause: chunk.reason.failure })
      if (kind === 'max-tokens') throw new Error('模型输出达到长度上限，结果不完整；请缩短草稿后重试。')
      if (kind !== 'stop') throw new Error('模型未正常完成文本输出，草稿未改动。')
      finished = true
      break
    }
    if (chunk.type === 'text-delta') {
      if (!firstTokenAt) {
        firstTokenAt = Date.now()
        emit('first-token', { latencyMs: firstTokenAt - startedAt })
      }
      output += chunk.text
      onDelta?.(chunk.text)
      // 诊断阶段切换：===PROMPT=== 分隔符出现前都是诊断输出，出现后进入正文改写。
      if (!promptPhase && output.includes('===PROMPT===')) {
        promptPhase = true
        emit('prompt-start', {})
      }
    }
    if (chunk.type === 'block-end' && chunk.block?.type === 'text' && !output) {
      output = chunk.block.text
      onDelta?.(chunk.block.text)
    }
  }
  signal?.throwIfAborted()
  if (!finished) throw new Error('模型流缺少结束标记，结果不完整；草稿未改动。')
  if (!output.trim()) {
    throw new Error('语义增强模型未返回文本（模型可能只输出了思考内容）；请重试或改用非思考型模型。')
  }
  const parsed = parseEnhanceOutput(output)
  if (!parsed.prompt) throw new Error('模型仅返回了诊断，未返回改写正文；草稿未改动，请重试。')
  emit('finish', { totalMs: Date.now() - startedAt, firstTokenMs: firstTokenAt ? firstTokenAt - startedAt : 0, promptChars: parsed.prompt.length, diagnosisKeys: parsed.diagnosis ? Object.keys(parsed.diagnosis).length : 0 })
  return { ...parsed, model: route.model }
}

// 非流式入口：保留原函数名与返回形状（现有测试与调用方依赖），diagnosis 字段为新增可选值。
export async function enhanceWithCurrentSessionModel(options) {
  const result = await streamEnhanceWithCurrentSessionModel(options)
  return { prompt: result.prompt, model: result.model, ...(result.diagnosis ? { diagnosis: result.diagnosis } : {}) }
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
  if (res.destroyed || res.writableEnded) return
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
  res.end(JSON.stringify(body))
}

// SSE 帧序列：event: delta（正文增量）→ event: done（最终 JSON）或 event: error。
// 客户端逐段上屏；诊断行原样流过，由客户端 parseEnhanceOutput 拆分展示。
function sseReply(res, status, headers = {}) {
  res.writeHead(status, {
    'content-type': 'text/event-stream; charset=utf-8',
    'cache-control': 'no-store',
    connection: 'keep-alive',
    'x-accel-buffering': 'no',
    ...headers,
  })
}
function sseSend(res, event, data) {
  if (res.destroyed || res.writableEnded) return
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
}

function parseSession(req) {
  const url = new URL(req.url || SEMANTIC_ENHANCE_PATH, 'http://localhost')
  return String(url.searchParams.get('session_id') || '')
}

// 共享请求守卫：方法校验、会话标识、90 秒超时与客户端断开联动。
function withRequestGuards(req, res, handler) {
  if (req.method !== 'POST') { res.writeHead(405, { allow: 'POST' }); res.end(); return Promise.resolve() }
  const sessionId = parseSession(req)
  if (!sessionId) { reply(res, 400, { error: 'session_id_required' }); return Promise.resolve() }
  const controller = new AbortController()
  // 90s：思考型模型（deepseek-v4 系）推理可占 30s+，30s 会把正常请求掐死在思考阶段。
  const timeout = setTimeout(() => controller.abort(), 90_000)
  // 客户端断开检测必须挂在 res 上：Node ≥26 在 POST body 读完即触发 req 'close'，
  // 挂 req 会把每个正常请求都立刻 abort，进而被 catch 误报为「模型响应超时」。
  // res 'close' 在连接提前断开（客户端取消）时才会触发。
  const abort = () => controller.abort()
  // 无事件能力的嵌入式 response 只启用超时。
  let offAbort = () => {}
  if (typeof res.on === 'function' && typeof res.off === 'function') {
    res.on('close', abort)
    offAbort = () => res.off('close', abort)
  }
  return handler(sessionId, controller).finally(() => {
    clearTimeout(timeout)
    offAbort()
  })
}

// 诊断标签的展示顺序固定，客户端渲染与模型输出顺序解耦（定义见文件顶部 DIAGNOSIS_LABELS）。

// 过程日志：增强默认复用会话模型（可能是思考型），首字 30s+ 属正常；
// 打点 start/first-token/阶段切换/finish，让「慢」可归因（排队？思考？输出量？）。
// logger 为 cordis 命名 logger（ctx.logger('dsh-promptkit')），未注入时退回 console。
function makeEnhanceLogger(sessionId, logger) {
  const write = message => {
    try { logger?.info(`enhance session=${sessionId} ${message}`) } catch { console.log(`[dsh-promptkit] enhance session=${sessionId} ${message}`) }
  }
  return {
    startedAt: Date.now(),
    log(type, payload = {}) {
      if (type === 'start') write(`start model=${payload.model} draftChars=${payload.draftChars}`)
      else if (type === 'first-token') write(`first-token latency=${payload.latencyMs}ms（含排队与思考；思考型模型此值常 >10s）`)
      else if (type === 'prompt-start') write(`prompt-start（诊断结束，开始输出改写正文）elapsed=${Date.now() - this.startedAt}ms`)
      else if (type === 'finish') write(`finish total=${payload.totalMs}ms firstToken=${payload.firstTokenMs}ms promptChars=${payload.promptChars} diagnosis=${payload.diagnosisKeys}/5`)
    },
    fail(message) { write(`error ${message} elapsed=${Date.now() - this.startedAt}ms`) },
  }
}

export function semanticEnhanceRoute({ llm, routes, logger }) {
  return {
    kind: 'exact',
    path: SEMANTIC_ENHANCE_PATH,
    async handler(req, res) {
      await withRequestGuards(req, res, async (sessionId, controller) => {
        const events = makeEnhanceLogger(sessionId, logger)
        try {
          const body = await readJson(req)
          // diagnose !== false：诊断默认开启（非流式也返回 diagnosis），旧客户端忽略该字段不受影响。
          const result = await streamEnhanceWithCurrentSessionModel({
            llm,
            route: routes.get(sessionId),
            sessionId,
            draft: body.draft,
            extra: body.extra,
            lang: body.lang,
            method: body.method,
            strength: body.strength,
            hasContext: Boolean(body.hasContext),
            diagnose: body.diagnose !== false,
            signal: controller.signal,
            onEvent: (type, payload) => events.log(type, payload),
          })
          reply(res, 200, result)
        } catch (error) {
          const timeoutMessage = controller.signal.aborted ? '模型响应超时，请稍后重试。' : String(error?.message || error)
          events.fail(timeoutMessage)
          reply(res, controller.signal.aborted ? 504 : 503, { error: 'semantic_enhance_failed', next_action: timeoutMessage })
        }
      })
    },
  }
}

// 流式路由：SSE 逐段推送，阶段帧（open/diagnosing/writing）由服务端显式下发，
// 前端据此精确切换阶段文案，不再靠首包猜测。
export function semanticEnhanceStreamRoute({ llm, routes, logger }) {
  return {
    kind: 'exact',
    path: SEMANTIC_ENHANCE_STREAM_PATH,
    async handler(req, res) {
      await withRequestGuards(req, res, async (sessionId, controller) => {
        const events = makeEnhanceLogger(sessionId, logger)
        try {
          const body = await readJson(req)
          sseReply(res, 200)
          // 连接建立即发一帧 open：前端据此把阶段从「等待模型响应」切到「输出中」。
          sseSend(res, 'open', { ok: true })
          const result = await streamEnhanceWithCurrentSessionModel({
            llm,
            route: routes.get(sessionId),
            sessionId,
            draft: body.draft,
            extra: body.extra,
            lang: body.lang,
            method: body.method,
            strength: body.strength,
            hasContext: Boolean(body.hasContext),
            diagnose: body.diagnose !== false,
            signal: controller.signal,
            // 每个增量立即推一帧 delta：诊断行与正文行都原样流过，客户端统一解析。
            onDelta: delta => sseSend(res, 'delta', { text: delta }),
            // 阶段帧：诊断结束切 writing；前端据此把「五维诊断中」换成「输出改写稿」。
            onEvent: (type, payload) => {
              events.log(type, payload)
              if (type === 'start') sseSend(res, 'stage', { phase: 'diagnosing', model: payload.model })
              if (type === 'prompt-start') sseSend(res, 'stage', { phase: 'writing' })
            },
          })
          sseSend(res, 'done', result)
        } catch (error) {
          const message = controller.signal.aborted ? '模型响应超时，请稍后重试。' : String(error?.message || error)
          events.fail(message)
          // 头已发出（SSE）只能走事件通道报错；否则退回 JSON 错误响应。
          if (res.destroyed || res.writableEnded) return
          if (res.headersSent) sseSend(res, 'error', { error: 'semantic_enhance_failed', message, timeout: controller.signal.aborted })
          else reply(res, controller.signal.aborted ? 504 : 503, { error: 'semantic_enhance_failed', next_action: message })
        } finally {
          res.end()
        }
      })
    },
  }
}
