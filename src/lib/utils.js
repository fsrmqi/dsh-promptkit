// 纯函数工具（从 Memory Center 抽取，通用、不含宿主私有逻辑）
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

    const cleanConversationText = value => String(value || '')
      .replace(/```[\s\S]*?```/g, '')
      .replace(/(?:sk-[A-Za-z0-9_-]{12,}|Bearer\s+[A-Za-z0-9._-]{12,})/g, '[已省略敏感片段]')
      .replace(/\s+/g, ' ')
      .trim()

    function conversationDraft(snapshot) {
      const nodes = list(snapshot?.nodes)
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
      const nodes = list(snapshot?.nodes)
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

    function selectedConversationDraft(messages) {
      const users = messages.filter(item => item.role === 'user').map(item => item.text)
      const assistants = messages.filter(item => item.role === 'assistant').map(item => item.text)
      const answer = assistants.join('\n').slice(0, 1500)
      const sentences = answer.split(/(?<=[。！？.!?])\s+/).filter(Boolean)
      const pick = matcher => sentences.filter(text => matcher.test(text)).slice(0, 5).join('\n').slice(0, 700)
      return {
        question: users.at(-1) || '',
        facts: pick(/已确认|事实|发现|修改完成|验证通过|测试通过|当前|存在/) || answer.slice(0, 700),
        constraints: pick(/必须|不能|约束|限制|兼容|风险|时间|成本/),
        options: pick(/方案|选项|路径|建议|A[、. ]|B[、. ]/),
      }
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

    function planPromptEnhancement(draft, extra = '', methods = []) {
      const source = String(draft || '').trim()
      const guidance = String(extra || '').trim()
      const lang = detectLanguage(source)
      if (source && source.length < 8) return { lang, method: '', label: '', signals: [], conflicts: [], tooShort: true, reason: '输入过短，直接使用原文，不做增强。', prompt: source }
      if (lang === 'en') return { lang, method: '', label: '', signals: [], conflicts: [], reason: '检测到英文输入，采用通用英文整理模板。', prompt: `Please handle this task directly: ${source}\n\nGive the conclusion or an actionable plan first, then briefly state the key reasoning, practical constraints (resources, time, data availability), and next steps. If information is insufficient, ask only the most critical clarifying question. Do not invent facts.${guidance ? `\n\nAdditional requirement: ${guidance}` : ''}` }
      if (lang === 'mixed') return { lang, method: '', label: '', signals: [], conflicts: [], reason: '检测到中英混合输入，采用双语整理模板，输出保留原语言比例。', prompt: `Please handle this task directly: ${source}\n\nGive the conclusion or an actionable plan first, then briefly state the key reasoning, practical constraints (resources, time, data availability), and next steps. Keep the output language proportional to the input (mixed Chinese/English). If information is insufficient, ask only the most critical clarifying question. Do not invent facts.${guidance ? `\n\nAdditional requirement: ${guidance}` : ''}` }
      return { lang, ...classify(source, guidance, buildSignatures(methods)) }
    }

    function recommendMethods(methods, requirement) {
      const text = String(requirement || '').trim()
      if (!text) return []
      const plan = planPromptEnhancement(text, '', methods)
      if (plan.tooShort || plan.lang === 'en') return []
      if (plan.method) {
        const candidates = [plan.method, ...plan.conflicts.map(item => item.title)].map(title => methodChoice(methods, title)).filter(Boolean)
        return candidates.slice(0, 2)
      }
      return [methodChoice(methods, '苏格拉底式提问'), methodChoice(methods, '第一性原理')].filter(Boolean)
    }

export { safeText, list, obj, cleanSummary, cleanContext, cleanConversationText, conversationDraft, conversationMessages, selectedConversationDraft, methodChoice, detectLanguage, planPromptEnhancement, recommendMethods }
