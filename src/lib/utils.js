import { parseEnhanceOutput, DIAGNOSIS_DIMENSIONS } from './enhance-output.js'

// 纯函数工具（从 Memory Center 抽取，通用、不含宿主私有逻辑）。
// 组件只消费宿主无关的数据结构：messages = [{ id, role: 'user'|'assistant', text }]。
// 把宿主自有会话结构（如 DSH snapshot nodes）转成 messages 是宿主 adapter 的职责，不在本包内。

    const safeText = value => typeof value === 'string' ? value.slice(0, 240) : ''

    const list = value => Array.isArray(value) ? value : []

    const obj = value => value && typeof value === 'object' ? value : {}

    const cleanSummary = value => safeText(value)
      .replace(/```[\s\S]*?```/g, '代码片段已省略')
      .replace(/#{1,6}\s*/g, '')
      .replace(/\*{1,3}/g, '')
      .replace(/`/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 190)

    const cleanContext = value => String(value ?? '')
      .slice(0, 6000)
      .replace(/```[\s\S]*?```/g, '代码片段已省略')
      .replace(/#{1,6}\s*/g, '')
      .replace(/\*{1,3}/g, '')
      .replace(/`/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 1200)

    // 通用文本清洗：宿主 adapter 把自有会话文本转成 messages 时可复用。
    const cleanConversationText = value => String(value || '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/(?:sk-[A-Za-z0-9_-]{12,}|Bearer\s+[A-Za-z0-9._-]{12,})/g, '[已省略敏感片段]')
      .replace(/\s+/g, ' ')
      .trim()

    // 与 dsh-at-file 的草稿解析一致：只识别未被其粘贴保护标记包裹的 @ 引用。
    function fileMentions(draft) {
      const seen = new Set()
      const mentions = []
      for (const match of String(draft || '').matchAll(/@([^\s@]+)/g)) {
        const raw = match[1]
        if (raw.includes('\u2060')) continue
        const path = raw.endsWith('/') ? raw.slice(0, -1) : raw
        if (!path || seen.has(path)) continue
        seen.add(path)
        mentions.push(path)
      }
      return mentions
    }

    // 从已选消息数组生成表单草稿（问题/事实/约束/方案/未决）。
    function selectedConversationDraft(messages) {
      const items = list(messages)
      const users = items.filter(item => item.role === 'user').map(item => item.text).filter(Boolean)
      const assistants = items.filter(item => item.role === 'assistant').map(item => item.text).filter(Boolean)
      const answer = assistants.join('\n').slice(0, 1500)
      const sentences = answer.split(/(?<=[。！？.!?])\s+/).filter(Boolean)
      const pick = matcher => sentences.filter(text => matcher.test(text)).slice(0, 5).join('\n').slice(0, 700)
      return {
        question: users.at(-1) || '',
        facts: pick(/已确认|事实|发现|修改完成|验证通过|测试通过|当前|存在/) || answer.slice(0, 700),
        constraints: pick(/必须|不能|约束|限制|兼容|风险|时间|成本/),
        options: pick(/方案|选项|路径|建议|A[、. ]|B[、. ]/),
        unresolved: pick(/待确认|需要确认|未知|未决|还需|下一步|TBD/),
        source_count: users.length + assistants.length,
      }
    }

    // 模板变量：Vault 条目里的 {{name}} 占位符。返回去重后的变量名列表（保留首次出现顺序）。
    function templateVariables(body) {
      const seen = new Set()
      const names = []
      for (const match of String(body || '').matchAll(/\{\{\s*([A-Za-z_][\w-]*)\s*\}\}/g)) {
        if (seen.has(match[1])) continue
        seen.add(match[1])
        names.push(match[1])
      }
      return names
    }

    // 用 values 填充 {{name}}；未提供值的变量保留原样（用户可发送前手填）。
    // values 是 { name: value } 映射；未知变量一律不动，避免误伤普通花括号文本。
    function fillTemplateVariables(body, values = {}) {
      return String(body || '').replace(/\{\{\s*([A-Za-z_][\w-]*)\s*\}\}/g, (raw, name) => {
        const value = values[name]
        return value == null || String(value).trim() === '' ? raw : String(value)
      })
    }

    // 草稿里的 skill 引用记号：行首或空白后的 /tdd、/code-review 这类斜杠命令。
    // 排除 /pk（本插件自己的命名空间）和纯路径（含 . 或以字母数字段连接的文件名特征）。
    function skillMentions(draft) {
      const seen = new Set()
      const skills = []
      for (const match of String(draft || '').matchAll(/(?:^|\s)(\/[A-Za-z][\w-]{0,30})(?=\s|$)/g)) {
        const name = match[1]
        if (name.toLowerCase() === '/pk' || seen.has(name)) continue
        seen.add(name)
        skills.push(name)
      }
      return skills
    }

    // 改写后 skill 引用丢失检查：before 里有、after 里没有的引用，原样补到末尾。
    // 返回 null 表示无需修复（所有引用都保留了），调用方可据此跳过。
    function restoreLostSkillMentions(before, after) {
      const lost = skillMentions(before).filter(name => !skillMentions(after).includes(name))
      if (!lost.length) return null
      return `${String(after || '').trimEnd()}\n\n## 技能引用\n\n${lost.join('、')}（改写时请保留这些技能调用记号）`
    }

    // 语义增强输出的轻量分段：模型可能已经输出 Markdown 结构；这里只把无结构的
    // 连续文本按空行切段，供流式面板逐段上屏。有 Markdown 标题/列表的段落原样保留。
    function splitOutputSegments(text) {
      return String(text || '')
        .split(/\n{2,}/)
        .map(part => part.trim())
        .filter(Boolean)
    }

    // 自动增强的发送拦截判定：只在「普通 Enter、无修饰键、草稿非空、开关开启」时拦截。
    // Shift+Enter（换行）、⌘/Ctrl+Enter、IME 组合输入中的 Enter 一律放行，绝不吞发送。
    function shouldInterceptSend({ event, draft, enabled }) {
      if (!enabled) return false
      if (!event || event.key !== 'Enter' || event.shiftKey || event.metaKey || event.ctrlKey || event.altKey) return false
      if (event.isComposing || event.keyCode === 229) return false
      return Boolean(String(draft || '').trim())
    }

    function methodChoice(methods, title) { return methods.find(item => item.title === title) }

    function detectLanguage(text) {
      const source = String(text || '')
      const letters = source.match(/[A-Za-z]/g)?.length ?? 0
      const cjk = source.match(/[\u4e00-\u9fff]/g)?.length ?? 0
      const total = letters + cjk
      if (total === 0) return 'zh'
      const ratio = letters / total
      if (ratio > 0.7) return 'en'
      if (ratio > 0.3) return 'mixed'
      return 'zh'
    }

    // 轻量增强模板的语义展示名：内置模板是单轮整形，与多轮方法名实不符，
    // 展示用语义名（链路审查/排障收敛/开发收敛/决策权衡），内部仍按方法名联动推荐。
    const TEMPLATE_LABELS = {
      '第一性原理': '链路审查',
      '苏格拉底式提问': '排障收敛',
      '用最小实验替代空想': '开发收敛',
      '双向钢人论证': '决策权衡',
    }
    function buildSignatures(methods) {
      const signatures = {}
      for (const method of list(methods)) {
        const keywords = method?.triggerKeywords || method?.keywords
        if (method?.title && keywords?.length) signatures[method.title] = {
          triggers: keywords,
          strong: new Set(method?.strongTriggerKeywords || []),
        }
      }
      return signatures
    }

    function lightTemplate(method, source, suffix) {
      const label = TEMPLATE_LABELS[method] || method
      if (method === '第一性原理') return { label, reason: '需要拆开链路、依赖、假设与验证点，避免只罗列现象。', prompt: `请基于草稿中提供的信息，对“${source}”做一次系统性审查。\n\n请按链路环节逐一拆解：目标、输入输出、依赖、关键假设和验证点；再输出已确认部分、按高/中/低分级的问题与风险，以及每项的最小验证动作和下一步。\n\n仅基于草稿已有信息判断；信息不足时标记“待确认”，不要补造事实。${suffix}` }
      if (method === '苏格拉底式提问') return { label, reason: '排障信息通常不完整，应先收敛关键假设，再做最小验证。', prompt: `请排查这个问题：${source}\n\n先给出最可能的原因排序；对每个原因说明已有证据、最小验证步骤和修复建议。若关键信息不足，只询问最能缩小范围的一个问题；不要假设未提供的环境、配置或日志。${suffix}` }
      if (method === '用最小实验替代空想') return { label, reason: '开发任务优先收敛范围与验收，避免在未验证前扩大改动。', prompt: `请完成这个开发任务：${source}\n\n先明确最小改动范围、兼容边界和验收标准；优先用最小验证确认关键假设，再实施。完成后说明改动、验证结果、已知风险和下一步。不要进行超出任务范围的重构。${suffix}` }
      if (method === '双向钢人论证') return { label, reason: '存在方案取舍时，需要完整呈现支持与反对理由再做判断。', prompt: `请分析这项决策：${source}\n\n分别完整说明主要方案的支持理由、反对理由、适用条件和风险；再给出推荐方案、成立前提与最小验证动作。不要把不确定信息当作事实。${suffix}` }
      return { label, reason: '任务意图已较清楚，不强行套用方法，只做最小化表达整理。', prompt: `请直接处理这项任务：${source}\n\n先给出结论或可执行方案；再说明关键依据、资源/时间/数据可得性等现实限制与下一步。若信息不足，只提出最关键的澄清问题，不要编造事实。${suffix}` }
    }

    function classify(source, guidance, signatures, promptSource = source, singleTriggerTitles = new Set()) {
      const suffix = guidance ? `\n\n额外要求：${guidance}` : ''
      const hits = []
      for (const [title, signature] of Object.entries(signatures)) {
        // 统一计分制（P1-2，2026-08）：内置方法与场景卡方法使用同一套强/弱信号规则，
        // 不再"内置计分、扩展一命中即判"双轨。强命中 ≥1 或弱命中 ≥2 判定为候选；
        // 同一方法的候选命中按强→弱排序交由上层按命中顺序取主方法。
        const strong = signature.strong ? signature.triggers.filter(token => signature.strong.has(token) && source.includes(token)) : []
        const weak = signature.triggers.filter(token => !signature.strong?.has(token) && source.includes(token))
        if (strong.length >= 1 || weak.length >= 2 || (singleTriggerTitles.has(title) && weak.length >= 1)) hits.push({ title, signals: [...strong, ...weak], strongCount: strong.length })
      }
      // 多个候选时：唯一强命中者优先；否则按命中信号总数降序，作为主方法候选顺序。
      hits.sort((a, b) => {
        const sa = a.strongCount > 0 ? 1 : 0
        const sb = b.strongCount > 0 ? 1 : 0
        if (sa !== sb) return sb - sa
        return b.signals.length - a.signals.length
      })
      const first = hits[0]
      if (!first) return { method: '', label: '', signals: [], conflicts: [], ...lightTemplate('', promptSource, suffix) }
      const conflicts = hits.slice(1).map(item => ({ title: item.title, label: TEMPLATE_LABELS[item.title] || item.title, signals: item.signals }))
      return { method: first.title, label: TEMPLATE_LABELS[first.title] || first.title, signals: hits.flatMap(item => item.signals), conflicts, ...lightTemplate(first.title, promptSource, suffix) }
    }

    function planPromptEnhancement(draft, extra = '', methods = [], context = '') {
      const source = String(draft || '').trim()
      const guidance = String(extra || '').trim()
      const signals = [source, String(context || '').trim()].filter(Boolean).join('\n')
      const privateTitles = new Set(list(methods).filter(method => method?.source === 'private').map(method => method.title))
      const lang = detectLanguage(source)
      if (source && source.length < 8) return { lang, method: '', label: '', signals: [], conflicts: [], tooShort: true, reason: '输入过短，直接使用原文，不做增强。', prompt: source }
      const classified = classify(signals, guidance, buildSignatures(methods), source, privateTitles)
      if (lang === 'en') return { lang, ...classified, reason: '检测到英文输入，采用英文整理模板；方法匹配仍按触发词执行。', prompt: `Please handle this task directly: ${source}\n\nGive the conclusion or an actionable plan first, then briefly state the key reasoning, practical constraints (resources, time, data availability), and next steps. If information is insufficient, ask only the most critical clarifying question. Do not invent facts.${guidance ? `\n\nAdditional requirement: ${guidance}` : ''}` }
      if (lang === 'mixed') return { lang, ...classified, reason: '检测到中英混合输入，保留原语言比例；方法匹配仍按触发词执行。', prompt: `Please handle this task directly: ${source}\n\nGive the conclusion or an actionable plan first, then briefly state the key reasoning, practical constraints (resources, time, data availability), and next steps. Keep the output language proportional to the input (mixed Chinese/English). If information is insufficient, ask only the most critical clarifying question. Do not invent facts.${guidance ? `\n\nAdditional requirement: ${guidance}` : ''}` }
      return { lang, ...classified }
    }

    function recommendMethods(methods, requirement) {
      const text = String(requirement || '').trim()
      if (!text) return []
      const plan = planPromptEnhancement(text, '', methods)
      if (plan.tooShort) return []
      if (plan.method) {
        const candidates = [plan.method, ...plan.conflicts.map(item => item.title)].map(title => methodChoice(methods, title)).filter(Boolean)
        return candidates.slice(0, 2)
      }
      return [methodChoice(methods, '苏格拉底式提问'), methodChoice(methods, '第一性原理')].filter(Boolean)
    }

// 宿主快照兼容层：旧宿主传 `{ nodes: [] }`，DSH 0.1.2+ 传
// `{ order: [], nodes: MapLike }`。公共 utils 不能因宿主升级而静默丢失会话。
function snapshotNodes(snapshot) {
  const rawNodes = snapshot?.nodes
  if (Array.isArray(snapshot?.order) && typeof rawNodes?.get === 'function') {
    return snapshot.order.map(key => rawNodes.get(key)).filter(Boolean)
  }
  return list(rawNodes)
}

function conversationDraft(snapshot) {
  const nodes = snapshotNodes(snapshot)
  const users = nodes.filter(node => node?.kind === 'user')
  const assistants = nodes.filter(node => node?.kind === 'assistant')
  const userText = users.map(node => list(node.content).filter(block => block?.type === 'text').map(block => block.text).join(' ')).filter(Boolean)
  const assistantText = assistants.map(node => list(node.blocks).filter(block => block?.kind === 'text').map(block => block.text).join(' ')).filter(Boolean)
  const latestUser = cleanConversationText(userText.at(-1)).slice(0, 700)
  const latestAssistant = cleanConversationText(assistantText.at(-1))
  const sentences = latestAssistant.split(/(?<=[。！？.!?])\s+/).filter(Boolean)
  const pick = matcher => sentences.filter(text => matcher.test(text)).slice(0, 4).join('\n').slice(0, 700)
  return {
    question: latestUser,
    facts: pick(/已确认|事实|发现|修改完成|验证通过|测试通过|当前|存在/),
    constraints: pick(/必须|不能|约束|限制|兼容|风险|时间|成本/),
    options: pick(/方案|选项|路径|建议|A[、. ]|B[、. ]/),
    unresolved: pick(/待确认|需要确认|未知|未决|还需|下一步/),
    source_count: userText.length + assistantText.length,
  }
}
function conversationMessages(snapshot, limit = 12) {
  const nodes = snapshotNodes(snapshot)
  const messages = []
  // The launcher only ever renders a small recent window. Scan backwards
  // and stop once it is full so a long-lived DSH session stays responsive.
  for (let index = nodes.length - 1; index >= 0 && messages.length < limit; index -= 1) {
    const node = nodes[index]
    const role = node?.kind === 'user' ? 'user' : node?.kind === 'assistant' ? 'assistant' : ''
    if (!role) continue
    const blocks = role === 'user' ? list(node.content) : list(node.blocks)
    const text = cleanConversationText(blocks.filter(block => block?.type === 'text' || block?.kind === 'text').map(block => block.text).join(' '))
    if (!text) continue
    messages.push({ id: `${role}:${node.turn ?? ''}:${node.step ?? ''}:${index}`, role, text: text.slice(0, 900), truncated: text.length > 900 })
  }
  return messages
}

export { safeText, snapshotNodes, conversationDraft, conversationMessages, list, obj, cleanSummary, cleanContext, cleanConversationText, fileMentions, templateVariables, fillTemplateVariables, skillMentions, restoreLostSkillMentions, splitOutputSegments, shouldInterceptSend, parseEnhanceOutput, DIAGNOSIS_DIMENSIONS, selectedConversationDraft, methodChoice, detectLanguage, TEMPLATE_LABELS, buildSignatures, lightTemplate, classify, planPromptEnhancement, recommendMethods }
