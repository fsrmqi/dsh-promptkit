/* eslint-disable */
/* dsh-promptkit 独立 DSH 浏览器视图 — 本文件由 scripts/build-client.mjs 生成，勿手改。 */
/* 源码：https://github.com/<you>/dsh-promptkit（MIT License） */
window.__ModuleLoader__.load({
  id: 'dsh-promptkit/ui',
  factory: require => {
    const React = require('react')

      /* ================= dsh-promptkit foundation（C / GlobalStyle / Icon / S / workbenchStyle） ================= */
      const h = React.createElement
          const C = {
            ink: 'var(--mc-ink)', muted: 'var(--mc-muted)', line: 'var(--mc-line)', canvas: 'var(--mc-canvas)', surface: 'var(--mc-surface)',
            teal: 'var(--mc-teal)', tealStrong: 'var(--mc-teal-strong)',
            tealLine: 'var(--mc-teal-line)', tealLineStrong: 'var(--mc-teal-line-strong)', tealLineActive: 'var(--mc-teal-line-active)',
            tealTint: 'var(--mc-teal-tint)', tealTintDeep: 'var(--mc-teal-tint-deep)',
            blue: 'var(--mc-blue)', amber: 'var(--mc-amber)', amberLine: 'var(--mc-amber-line)', amberTint: 'var(--mc-amber-tint)',
            red: 'var(--mc-red)', redTint: 'var(--mc-red-tint)', slate: 'var(--mc-slate)',
            divide: 'var(--mc-divide)', surfaceAlt: 'var(--mc-surface-alt)', track: 'var(--mc-track)',
          }
          const GLOBAL_CSS = `
      :root {
        --mc-ink: #17212b; --mc-muted: #607080; --mc-line: #d8e1e8; --mc-canvas: #f4f7f9; --mc-surface: #fff;
        --mc-teal: #0f766e; --mc-teal-strong: #0b5f58;
        --mc-teal-line: #cce8e2; --mc-teal-line-strong: #8acbbd; --mc-teal-line-active: #67b9aa;
        --mc-teal-tint: #f1faf8; --mc-teal-tint-deep: #effaf7;
        --mc-blue: #2563eb; --mc-amber: #b45309; --mc-amber-line: #f1d4a5; --mc-amber-tint: #fff7ed;
        --mc-red: #b91c1c; --mc-red-tint: #fdecec; --mc-slate: #52606d;
        --mc-divide: #edf1f4; --mc-surface-alt: #fcfdff; --mc-track: #e8eef2;
      }
      @media (prefers-color-scheme: dark) {
        :root {
          --mc-ink: #e8eaed; --mc-muted: #9aa0a6; --mc-line: #3c4043; --mc-canvas: #181a20; --mc-surface: #242830;
          --mc-teal: #3dbdb4; --mc-teal-strong: #2a9d94;
          --mc-teal-line: #1a3d38; --mc-teal-line-strong: #2a6a60; --mc-teal-line-active: #3a9a8a;
          --mc-teal-tint: #1a2e2c; --mc-teal-tint-deep: #162a28;
          --mc-blue: #5c9dff; --mc-amber: #f0a040; --mc-amber-line: #5a3a10; --mc-amber-tint: #2a1f10;
          --mc-red: #ff6b6b; --mc-red-tint: #3a1a1a; --mc-slate: #8a9199;
          --mc-divide: #2d3139; --mc-surface-alt: #1e2127; --mc-track: #2d3139;
        }
        .mc-spinner { border-color: rgba(61,189,180,.22) }
        .mc-scroll::-webkit-scrollbar-thumb { background: #4a4f59 }
        button:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible { outline-color: rgba(61,189,180,.45) }
        .mc-card:hover { box-shadow: 0 10px 26px rgba(0,0,0,.22) }
      }
      @keyframes mc-pop { from { opacity: 0; transform: translateY(6px) scale(.985) } to { opacity: 1; transform: none } }
      @keyframes mc-fade { from { opacity: 0 } to { opacity: 1 } }
      @keyframes mc-spin { to { transform: rotate(360deg) } }
      @keyframes mc-fan-in { from { opacity: 0; transform: translateY(4px) scale(.9) } to { opacity: 1; transform: none } }
      .mc-spinner { display: inline-block; width: 12px; height: 12px; border: 2px solid rgba(15,118,110,.22); border-top-color: var(--mc-teal); border-radius: 50%; animation: mc-spin .7s linear infinite; vertical-align: -2px; margin-right: 7px }
      .mc-fab { transition: transform .18s ease, box-shadow .18s ease }
      .mc-fab:hover { transform: scale(1.06) }
      .mc-fab:active { transform: scale(.96) }
      .mc-btn { transition: transform .15s ease, box-shadow .15s ease, border-color .15s ease, background .15s ease, opacity .15s ease }
      .mc-btn:hover:not(:disabled) { transform: translateY(-1px) }
      .mc-btn:active:not(:disabled) { transform: translateY(0) scale(.98) }
      .mc-card { transition: transform .18s ease, box-shadow .18s ease }
      .mc-card:hover { transform: translateY(-1px); box-shadow: 0 10px 26px rgba(17,38,60,.08) }
      .mc-scroll::-webkit-scrollbar { width: 8px; height: 8px }
      .mc-scroll::-webkit-scrollbar-thumb { background: #cdd8df; border-radius: 999px }
      .mc-scroll::-webkit-scrollbar-track { background: transparent }
      button:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible { outline: 2px solid rgba(15,118,110,.45); outline-offset: 2px }
      `
          const GlobalStyle = () => h('style', { key: 'mc-global-css', dangerouslySetInnerHTML: { __html: GLOBAL_CSS } })
          const Spinner = ({ text }) => h('span', { style: { display: 'inline-flex', alignItems: 'center', gap: '7px', lineHeight: 1.5 } }, [h('span', { key: 'spin', className: 'mc-spinner', 'aria-hidden': 'true' }), text])
          const ICON_PATHS = {
            sparkles: 'M12 3.2l1.7 4.1 4.1 1.7-4.1 1.7L12 14.8l-1.7-4.1-4.1-1.7 4.1-1.7L12 3.2zM18.8 13.5l.9 2.2 2.2.9-2.2.9-.9 2.2-.9-2.2-2.2-.9 2.2-.9.9-2.2z',
            wand: 'M14.5 5.5 18.5 9.5M4 20 13.5 10.5M13.5 10.5l1.5-1.5a2.12 2.12 0 0 1 3 3L16.5 13.5',
            close: 'M6 6l12 12M18 6 6 18',
            star: 'M12 3.2l2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3.2z',
            check: 'M4.5 12.5l5 5L19.5 7',
          }
          const Icon = ({ name, size = 14, style, strokeWidth = 1.7 }) => h('svg', { viewBox: '0 0 24 24', width: size, height: size, fill: 'none', stroke: 'currentColor', strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': 'true', style }, ICON_PATHS[name] ? h('path', { d: ICON_PATHS[name] }) : null)
          function Panel({ title, hint, children, style }) { return h('section', { style: { ...S.panel, ...style } }, [h('div', { key: 'h', style: S.head }, [h('h2', { key: 't', style: S.h2 }, title), h('span', { key: 'i', style: S.hint }, hint)]), children]) }
          const S = { page: { minHeight: '100%', boxSizing: 'border-box', overflow: 'auto', padding: '24px', background: C.canvas, color: C.ink }, title: { margin: 0, fontSize: '20px', fontWeight: 720 }, lead: { margin: '6px 0 20px', color: C.muted, fontSize: '13px' }, cards: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(132px,1fr))', gap: '10px', marginBottom: '16px' }, card: { minHeight: '82px', padding: '14px', border: `1px solid ${C.line}`, borderRadius: '12px', background: C.surface }, label: { color: C.muted, fontSize: '12px', fontWeight: 600 }, value: { marginTop: '8px', fontSize: '23px', fontWeight: 720 }, layout: { display: 'grid', gridTemplateColumns: 'minmax(0,1.45fr) minmax(270px,.8fr)', gap: '16px', alignItems: 'start' }, side: { display: 'grid', gap: '16px' }, panel: { overflow: 'hidden', border: `1px solid ${C.line}`, borderRadius: '12px', background: C.surface }, head: { display: 'flex', justifyContent: 'space-between', padding: '14px 16px', borderBottom: `1px solid ${C.line}` }, h2: { margin: 0, fontSize: '14px', fontWeight: 700 }, hint: { color: C.muted, fontSize: '12px' }, row: { display: 'grid', gridTemplateColumns: '9px minmax(0,1fr) auto', alignItems: 'center', gap: '10px', padding: '12px 16px', borderBottom: `1px solid ${C.divide}` }, name: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '13px', fontWeight: 600 }, meta: { marginTop: '3px', color: C.muted, fontSize: '12px' }, small: { color: C.muted, fontSize: '12px', fontVariantNumeric: 'tabular-nums' }, empty: { padding: '28px 16px', color: C.muted, fontSize: '13px', lineHeight: 1.6 }, bars: { padding: '4px 16px 12px' }, bar: { padding: '10px 0' }, top: { display: 'flex', justifyContent: 'space-between', gap: '10px', marginBottom: '6px', fontSize: '12px' }, track: { height: '6px', overflow: 'hidden', borderRadius: '999px', background: C.track }, privacy: { marginTop: '16px', padding: '11px 13px', border: `1px solid ${C.tealLineStrong}`, borderRadius: '8px', background: C.tealTint, color: C.tealStrong, fontSize: '12px', lineHeight: 1.55 } }
          Object.assign(S, {
            page: { ...S.page, padding: '30px 34px 48px', background: C.canvas },
            title: { ...S.title, fontSize: '27px', letterSpacing: '-.035em', fontWeight: 760 },
            lead: { ...S.lead, margin: '8px 0 22px', fontSize: '14px', lineHeight: 1.55 },
            card: { ...S.card, minHeight: '96px', borderRadius: '12px', boxShadow: '0 1px 2px rgba(17,38,60,.04),0 8px 22px rgba(17,38,60,.035)' },
            panel: { ...S.panel, borderRadius: '12px', boxShadow: '0 1px 2px rgba(17,38,60,.04),0 10px 24px rgba(17,38,60,.025)' },
            head: { ...S.head, padding: '15px 18px', background: C.surfaceAlt },
            h2: { ...S.h2, letterSpacing: '-.01em' },
            empty: { ...S.empty, padding: '30px 18px', background: C.surfaceAlt },
          })
          const workbenchStyle = {
            tabs: { display: 'flex', gap: '4px', marginBottom: '16px', borderBottom: `1px solid ${C.line}` },
            tab: active => ({ padding: '9px 12px', border: 0, borderBottom: active ? `2px solid ${C.teal}` : '2px solid transparent', background: 'transparent', color: active ? C.ink : C.muted, cursor: 'pointer', fontSize: '13px', fontWeight: active ? 700 : 600 }),
            action: { padding: '7px 10px', border: `1px solid ${C.line}`, borderRadius: '8px', background: C.surface, color: C.ink, cursor: 'pointer', fontSize: '12px', fontWeight: 600 },
            grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))', gap: '12px' },
            overviewMetrics: { display: 'grid', gridTemplateColumns: 'repeat(4,minmax(150px,220px))', gap: '10px', margin: '16px 0' },
            overviewBody: { display: 'grid', gridTemplateColumns: 'minmax(0,1.35fr) minmax(300px,.85fr)', gap: '16px', alignItems: 'start' },
            hero: { padding: '20px', border: `1px solid ${C.line}`, borderRadius: '12px', background: `linear-gradient(120deg,${C.surface} 0%,${C.tealTint} 100%)` },
            heroKicker: { color: C.teal, fontSize: '12px', fontWeight: 700, letterSpacing: '.04em' },
            heroTitle: { margin: '8px 0 6px', fontSize: '26px', lineHeight: 1.2, letterSpacing: '-.03em' },
            heroMeta: { color: C.muted, fontSize: '13px', lineHeight: 1.5 },
            taskRow: { display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '13px 16px', borderBottom: `1px solid ${C.divide}` },
            badge: color => ({ display: 'inline-block', padding: '2px 7px', borderRadius: '999px', background: `${color}15`, color, fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap' }),
            compact: { padding: '12px 16px', borderBottom: `1px solid ${C.divide}`, fontSize: '13px', lineHeight: 1.5 },
            input: { width: '100%', boxSizing: 'border-box', padding: '10px 11px', border: `1px solid ${C.line}`, borderRadius: '7px', fontSize: '13px' },
            actions: { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '14px' },
          }
          Object.assign(workbenchStyle, {
            tabs: { display: 'inline-flex', gap: '3px', margin: '0 0 22px', padding: '4px', border: `1px solid ${C.line}`, borderRadius: '12px', background: C.surface, boxShadow: '0 4px 14px rgba(17,38,60,.035)' },
            tab: active => ({ padding: '8px 13px', border: 0, borderRadius: '8px', background: active ? C.tealTintDeep : 'transparent', color: active ? C.teal : C.muted, cursor: 'pointer', fontSize: '13px', fontWeight: active ? 750 : 600, transition: 'background .16s ease,color .16s ease' }),
            overviewMetrics: { ...workbenchStyle.overviewMetrics, gridTemplateColumns: 'repeat(4,minmax(160px,230px))', gap: '12px', margin: '18px 0' },
            overviewBody: { ...workbenchStyle.overviewBody, gap: '18px' },
            hero: { ...workbenchStyle.hero, padding: '24px', border: `1px solid ${C.tealLine}`, borderRadius: '16px', background: `linear-gradient(120deg,${C.surface} 0%,${C.tealTintDeep} 58%,${C.tealTint} 100%)`, boxShadow: '0 10px 28px rgba(15,118,110,.07)' },
            heroKicker: { ...workbenchStyle.heroKicker, textTransform: 'uppercase', letterSpacing: '.09em' },
            heroTitle: { ...workbenchStyle.heroTitle, fontSize: '30px', fontWeight: 780 },
            taskRow: { ...workbenchStyle.taskRow, padding: '15px 18px' },
            taskGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: '12px', padding: '14px' },
            taskCard: { minHeight: '154px', boxSizing: 'border-box', padding: '16px', border: `1px solid ${C.line}`, borderRadius: '12px', background: C.surface, boxShadow: '0 3px 10px rgba(17,38,60,.025)' },
            compact: { ...workbenchStyle.compact, padding: '14px 18px' },
            action: { ...workbenchStyle.action, padding: '9px 16px', borderColor: C.tealLineStrong, background: C.tealTint, color: C.teal, flexShrink: 0, whiteSpace: 'nowrap' },
            input: { ...workbenchStyle.input, flex: 1, minWidth: 0, padding: '11px 12px', borderRadius: '8px', background: C.surface },
          })

      /* ================= dsh-promptkit utils（纯函数 + 分类链 + DSH 快照转换） ================= */
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

          // 方法触发词表：轻量增强、方法推荐与冲突检测共用同一份信号，避免“推荐 ≠ 采用”。
          // MethodProvider 返回的方法 keywords（触发词）会覆盖同名条目。
          const METHOD_SIGNATURES = {
            '第一性原理': ['全链路', '链路', '整体分析', '本质', '根因', '拆解', '架构', '审查'],
            '苏格拉底式提问': ['报错', '异常', '失败', '为什么', '原因', '排查'],
            '用最小实验替代空想': ['实现', '开发', '修改', '重构', '新增', '优化'],
            '双向钢人论证': ['方案', '选型', '取舍', '哪个好', '是否', '比较', '对比', '决策', '选择', '风险'],
          }
          // 轻量增强模板的语义展示名：内置模板是单轮整形，与多轮方法名实不符，
          // 展示用语义名（链路审查/排障收敛/开发收敛/决策权衡），内部仍按方法名联动推荐。
          const TEMPLATE_LABELS = {
            '第一性原理': '链路审查',
            '苏格拉底式提问': '排障收敛',
            '用最小实验替代空想': '开发收敛',
            '双向钢人论证': '决策权衡',
          }
          // 计分制：强信号命中 1 个即判该方法，弱信号需 ≥2 个组合命中才判，
          // 避免 ‘是否’/‘选择’/‘风险’ 等常见词单独出现时误分类。
          const STRONG_SIGNALS = new Set(['选型', '取舍', '哪个好', '对比', '决策', '全链路', '链路', '本质', '根因', '报错', '异常', '排查'])

          function buildSignatures(methods) {
            const signatures = { ...METHOD_SIGNATURES }
            for (const method of list(methods)) {
              if (method?.title && method.keywords?.length) signatures[method.title] = method.keywords
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

          function classify(source, guidance, signatures) {
            const suffix = guidance ? `\n\n额外要求：${guidance}` : ''
            const hits = []
            for (const [title, triggers] of Object.entries(signatures)) {
              // 内置 4 方法走计分制防误判；方法库扩展方法的关键词是作者手写触发词，任一命中即判。
              if (Object.prototype.hasOwnProperty.call(METHOD_SIGNATURES, title)) {
                const strong = triggers.filter(token => STRONG_SIGNALS.has(token) && source.includes(token))
                const weak = triggers.filter(token => !STRONG_SIGNALS.has(token) && source.includes(token))
                if (strong.length >= 1 || weak.length >= 2) hits.push({ title, signals: [...strong, ...weak] })
              } else {
                const matched = triggers.filter(token => source.includes(token))
                if (matched.length) hits.push({ title, signals: matched })
              }
            }
            const first = hits[0]
            if (!first) return { method: '', label: '', signals: [], conflicts: [], ...lightTemplate('', source, suffix) }
            const conflicts = hits.slice(1).map(item => ({ title: item.title, label: TEMPLATE_LABELS[item.title] || item.title, signals: item.signals }))
            return { method: first.title, label: TEMPLATE_LABELS[first.title] || first.title, signals: hits.flatMap(item => item.signals), conflicts, ...lightTemplate(first.title, source, suffix) }
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

      /* ================= dsh-promptkit core: MethodProvider ================= */
      // MethodProvider：方法源抽象。
      // 解耦 PromptKit 与任何特定宿主（Memory Center / DSH / 通用前端）。
      // 开源核心只依赖此接口；具体实现（内置静态方法、MC 私有 catalog、DSH 适配器）由宿主注入。

      /**
       * @typedef {Object} Method
       * @property {string} id
       * @property {string} title
       * @property {string} [purpose]
       * @property {string} [category]
       * @property {'guided'|'structured'} [mode]
       * @property {string} [outcome]
       * @property {string} [tags]
       * @property {string} [template]
       */

      class MethodProvider {
        /** @returns {Promise<Method[]>} 全部方法 */
        async list() { throw new Error('MethodProvider.list() 未实现') }

        /** @param {string} query @returns {Promise<Method[]>} 按关键词搜索 */
        async search(query) {
          const all = await this.list()
          if (!query) return all
          const q = query.toLowerCase()
          return all.filter(m => `${m.title} ${m.purpose || ''} ${m.tags || ''}`.toLowerCase().includes(q))
        }

        /** @param {string} id @returns {Promise<Method|null>} 按 id 取单个 */
        async getById(id) { return (await this.list()).find(m => m.id === id) || null }

        /**
         * 组合生成最终 Prompt。
         * @param {{ methodId:string, question?:string, facts?:string, constraints?:string, options?:string }} input
         * @returns {Promise<{ prompt:string, estimated_chars:number, method:Method }>}
         */
        async compose(input) { throw new Error('MethodProvider.compose() 未实现') }

        /** @param {string} methodId @returns {Promise<{ prompt:string }>} 取模板（提示词库） */
        async getTemplate(methodId) { throw new Error('MethodProvider.getTemplate() 未实现') }

        /** @returns {Promise<string[]>} 收藏 id 列表（可选覆盖） */
        async getFavorites() { return [] }
        /** @param {string[]} ids */
        async setFavorites(ids) {}

        /** @returns {Promise<Array<{id:string,title:string,question?:string,at?:number}>>} 最近生成记录 */
        async getHistory() { return [] }
        /** @param {{id:string,title:string,question?:string}} item */
        async pushHistory(item) {}
      }

      /* ================= dsh-promptkit core: Composer / withPrefix ================= */
      // Composer：写入目标输入框的抽象。
      // 开源版可接任意 <textarea>，闭源版（DSH 插件）接消息框 inputActions。

      class Composer {
        /** @returns {string} 当前草稿 */
        getDraft() { return '' }

        /** @param {string} text 写入目标 */
        write(text) { throw new Error('Composer.write() 未实现') }

        /**
         * 订阅草稿变化（含用户手动输入与 write() 写入），组件据此同步本地状态。
         * @param {(text:string)=>void} cb
         * @returns {()=>void} 取消订阅函数（可选实现）
         */
        onChange(cb) { return () => {} }
      }

      /** 构造 “前缀 + 新内容”：若当前草稿非空，插入空行分隔。 */
      function withPrefix(current, next) {
        const cur = (current || '').trim()
        return cur ? `${cur}\n\n${next}` : next
      }

      /* ================= dsh-promptkit core: Enhancer ================= */
      // Enhancer：语义 / 轻量增强的模型调用抽象。
      // 开源版可接任意 LLM（如 OpenAI 兼容端点），闭源版接当前会话模型。

      class Enhancer {
        /** @returns {boolean} 是否正在增强 */
        get loading() { return false }

        /**
         * @param {{ draft:string, extra?:string, lang?:string, kind?:'light'|'semantic', method?:object }} input
         * @returns {Promise<{ prompt:string, model?:string }>}
         */
        async enhance(input) { throw new Error('Enhancer.enhance() 未实现') }

        /** 取消进行中的增强 */
        cancel() {}
      }

      /* ================= dsh-promptkit 内置方法库（10 个通用思考方法） ================= */
      // 精选通用思考方法子集（随包开源，不涉密、有普适价值）。
      // 字段与 Memory Center 内部方法结构对齐，便于 DSH 适配器直接桥接。
      // 注意：苏格拉底式提问 / 第一性原理 / 双向钢人论证 被组件作为“常用方法”硬编码
      //（fan 按钮、⌘1-3 快捷键、置顶区），必须包含在默认方法库中，独立运行时体验才完整。

      const BUILTIN_METHODS = [
        {
          id: 'socratic',
          title: '苏格拉底式提问',
          category: '澄清',
          mode: 'guided',
          purpose: '通过逐步追问澄清问题，直到问题足够清楚再推进。',
          outcome: '关键澄清问题与一个清晰、可执行的问题陈述。',
          tags: '提问 澄清',
        },
        {
          id: 'first-principles',
          title: '第一性原理',
          category: '拆解',
          mode: 'structured',
          purpose: '把问题拆到不可再分的基本事实，再向上重构方案。',
          outcome: '一份从基本事实出发的结构化推导。',
          tags: '拆解 推导',
        },
        {
          id: 'steelman',
          title: '双向钢人论证',
          category: '决策',
          mode: 'structured',
          purpose: '重述问题后，分别给出正反双方的最强论证，再定位核心分歧。',
          outcome: '双方最强论证与唯一核心分歧点。',
          tags: '决策 论证',
        },
        {
          id: 'minimal-experiment',
          title: '用最小实验替代空想',
          category: '执行',
          mode: 'structured',
          purpose: '先收敛最小改动范围与验收标准，用最小验证代替假设推演。',
          outcome: '最小改动范围、验收标准与验证结果。',
          tags: '执行 验证',
        },
        {
          id: 'five-whys',
          title: '5-Why 根因分析',
          category: '归因',
          mode: 'structured',
          purpose: '连续追问为什么，定位问题的真正根因。',
          outcome: '根因链与对应对策。',
          tags: '根因 归因',
        },
        {
          id: 'pros-cons',
          title: '利弊权衡',
          category: '决策',
          mode: 'structured',
          purpose: '并列列出收益与代价，辅助取舍。',
          outcome: '利弊清单与建议。',
          tags: '决策 对比',
        },
        {
          id: 'scqa',
          title: 'SCQA 结构化表达',
          category: '表达',
          mode: 'structured',
          purpose: '用情境-冲突-问题-答案组织表达。',
          outcome: '结构化的一段表述。',
          tags: '表达 写作',
        },
        {
          id: 'mece',
          title: 'MECE 拆解',
          category: '拆解',
          mode: 'structured',
          purpose: '相互独立、完全穷尽地拆解议题。',
          outcome: '无重叠无遗漏的拆解树。',
          tags: '拆解 分类',
        },
        {
          id: 'six-hats',
          title: '六顶思考帽',
          category: '视角',
          mode: 'structured',
          purpose: '从事实、情感、谨慎、乐观、创意、控制六视角审视。',
          outcome: '多维视角的综合判断。',
          tags: '视角 评审',
        },
        {
          id: 'hypothesis',
          title: '假设驱动',
          category: '决策',
          mode: 'structured',
          purpose: '先提出可证伪假设，再找证据验证。',
          outcome: '假设与验证结论。',
          tags: '假设 验证',
        },
      ]

      /* ================= adapter: StaticMethodProvider ================= */
      // 开源默认 MethodProvider：内置静态方法 + 本地 compose + localStorage 收藏/历史。
      // 不依赖任何后端；闭源版可替换为接 Memory Center / DSH 私有 catalog 的实现。
      const FAVORITES_KEY = 'promptkit.prompt-library.favorites.v1'
      const HISTORY_KEY = 'promptkit.prompt-library.history.v1'
      const HISTORY_LIMIT = 5

      const readStore = (key, fallback) => {
        try { const value = JSON.parse(window.localStorage.getItem(key) || ''); return Array.isArray(value) ? value : fallback } catch { return fallback }
      }
      const writeStore = (key, value) => { try { window.localStorage.setItem(key, JSON.stringify(value)) } catch {} }

      class StaticMethodProvider extends MethodProvider {
        async list() { return BUILTIN_METHODS }

        async compose({ methodId, question, facts, constraints, options }) {
          const method = BUILTIN_METHODS.find(m => m.id === methodId) || BUILTIN_METHODS[0]
          const parts = [
            `# ${method.title}`,
            method.purpose && `目标：${method.purpose}`,
            method.outcome && `期望产出：${method.outcome}`,
            question && `问题：${question}`,
            facts && `事实：${facts}`,
            constraints && `约束：${constraints}`,
            options && `备选：${options}`,
          ].filter(Boolean)
          const prompt = parts.join('\n\n')
          return { prompt, estimated_chars: prompt.length, method }
        }

        async getTemplate(methodId) {
          const m = BUILTIN_METHODS.find(x => x.id === methodId)
          if (!m) return { prompt: '' }
          const lines = [`# ${m.title}`]
          if (m.purpose) lines.push(`目标：${m.purpose}`)
          lines.push('', '问题：', '（在此写入你的问题）')
          if (m.mode === 'guided') lines.push('', '请先就问题的模糊之处向我提问，每次只问一个最关键的问题。')
          return { prompt: lines.join('\n') }
        }

        async getFavorites() { return readStore(FAVORITES_KEY, []) }

        async setFavorites(ids) { writeStore(FAVORITES_KEY, Array.isArray(ids) ? ids : []) }

        async getHistory() { return readStore(HISTORY_KEY, []) }

        async pushHistory(item) {
          const next = [item, ...readStore(HISTORY_KEY, [])].slice(0, HISTORY_LIMIT)
          writeStore(HISTORY_KEY, next)
          return next
        }
      }

      /* ================= adapter: TextareaComposer ================= */
      // 示例 Composer：写入任意 <textarea> 元素，并对用户输入保持响应（input 事件订阅）。
      // 闭源版（DSH 插件）可继承 Composer 并桥接到 inputActions.setDraft。
      class TextareaComposer extends Composer {
        /** @param {HTMLTextAreaElement} el */
        constructor(el) {
          super()
          this.el = el
          this._subs = new Set()
          if (el) el.addEventListener('input', () => this._notify())
        }

        getDraft() { return this.el ? this.el.value : '' }

        write(text) {
          if (!this.el) return
          this.el.value = text
          // 派发 input 事件：既让宿主框架感知变化，也触发 _notify 同步订阅者。
          this.el.dispatchEvent(new Event('input', { bubbles: true }))
        }

        onChange(cb) {
          this._subs.add(cb)
          return () => { this._subs.delete(cb) }
        }

        _notify() {
          const text = this.getDraft()
          this._subs.forEach(cb => { try { cb(text) } catch {} })
        }
      }

      /* ================= adapter: OpenAIEnhancer ================= */
      // 示例 Enhancer：接任意 OpenAI 兼容端点（开源版用）。
      // 闭源版（DSH 插件）可继承 Enhancer 并桥接到当前会话模型的语义增强接口。
      class OpenAIEnhancer extends Enhancer {
        constructor({ endpoint, apiKey, model = 'gpt-4o-mini' } = {}) {
          super()
          this.endpoint = endpoint
          this.apiKey = apiKey
          this.model = model
          this._abort = null
        }

        get loading() { return this._abort !== null }

        async enhance({ draft, extra, kind, method }) {
          // kind === 'light' 时建议由宿主复用 lib/utils 的 planPromptEnhancement（零 Token）；
          // 此处示例实现统一的语义改写路径。
          this._abort = new AbortController()
          try {
            const instruction = method?.template
              ? `按「${method.title}」的方法结构改写以下提示词。方法模板：\n\n${method.template}`
              : '改写以下提示词，使其更清晰、可执行。'
            const res = await fetch(this.endpoint, {
              method: 'POST',
              headers: { 'content-type': 'application/json', authorization: `Bearer ${this.apiKey}` },
              body: JSON.stringify({
                model: this.model,
                messages: [{ role: 'user', content: `${instruction}\n\n补充要求：${extra || '无'}\n\n${draft}` }],
              }),
              signal: this._abort.signal,
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok) {
              if (res.status === 504) throw Object.assign(new Error('模型响应超时，请稍后重试。'), { timeout: true })
              throw new Error(data?.error?.message || `增强请求失败（HTTP ${res.status}）`)
            }
            return { prompt: data.choices?.[0]?.message?.content || draft, model: this.model }
          } finally {
            this._abort = null
          }
        }

        cancel() { this._abort?.abort() }
      }

      /* ================= 组件: PromptStudio（方法工坊） ================= */
      // PromptStudio（方法工坊）：开源核心组件，零宿主依赖。
      // 所有外部能力经 props 注入；未注入的可选能力对应 UI 区块自动隐藏，组件始终可用：
      //   methodProvider    (必填) MethodProvider：方法源 + compose + 收藏/历史持久化
      //   messages          (可选) [{ id, role:'user'|'assistant', text }]：当前对话，用于「从当前对话提取」
      //   onSend            (可选) (text) => Promise：直接发送生成的 Prompt（如发送到当前会话）
      //   composer          (可选) Composer 实例：把生成的 Prompt 写入目标输入框
      //   getRecentSessions (可选) () => Promise<Array<{ intent?, summary? }>>：追加最近会话摘要
      //   searchMemory      (可选) (query) => Promise<string>：按自然语言检索项目记忆
      function PromptStudio({ methodProvider, messages, onSend, composer, getRecentSessions, searchMemory }) {
        const [methods, setMethods] = React.useState([])
        const [loadingMethods, setLoadingMethods] = React.useState(true)
        const [methodId, setMethodId] = React.useState('')
        const [category, setCategory] = React.useState('全部')
        const [search, setSearch] = React.useState('')
        const [favorites, setFavorites] = React.useState([])
        const [history, setHistory] = React.useState([])
        const [question, setQuestion] = React.useState('')
        const [facts, setFacts] = React.useState('')
        const [constraints, setConstraints] = React.useState('')
        const [options, setOptions] = React.useState('')
        const [recentLimit, setRecentLimit] = React.useState('0')
        const [recentPreview, setRecentPreview] = React.useState(null)
        const [contextQuery, setContextQuery] = React.useState('')
        const [contextPreview, setContextPreview] = React.useState('')
        const [preview, setPreview] = React.useState(null)
        const [extracted, setExtracted] = React.useState(null)
        const [message, setMessage] = React.useState('')
        React.useEffect(() => {
          let alive = true
          setLoadingMethods(true)
          methodProvider.list().then(value => { if (alive) setMethods(list(value)) }).catch(error => { if (alive) setMessage(String(error?.message || error)) }).finally(() => { if (alive) setLoadingMethods(false) })
          methodProvider.getFavorites?.().then(value => { if (alive) setFavorites(list(value)) }).catch(() => {})
          methodProvider.getHistory?.().then(value => { if (alive) setHistory(list(value)) }).catch(() => {})
          return () => { alive = false }
        }, [methodProvider])
        const categories = ['全部', ...Array.from(new Set(methods.map(item => item.category))).filter(Boolean)]
        const pinnedNames = ['苏格拉底式提问', '第一性原理', '双向钢人论证']
        const pinned = pinnedNames.map(name => methods.find(item => item.title === name)).filter(Boolean)
        const visibleMethods = (category === '全部' ? methods : methods.filter(item => item.category === category)).filter(item => !search.trim() || `${item.title} ${item.purpose} ${item.tags}`.toLowerCase().includes(search.trim().toLowerCase()))
        React.useEffect(() => { if (!methodId && methods.length) setMethodId(methods[0].id) }, [methodId, methods.length])
        const method = methods.find(item => item.id === methodId)
        const toggleFavorite = id => {
          const next = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id]
          setFavorites(next)
          methodProvider.setFavorites?.(next).catch(() => {})
        }
        const compose = () => methodProvider.compose({ methodId, question, facts, constraints, options }).then(value => {
          setPreview(value)
          return methodProvider.pushHistory({ id: methodId, title: value.method?.title || method?.title || '', question: cleanSummary(question), at: Date.now() }).catch(() => {}).then(() => methodProvider.getHistory?.()).then(rows => { if (rows) setHistory(list(rows)) })
        }).catch(error => setMessage(String(error?.message || error)))
        const previewRecent = async () => {
          try {
            const items = list(await getRecentSessions()).slice(0, Number(recentLimit))
            const summary = items.map(item => cleanContext(item.intent || item.summary)).filter(Boolean).join('\n').slice(0, 1200)
            setRecentPreview({ count: items.length, summary })
            setMessage(summary ? '' : '没有可追加的已保存会话摘要。')
          } catch (error) { setMessage(String(error?.message || error)) }
        }
        const appendRecent = () => {
          const summary = cleanContext(recentPreview?.summary || '')
          if (summary) setFacts(value => [value, '最近会话摘要：', summary].filter(Boolean).join('\n'))
          setRecentPreview(null)
          setMessage(summary ? `已追加最近 ${recentPreview.count} 个会话摘要。` : '没有可追加的已保存会话摘要。')
        }
        const searchContext = () => searchMemory(contextQuery).then(value => setContextPreview(String(value ?? ''))).catch(error => setMessage(String(error?.message || error)))
        const appendContext = () => {
          const context = cleanContext(contextPreview || '')
          if (context) setFacts(value => [value, '项目记忆检索：', context].filter(Boolean).join('\n'))
          setContextPreview('')
        }
        const writePreview = () => {
          const next = withPrefix(composer.getDraft(), preview.prompt)
          composer.write(next)
          setMessage('已写入输入框，可编辑后发送。')
        }
        const copyPreview = async () => {
          try { await navigator.clipboard?.writeText(preview.prompt); setMessage('Prompt 已复制到剪贴板。') }
          catch { setMessage('复制失败，请手动选择预览文本复制。') }
        }
        const previewPanel = preview ? h(Panel, { key: 'preview', title: '发送前预览', hint: `${preview.estimated_chars} 字符` }, h('div', { style: { padding: '18px' } }, [
          h('pre', { key: 'text', style: { margin: 0, whiteSpace: 'pre-wrap', fontSize: '12px', lineHeight: 1.55, color: C.slate, maxHeight: '280px', overflow: 'auto' } }, preview.prompt),
          h('div', { key: 'actions', style: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px' } }, [
            onSend ? h('button', { key: 'send', onClick: () => onSend(preview.prompt).then(() => setMessage('已发送。')).catch(error => setMessage(String(error?.message || error))), style: workbenchStyle.action }, '发送到当前会话') : null,
            composer ? h('button', { key: 'write', onClick: writePreview, style: { ...workbenchStyle.action, background: C.surface, color: C.teal } }, '写入输入框') : null,
            h('button', { key: 'copy', onClick: copyPreview, style: { ...workbenchStyle.action, background: C.surface, color: C.muted } }, '复制 Prompt'),
          ]),
        ])) : null
        return h('main', { style: S.page }, [
          h(GlobalStyle, { key: 'gcss' }),
          h('h1', { key: 'title', style: S.title }, '方法工坊'),
          h('p', { key: 'lead', style: S.lead }, '选择方法后，用精简的问题、事实和约束生成可编辑 Prompt；对话页也可用右下角快捷按钮处理。'),
          loadingMethods ? h('div', { key: 'loading', style: S.empty }, h(Spinner, { text: '正在读取方法库…' })) : h('div', { key: 'layout', style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: '18px', alignItems: 'start' } }, [
            h(Panel, { key: 'methods', title: '选择方法', hint: `${visibleMethods.length} / ${methods.length}`, style: { position: 'sticky', top: '14px', maxHeight: 'calc(100vh - 146px)', overflowY: 'auto' } }, [
              h('div', { key: 'filter', style: { padding: '14px', borderBottom: `1px solid ${C.divide}`, display: 'grid', gap: '8px' } }, [h('input', { key: 'search', value: search, onChange: event => setSearch(event.target.value), placeholder: '搜索方法、用途或标签', style: { ...workbenchStyle.input, padding: '8px 10px' } }), h('select', { key: 'select', value: category, onChange: event => setCategory(event.target.value), style: { width: '100%', padding: '8px 10px', border: `1px solid ${C.line}`, borderRadius: '8px', background: C.surface, color: C.ink } }, categories.map(value => h('option', { key: value, value }, value)))]),
              h('div', { key: 'pinned', style: { padding: '14px', borderBottom: `1px solid ${C.divide}`, background: C.tealTint } }, [h('div', { key: 'label', style: { marginBottom: '9px', color: C.teal, fontSize: '11px', fontWeight: 800, letterSpacing: '.06em' } }, '常用方法'), h('div', { key: 'items', style: { display: 'grid', gap: '7px' } }, pinned.map(item => h('button', { key: item.id, className: 'mc-btn', onClick: () => { setMethodId(item.id); setPreview(null); setMessage('') }, style: { padding: '9px 10px', border: `1px solid ${item.id === methodId ? C.tealLineStrong : C.tealLine}`, borderRadius: '8px', background: item.id === methodId ? C.tealTint : C.surface, textAlign: 'left', cursor: 'pointer' } }, [h('div', { key: 'title', style: { ...S.name, fontSize: '12px' } }, item.title), h('div', { key: 'purpose', style: { ...S.meta, marginTop: '3px', fontSize: '11px' } }, item.purpose)])))]),
              favorites.length ? h('div', { key: 'favorites', style: { padding: '12px 14px', borderBottom: `1px solid ${C.divide}` } }, [h('div', { key: 'label', style: { marginBottom: '7px', color: C.muted, fontSize: '11px', fontWeight: 800 } }, '我的收藏'), h('div', { key: 'items', style: { display: 'flex', flexWrap: 'wrap', gap: '5px' } }, favorites.map(id => methods.find(item => item.id === id)).filter(Boolean).map(item => h('button', { key: item.id, onClick: () => setMethodId(item.id), style: { border: `1px solid ${C.tealLine}`, borderRadius: '999px', background: C.surface, color: C.teal, cursor: 'pointer', padding: '4px 7px', fontSize: '10px', fontWeight: 700 } }, `★ ${item.title}`)))] ) : null,
              visibleMethods.map(item => h('button', { key: item.id, className: 'mc-btn', onClick: () => { setMethodId(item.id); setPreview(null); setMessage('') }, style: { width: '100%', padding: '15px', border: 0, borderBottom: `1px solid ${C.divide}`, background: item.id === methodId ? C.tealTint : C.surface, textAlign: 'left', cursor: 'pointer' } }, [h('div', { key: 'title', style: S.name }, item.title), h('div', { key: 'purpose', style: { ...S.meta, marginTop: '5px', color: C.ink, lineHeight: 1.45 } }, item.purpose || '查看方法说明后再决定是否使用。'), h('div', { key: 'meta', style: { ...S.meta, marginTop: '6px' } }, `${item.category} · ${item.mode === 'guided' ? '会逐步追问' : '会一次性分析'}`)])),
            ]),
            h('div', { key: 'form', style: S.side }, [
              h(Panel, { key: 'input', title: method?.title || '方法输入', hint: method?.purpose || '' }, h('div', { style: { padding: '18px', display: 'grid', gap: '12px' } }, [
                method ? h('div', { key: 'guide', style: { padding: '12px', border: `1px solid ${C.tealLine}`, borderRadius: '8px', background: C.tealTint, color: C.slate, fontSize: '12px', lineHeight: 1.55 } }, [h('strong', { key: 'label', style: { color: C.teal } }, '你会得到：'), ` ${method.outcome || (method.mode === 'guided' ? 'AI 会逐步追问，直到问题足够清楚。' : '一份结构化分析、风险和下一步行动。')}`]) : null,
                h('div', { key: 'extract-actions', style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } }, [messages?.length ? h('button', { key: 'extract', onClick: () => setExtracted(selectedConversationDraft(messages)), style: workbenchStyle.action }, '从当前对话提取') : null, method ? h('button', { key: 'favorite', onClick: () => toggleFavorite(method.id), style: { ...workbenchStyle.action, background: favorites.includes(method.id) ? C.tealTintDeep : C.surface } }, favorites.includes(method.id) ? '★ 已收藏' : '☆ 收藏方法') : null, h('button', { key: 'clear', onClick: () => { setQuestion(''); setFacts(''); setConstraints(''); setOptions(''); setExtracted(null) }, style: { ...workbenchStyle.action, background: C.surface, color: C.muted } }, '清空')]),
                extracted ? h('div', { key: 'extracted', style: { padding: '12px', border: `1px solid ${C.tealLine}`, borderRadius: '8px', background: C.tealTint, fontSize: '12px', lineHeight: 1.55 } }, [h('strong', { key: 'head', style: { color: C.teal } }, `已从 ${extracted.source_count} 条文本消息生成草稿`), h('div', { key: 'summary', style: { ...S.meta, marginTop: '5px' } }, `问题 ${extracted.question ? '✓' : '—'} · 事实 ${extracted.facts ? '✓' : '—'} · 约束 ${extracted.constraints ? '✓' : '—'} · 未决问题 ${extracted.unresolved ? '✓' : '—'}`), extracted.question ? h('div', { key: 'question', style: { marginTop: '7px', color: C.slate } }, `问题：${cleanSummary(extracted.question)}`) : null, extracted.unresolved ? h('div', { key: 'unresolved', style: { marginTop: '4px', color: C.slate } }, `未决：${cleanSummary(extracted.unresolved)}`) : null, h('button', { key: 'apply', onClick: () => { setQuestion(extracted.question); setFacts(extracted.facts); setConstraints(extracted.constraints); setOptions(extracted.options); setExtracted(null) }, style: { ...workbenchStyle.action, marginTop: '9px' } }, '确认并填入表单')]) : null,
                h('textarea', { key: 'q', value: question, onChange: e => setQuestion(e.target.value), placeholder: '输入你想解决的问题', style: { ...workbenchStyle.input, minHeight: '92px', resize: 'vertical' } }),
                h('div', { key: 'supporting', style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '10px' } }, [h('textarea', { key: 'f', value: facts, onChange: e => setFacts(e.target.value), placeholder: '可选：已知事实', style: { ...workbenchStyle.input, minHeight: '54px', resize: 'vertical' } }), h('textarea', { key: 'c', value: constraints, onChange: e => setConstraints(e.target.value), placeholder: '可选：现实约束、资源或不可接受结果', style: { ...workbenchStyle.input, minHeight: '54px', resize: 'vertical' } }), h('textarea', { key: 'o', value: options, onChange: e => setOptions(e.target.value), placeholder: '可选：已有方案、备选路径或尚未解决的问题', style: { ...workbenchStyle.input, minHeight: '54px', resize: 'vertical' } })]),
                getRecentSessions ? h('div', { key: 'history', style: { paddingTop: '4px', borderTop: `1px solid ${C.divide}` } }, [h('div', { key: 'label', style: { ...S.label, marginBottom: '4px' } }, '追加最近会话摘要'), h('div', { key: 'hint', style: { ...S.meta, marginBottom: '7px' } }, '只读取已保存的简短摘要，不读取完整历史对话、工具参数或工具结果。'), h('div', { key: 'controls', style: { display: 'flex', gap: '8px' } }, [h('select', { key: 'limit', value: recentLimit, onChange: e => { setRecentLimit(e.target.value); setRecentPreview(null) }, style: { padding: '8px', border: `1px solid ${C.line}`, borderRadius: '8px' } }, [['0', '不追加'], ['1', '最近 1 个'], ['3', '最近 3 个'], ['5', '最近 5 个']].map(([value, label]) => h('option', { key: value, value }, label))), h('button', { key: 'preview', disabled: recentLimit === '0', onClick: previewRecent, style: workbenchStyle.action }, '预览摘要')]), recentPreview ? h('div', { key: 'preview', style: { marginTop: '9px', padding: '10px', border: `1px solid ${C.tealLine}`, borderRadius: '8px', background: C.tealTint, fontSize: '12px', lineHeight: 1.55, whiteSpace: 'pre-wrap', maxHeight: '210px', overflow: 'auto' } }, [h('div', { key: 'text', style: { color: C.slate } }, recentPreview.summary || '未找到可追加的已保存会话摘要。'), h('button', { key: 'apply', disabled: !recentPreview.summary, onClick: appendRecent, style: { ...workbenchStyle.action, marginTop: '8px' } }, `追加 ${recentPreview.count} 个摘要到事实`)]) : null]) : null,
                searchMemory ? h('div', { key: 'search', style: { paddingTop: '4px', borderTop: `1px solid ${C.divide}` } }, [h('div', { key: 'label', style: { ...S.label, marginBottom: '4px' } }, '按自然语言搜索项目记忆'), h('div', { key: 'hint', style: { ...S.meta, marginBottom: '7px' } }, '用一句自然语言描述你要找的旧决策或证据；搜索范围由宿主注入的 searchMemory 决定。'), h('div', { key: 'controls', style: { display: 'flex', gap: '8px' } }, [h('input', { key: 'query', value: contextQuery, onChange: e => setContextQuery(e.target.value), placeholder: '例如：之前关于 Feign 兼容的决策', style: workbenchStyle.input }), h('button', { key: 'search', disabled: !contextQuery.trim(), onClick: searchContext, style: workbenchStyle.action }, '搜索')]), contextPreview ? h('div', { key: 'preview', style: { marginTop: '9px', padding: '10px', border: `1px solid ${C.tealLine}`, borderRadius: '8px', background: C.tealTint, fontSize: '12px', lineHeight: 1.55, whiteSpace: 'pre-wrap', maxHeight: '210px', overflow: 'auto' } }, [h('div', { key: 'text', style: { color: C.slate } }, cleanContext(contextPreview) || '未找到可追加的项目记忆。'), h('button', { key: 'apply', onClick: appendContext, style: { ...workbenchStyle.action, marginTop: '8px' } }, '追加到事实')]) : null]) : null,
                h('button', { key: 'compose', onClick: compose, style: workbenchStyle.action }, '生成 Prompt 预览'),
              ])),
              previewPanel,
              history.length ? h(Panel, { key: 'history-panel', title: '最近生成', hint: `${history.length} 条` }, h('div', { style: { padding: '10px 14px', display: 'grid', gap: '6px' } }, history.map(item => h('button', { key: `${item.id}:${item.at}`, onClick: () => { setMethodId(item.id); setQuestion(item.question); setMessage('已恢复最近一次问题，可继续编辑。') }, style: { padding: '8px 9px', border: `1px solid ${C.line}`, borderRadius: '8px', background: C.surface, textAlign: 'left', cursor: 'pointer', fontSize: '11px', color: C.slate } }, `${item.title} · ${item.question || '未命名问题'} · ${item.at ? new Date(item.at).toLocaleTimeString() : ''}`)))) : null,
              message ? h('div', { key: 'message', style: { color: C.teal, fontSize: '13px' } }, message) : null,
            ]),
          ]),
        ])
      }

      /* ================= 组件: QuickEnhancer（快捷助手） ================= */
      // ConversationQuickAction（对话快捷增强器 / QuickEnhancer）：开源核心组件，零宿主依赖。
      // 所有外部能力经 props 注入；未注入的可选能力对应 UI 自动隐藏或降级：
      //   methodProvider (必填) MethodProvider：方法源 + compose + getTemplate + 收藏/历史
      //   composer       (必填) Composer：写入目标输入框（读写草稿均经此接口）
      //   enhancer       (可选) Enhancer：语义增强模型；未注入时仅保留「轻量 · 零 Token」档位
      //   messages       (可选) [{ id, role:'user'|'assistant', text }]：当前对话，供「加对话」参考
      //   searchMemory   (可选) (query) => Promise<string>：项目记忆检索，供「加项目记忆」档位
      function ConversationQuickAction({ methodProvider, composer, enhancer, messages, searchMemory, storagePrefix = 'promptkit.' }) {
        const storageKey = name => `${storagePrefix}quick-action.${name}`
        const msgs = list(messages)
        const [draft, setDraft] = React.useState(() => composer?.getDraft?.() || '')
        React.useEffect(() => {
          setDraft(composer?.getDraft?.() || '')
          if (!composer?.onChange) return undefined
          const off = composer.onChange(setDraft)
          return typeof off === 'function' ? off : undefined
        }, [composer])
        const [open, setOpen] = React.useState(false)
        const [mode, setMode] = React.useState('method')
        const [enhancementKind, setEnhancementKind] = React.useState('light')
        const [selected, setSelected] = React.useState([])
        const [methods, setMethods] = React.useState([])
        const [selectedMethodId, setSelectedMethodId] = React.useState('')
        const [loading, setLoading] = React.useState(false)
        const [showAllMethods, setShowAllMethods] = React.useState(false)
        const [notice, setNotice] = React.useState('')
        const [requirement, setRequirement] = React.useState('')
        const [contextLevel, setContextLevel] = React.useState('question')
        const [undoDraft, setUndoDraft] = React.useState(null)
        const [libraryOpen, setLibraryOpen] = React.useState(false)
        const [librarySearch, setLibrarySearch] = React.useState('')
        const [libraryFavorites, setLibraryFavorites] = React.useState([])
        const [libraryHistory, setLibraryHistory] = React.useState([])
        const [recentMethodIds, setRecentMethodIds] = React.useState(() => { try { return JSON.parse(window.localStorage.getItem(storageKey('recent-methods.v1')) || '[]') } catch { return [] } })
        const [methodUsage, setMethodUsage] = React.useState(() => { try { return JSON.parse(window.localStorage.getItem(storageKey('method-usage.v1')) || '{}') } catch { return {} } })
        const [position, setPosition] = React.useState(() => {
          try {
            const value = JSON.parse(window.localStorage.getItem(storageKey('position.v1')) || 'null')
            if (Number.isFinite(value?.x) && Number.isFinite(value?.y)) return value
          } catch {}
          return { x: Math.max(24, window.innerWidth - 86), y: Math.max(96, window.innerHeight - 158) }
        })
        const drag = React.useRef(null)
        const suppressClick = React.useRef(false)
        const rootRef = React.useRef(null)
        const openPanel = () => setOpen(value => !value)
        React.useEffect(() => { if (!open) enhancer?.cancel() }, [open, enhancer])
        React.useEffect(() => { if (!enhancer && enhancementKind === 'semantic') setEnhancementKind('light') }, [enhancer, enhancementKind])
        React.useEffect(() => { if (mode === 'library' && !libraryOpen) setLibraryOpen(true) }, [mode, libraryOpen])
        React.useEffect(() => {
          let alive = true
          methodProvider.getFavorites?.().then(value => { if (alive) setLibraryFavorites(list(value)) }).catch(() => {})
          methodProvider.getHistory?.().then(value => { if (alive) setLibraryHistory(list(value)) }).catch(() => {})
          return () => { alive = false }
        }, [methodProvider])
        React.useEffect(() => {
          if (!open || methods.length) return
          setLoading(true)
          methodProvider.list().then(value => setMethods(list(value))).catch(error => setNotice(String(error?.message || error))).finally(() => setLoading(false))
        }, [open, methods.length, methodProvider])
        React.useEffect(() => {
          const onKeydown = event => {
            if (event.key === 'Escape' && open) { setOpen(false); return }
            if (!(event.metaKey || event.ctrlKey)) return
            // 普通 Enter 在 textarea 内天然换行：Enter 提交分支位于 meta/ctrl 守卫之后，
            // 只有 ⌘/Ctrl+Enter 才会走到这里；再限定焦点在面板内，避免与宿主主输入框
            // 的 ⌘Enter 发送快捷键冲突。
            const insidePanel = rootRef.current?.contains(event.target)
            const index = Number(event.key) - 1
            const title = ['苏格拉底式提问', '第一性原理', '双向钢人论证'][index]
            if (title) { event.preventDefault(); const choice = methodChoice(methods, title); if (choice) { setSelectedMethodId(choice.id); setMode('method'); setOpen(true) }; return }
            if (event.key === 'Enter' && open && insidePanel) { event.preventDefault(); if (mode === 'enhance') enhanceIntoInput(); else { const choice = methods.find(method => method.id === selectedMethodId); if (choice) void composeIntoInput(choice) }; return }
            if (event.key.toLowerCase() !== 'k') return
            event.preventDefault()
            openPanel()
          }
          window.addEventListener('keydown', onKeydown)
          return () => window.removeEventListener('keydown', onKeydown)
        }, [msgs.length, selected.length, open, methods, selectedMethodId, requirement, contextLevel, mode])
        React.useEffect(() => {
          if (!open) return
          const onPointerDown = event => {
            if (!rootRef.current?.contains(event.target)) setOpen(false)
          }
          window.addEventListener('pointerdown', onPointerDown)
          return () => window.removeEventListener('pointerdown', onPointerDown)
        }, [open])
        React.useEffect(() => {
          const move = event => {
            if (!drag.current) return
            const next = {
              x: Math.max(16, Math.min(window.innerWidth - 62, event.clientX - drag.current.dx)),
              y: Math.max(58, Math.min(window.innerHeight - 62, event.clientY - drag.current.dy)),
            }
            drag.current.moved = true
            setPosition(next)
          }
          const up = () => {
            if (!drag.current) return
            suppressClick.current = drag.current.moved
            try { window.localStorage.setItem(storageKey('position.v1'), JSON.stringify(position)) } catch {}
            drag.current = null
          }
          window.addEventListener('pointermove', move)
          window.addEventListener('pointerup', up)
          return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up) }
        }, [position])
        const toggle = id => setSelected(value => value.includes(id) ? value.filter(item => item !== id) : [...value, id])
        const activeMessages = msgs.filter(item => selected.includes(item.id)).reverse()
        const selectedChars = activeMessages.reduce((total, item) => total + item.text.length, 0)
        const selectedDraft = selectedConversationDraft(activeMessages)
        const canCompose = Boolean(requirement.trim() || selectedDraft.question)
        const selectedMethod = methods.find(method => method.id === selectedMethodId)
        const libraryMethod = libraryOpen ? selectedMethod : null
        const composeIntoInput = async choice => {
          if (!choice || !composer) return
          const source = contextLevel === 'question' ? [] : activeMessages
          if (!canCompose) { setNotice('请输入本次要求或问题；也可以选择一条用户消息作为问题。'); return }
          setLoading(true)
          try {
            const conversationDraft = selectedConversationDraft(source)
            const explicitRequirement = requirement.trim()
            const question = explicitRequirement || conversationDraft.question
            let facts = [explicitRequirement && conversationDraft.question ? `对话中的原始问题：${conversationDraft.question}` : '', conversationDraft.facts].filter(Boolean).join('\n')
            if (contextLevel === 'memory' && searchMemory) {
              const remembered = cleanContext(await searchMemory(question) || '')
              if (remembered) facts = [facts, `项目记忆：${remembered}`].filter(Boolean).join('\n')
            }
            const composed = await methodProvider.compose({ methodId: choice.id, question, facts, constraints: conversationDraft.constraints, options: conversationDraft.options })
            const next = withPrefix(draft, composed.prompt)
            setUndoDraft({ before: draft, after: next })
            composer.write(next)
            setMethodUsage(value => { const nextUsage = { ...value, [choice.id]: Number(value[choice.id] || 0) + 1 }; try { window.localStorage.setItem(storageKey('method-usage.v1'), JSON.stringify(nextUsage)) } catch {}; return nextUsage })
            setRecentMethodIds(value => { const nextRecent = [choice.id, ...value.filter(id => id !== choice.id)].slice(0, 3); try { window.localStorage.setItem(storageKey('recent-methods.v1'), JSON.stringify(nextRecent)) } catch {}; return nextRecent })
            setNotice(`已按“${choice.title}”${source.length ? `整理 ${source.length} 条消息并` : ''}填入输入框，可编辑后发送。`)
            setOpen(false)
          } catch (error) { setNotice(String(error?.message || error)) }
          finally { setLoading(false) }
        }
        const fillLibraryTemplate = async () => {
          if (!libraryMethod) return
          setLoading(true)
          try {
            const template = await methodProvider.getTemplate(libraryMethod.id)
            setUndoDraft({ before: draft, after: template.prompt })
            composer?.write(template.prompt)
            setNotice(`已将「${libraryMethod.title}」模板填入消息框。`)
            setOpen(false)
          } catch (error) { setNotice(String(error?.message || error)) }
          finally { setLoading(false) }
        }
        const adaptLibraryDraft = async () => {
          const source = draft.trim()
          if (!libraryMethod || !source) { setNotice('请先在输入框写下需要改造的原始请求。'); return }
          if (source.length > 3000) { setNotice(`草稿过长（${source.length} 字符），建议精简到 3000 字符以内再改造。`); return }
          if (!enhancer) { setNotice('未注入语义增强模型（enhancer），无法基于草稿改造。'); return }
          setLoading(true)
          try {
            const template = await methodProvider.getTemplate(libraryMethod.id)
            const body = await enhancer.enhance({ draft, extra: requirement, lang: detectLanguage(draft), kind: 'semantic', method: { title: libraryMethod.title, template: template.prompt } })
            setUndoDraft({ before: draft, after: body.prompt })
            composer?.write(body.prompt)
            setNotice(`已按「${libraryMethod.title}」用模型改造草稿，可在此撤销或对比原稿。`)
            setOpen(false)
          } catch (error) {
            if (error?.name === 'AbortError') setNotice('已取消草稿改造，输入框未改动。')
            else if (error?.timeout) setNotice(`${error.message}（可稍后重试）`)
            else setNotice(String(error?.message || error))
          }
          finally { setLoading(false) }
        }
        const cancelEnhance = () => { setNotice('正在取消语义增强…'); enhancer?.cancel() }
        const enhanceIntoInput = async () => {
          const source = draft.trim()
          if (!source) { setNotice('请先在输入框中写入原始请求。'); return }
          if (source.length > 3000) { setNotice(`草稿过长（${source.length} 字符），建议精简到 3000 字符以内再增强。`); return }
          const original = draft
          if (enhancementKind === 'semantic') {
            if (!enhancer) { setNotice('未注入语义增强模型（enhancer），仅支持轻量增强。'); return }
            setLoading(true)
            try {
              const body = await enhancer.enhance({ draft: original, extra: requirement, lang: detectLanguage(original), kind: 'semantic' })
              setUndoDraft({ before: original, after: body.prompt })
              composer?.write(body.prompt)
              setNotice(`语义增强完成${body.model ? `（${body.model}）` : ''}；草稿已替换，可在此撤销或对比原稿。`)
            } catch (error) {
              if (error?.name === 'AbortError') setNotice('已取消语义增强，草稿未改动。')
              else if (error?.timeout) setNotice(`${error.message}（可稍后重试）`)
              else setNotice(String(error?.message || error))
            }
            finally { setLoading(false) }
            return
          }
          const plan = planPromptEnhancement(original, requirement, methods)
          if (plan.tooShort) { setNotice('输入过短，未做增强，可直接发送。'); return }
          setUndoDraft({ before: original, after: plan.prompt })
          composer?.write(plan.prompt)
          setNotice(plan.method ? `已采用「${plan.label || plan.method}」做保守增强，可检查后直接发送。` : '已做最小化提示词整理，可检查后直接发送。')
          setOpen(false)
        }
        const common = ['苏格拉底式提问', '第一性原理', '双向钢人论证'].map(title => methodChoice(methods, title)).filter(Boolean)
        const recommended = recommendMethods(methods, requirement)
        const recentMethods = recentMethodIds.map(id => methods.find(method => method.id === id)).filter(Boolean)
        const libraryMatches = methods.filter(method => !librarySearch.trim() || `${method.title} ${method.purpose} ${method.tags}`.toLowerCase().includes(librarySearch.trim().toLowerCase()))
        const rankedCommon = [...common].sort((a, b) => Number(methodUsage[b.id] || 0) - Number(methodUsage[a.id] || 0))
        const panelAbove = position.y > 370
        const panelMaxHeight = Math.max(250, Math.min(640, panelAbove ? position.y - 82 : window.innerHeight - position.y - 82))
        const buttonStyle = { width: '52px', height: '52px', padding: 0, border: `1px solid ${C.tealLineStrong}`, borderRadius: '50%', background: C.teal, boxShadow: '0 10px 24px rgba(15,118,110,.26)', color: C.surface, cursor: 'grab', fontSize: '20px', fontWeight: 800 }
        const fan = common.map((method, index) => h('button', { key: method.id, title: `选择：${method.title}`, disabled: loading, onClick: () => { setSelectedMethodId(method.id); setMode('method'); setOpen(true) }, style: { position: 'absolute', right: `${-8 + index * 48}px`, bottom: panelAbove ? `${62 + Math.abs(index - 1) * 25}px` : 'auto', top: panelAbove ? 'auto' : `${62 + Math.abs(index - 1) * 25}px`, width: '42px', height: '42px', overflow: 'hidden', border: `1px solid ${selectedMethodId === method.id ? C.teal : C.tealLine}`, borderRadius: '50%', background: selectedMethodId === method.id ? C.tealTint : C.surface, boxShadow: '0 6px 16px rgba(17,38,60,.14)', color: C.teal, cursor: 'pointer', fontSize: '10px', fontWeight: 800, lineHeight: 1.15, animation: 'mc-fan-in .22s ease both', animationDelay: `${index * 35}ms` } }, method.title.slice(0, 4)))
        const methodItems = showAllMethods ? methods : rankedCommon
        const methodCards = h('div', { style: { display: 'grid', gap: '7px' } }, methodItems.map(method => h('button', { key: method.id, className: 'mc-btn', disabled: loading, onClick: () => setSelectedMethodId(method.id), style: { width: '100%', padding: '10px 11px', border: `1px solid ${selectedMethodId === method.id ? C.tealLineActive : C.tealLine}`, borderRadius: '10px', background: selectedMethodId === method.id ? C.tealTintDeep : C.surface, textAlign: 'left', color: C.ink, cursor: 'pointer' } }, [h('div', { key: 'title', style: { display: 'flex', justifyContent: 'space-between', gap: '10px', fontSize: '12px', fontWeight: 800 } }, [h('span', { key: 'name' }, method.title), selectedMethodId === method.id ? h('span', { key: 'picked', style: { color: C.teal } }, '已选择') : recommended.includes(method) ? h('span', { key: 'recommended', style: { color: C.teal } }, '推荐') : null]), h('div', { key: 'purpose', style: { marginTop: '3px', color: C.slate, fontSize: '11px', lineHeight: 1.4 } }, method.purpose || '按该方法组织分析。')])) )
        const structurePreview = selectedMethod ? h('div', { style: { marginTop: '9px', padding: '9px 10px', border: `1px dashed ${C.tealLine}`, borderRadius: '9px', background: C.surfaceAlt, color: C.slate, fontSize: '11px', lineHeight: 1.5 } }, `组装预览：问题 · ${contextLevel === 'question' ? '仅问题' : contextLevel === 'conversation' ? `已选对话 ${activeMessages.length} 条` : `已选对话 ${activeMessages.length} 条 + 项目记忆`} · ${selectedMethod.title} 的分析结构`) : null
        const methodFooter = h('div', { style: { position: 'sticky', bottom: '-14px', margin: '10px -14px -14px', padding: '11px 14px 14px', borderTop: `1px solid ${C.tealLine}`, background: C.surface } }, [selectedMethod ? h('div', { key: 'outcome', style: { marginBottom: '9px', padding: '9px 10px', border: `1px solid ${C.tealLine}`, borderRadius: '9px', background: C.tealTint, fontSize: '12px', lineHeight: 1.5 } }, [h('strong', { key: 'title', style: { color: C.teal } }, `将使用「${selectedMethod.title}」`), h('div', { key: 'body', style: { marginTop: '3px', color: C.slate } }, selectedMethod.outcome || (selectedMethod.mode === 'guided' ? '先通过追问澄清问题，再推进下一步。' : '生成结构化分析、风险与下一步行动。'))]) : null, h('button', { key: 'generate', className: 'mc-btn', disabled: loading || !canCompose || !selectedMethod, onClick: () => composeIntoInput(selectedMethod), style: { width: '100%', padding: '11px 14px', border: 0, borderRadius: '9px', background: loading || !canCompose || !selectedMethod ? C.tealLine : C.teal, color: loading || !canCompose || !selectedMethod ? C.muted : C.surface, cursor: loading || !canCompose || !selectedMethod ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '7px' } }, loading ? h(Spinner, { key: 'spin', text: '正在组装…' }) : selectedMethod ? '生成并填入消息框' : '请选择一种方法')])
        const enhancementPlan = planPromptEnhancement(draft, requirement, methods)
        const enhancementLang = detectLanguage(draft || '')
        const strategyNode = draft.trim() ? enhancementKind === 'semantic'
              ? [h('div', { key: 'meta', style: { marginBottom: '3px' } }, `将把当前 ${draft.trim().length} 个字符交给模型改写。`), h('div', { key: 'lang', style: { color: C.muted } }, `检测语言：${enhancementLang === 'en' ? '英文（输出与输入一致）' : enhancementLang === 'mixed' ? '中英混合（输出与输入一致）' : '中文'}。`), draft.trim().length > 3000 ? h('div', { key: 'warn', style: { marginTop: '3px', color: C.amber } }, '草稿超过 3000 字符，建议精简后再增强。') : null]
              : [h('strong', { key: 'method', style: { color: C.teal } }, enhancementPlan.tooShort ? '输入过短，直接使用原文' : enhancementPlan.label ? `拟采用：${enhancementPlan.label}` : '拟采用：轻量整理'), h('div', { key: 'reason', style: { marginTop: '3px' } }, enhancementPlan.reason), enhancementPlan.signals?.length ? h('div', { key: 'signals', style: { marginTop: '3px' } }, `识别信号：${enhancementPlan.signals.join('、')}`) : null, enhancementPlan.conflicts?.length ? h('div', { key: 'conflicts', style: { marginTop: '3px', color: C.amber } }, `方法冲突：${enhancementPlan.conflicts.map(item => `${item.label || item.title}（命中“${item.signals.join('、')}”）`).join('；')}，采用「${enhancementPlan.label || enhancementPlan.method}」。`) : null, h('div', { key: 'size', style: { marginTop: '3px', color: C.muted } }, `预计 ${enhancementPlan.prompt.length} 字符。`)]
              : '当前输入框为空，请先写下原始请求。'
        const enhancementKinds = enhancer ? [['light', '轻量 · 零 Token'], ['semantic', '语义 · 模型']] : [['light', '轻量 · 零 Token']]
        const enhancerPanel = h('div', { key: 'enhancer', style: { marginTop: '12px', padding: '12px', border: `1px solid ${C.tealLine}`, borderRadius: '11px', background: C.tealTint } }, [h('strong', { key: 'title', style: { fontSize: '13px', color: C.ink } }, '增强当前输入框提示词'), h('div', { key: 'kind', style: { display: 'grid', gridTemplateColumns: `repeat(${enhancementKinds.length},minmax(0,1fr))`, gap: '6px', marginTop: '9px' } }, enhancementKinds.map(([id, label]) => h('button', { key: id, className: 'mc-btn', onClick: () => setEnhancementKind(id), style: { padding: '7px', border: `1px solid ${enhancementKind === id ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: enhancementKind === id ? C.tealTintDeep : C.surface, color: enhancementKind === id ? C.teal : C.slate, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, label))), h('div', { key: 'description', style: { marginTop: '7px', color: C.slate, fontSize: '12px', lineHeight: 1.5 } }, enhancementKind === 'semantic' ? '把草稿交给模型独立改写；只发送当前草稿与补充要求，不读取对话参考。' : '本地保守增强，最多采用一种合适方法，不产生额外模型调用。'), h('div', { key: 'strategy', style: { marginTop: '9px', padding: '9px 10px', borderRadius: '8px', background: C.surface, color: C.slate, fontSize: '11px', lineHeight: 1.5 } }, strategyNode), h('button', { key: 'enhance', className: 'mc-btn', disabled: !draft.trim() || (loading && enhancementKind !== 'semantic'), onClick: loading && enhancementKind === 'semantic' ? cancelEnhance : enhanceIntoInput, style: { width: '100%', marginTop: '10px', padding: '11px 14px', border: 0, borderRadius: '9px', background: draft.trim() && !loading ? C.teal : loading && enhancementKind === 'semantic' ? C.amberLine : C.tealLine, color: draft.trim() && !loading ? C.surface : loading && enhancementKind === 'semantic' ? C.amber : C.muted, cursor: (draft.trim() && !loading) || (loading && enhancementKind === 'semantic') ? 'pointer' : 'not-allowed', fontSize: '13px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '7px' } }, loading && enhancementKind === 'semantic' ? h(Spinner, { key: 'spin', text: '取消增强' }) : loading ? h(Spinner, { key: 'spin', text: '正在增强…' }) : '应用增强到消息框')])
        const contextLevels = [['question', '仅问题'], ...(msgs.length ? [['conversation', '加对话']] : []), ...(searchMemory ? [['memory', '加项目记忆']] : [])]
        const panel = open ? h('section', { className: 'mc-scroll', style: { position: 'absolute', right: 0, ...(panelAbove ? { bottom: '66px' } : { top: '66px' }), width: 'min(440px,calc(100vw - 32px))', maxHeight: `${panelMaxHeight}px`, overflowY: 'auto', overscrollBehavior: 'contain', padding: '14px', border: `1px solid ${C.tealLine}`, borderRadius: '15px', background: C.surface, boxShadow: '0 20px 50px rgba(17,38,60,.20)', color: C.ink, zIndex: 30, animation: 'mc-pop .2s ease' } }, [
              h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'start' } }, [h('div', { key: 'copy' }, [h('strong', { key: 'title', style: { fontSize: '14px' } }, '对话增强器'), h('div', { key: 'sub', style: { marginTop: '3px', color: C.muted, fontSize: '12px', lineHeight: 1.45 } }, libraryOpen ? '从提示词库选择模板：可直接填入消息框，或基于当前草稿调用模型按该方法改造。' : mode === 'enhance' ? '把当前输入框提示词做增强或改写，只填入消息框，不会自动发送。' : '写问题即可直接处理；也可选择对话消息作为额外参考。生成内容只填入消息框，不会自动发送。')]), h('button', { key: 'close', onClick: () => setOpen(false), style: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '26px', height: '26px', padding: 0, border: 0, borderRadius: '8px', background: 'transparent', color: C.muted, cursor: 'pointer' }, 'aria-label': '关闭' }, h(Icon, { key: 'ic', name: 'close', size: 16 }))]),
              libraryOpen || mode === 'enhance' ? null : h('div', { key: 'summary', style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', margin: '12px 0 5px', padding: '9px 10px', borderRadius: '9px', background: selectedChars > 1600 ? C.amberTint : C.tealTint, color: selectedChars > 1600 ? C.amber : C.teal, fontSize: '12px', fontWeight: 700 } }, [h('span', { key: 'count' }, activeMessages.length ? `已选 ${activeMessages.length} 条 · 约 ${selectedChars} 字符${selectedChars > 1600 ? ' · 建议精简' : ''}` : '未选择对话 · 可直接写问题'), msgs.length ? h('button', { key: 'recent', onClick: () => setSelected(msgs.slice(0, 4).map(item => item.id)), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '12px', fontWeight: 700 } }, '选择最近 4 条') : null]),
              undoDraft ? h('div', { key: 'undo-area', style: { marginTop: '5px' } }, [h('button', { key: 'undo', onClick: () => { if (draft !== undoDraft.after) { setUndoDraft(null); setNotice('消息框内容已变化，无法撤销到之前状态。'); return } composer?.write(undoDraft.before); setUndoDraft(null); setNotice('已撤销上一次填入。') }, style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, '撤销上一次填入'), h('details', { key: 'orig', style: { marginTop: '4px' } }, [h('summary', { style: { color: C.muted, fontSize: '11px', cursor: 'pointer', fontWeight: 700 } }, '查看原稿'), h('div', { style: { marginTop: '4px', padding: '8px', border: `1px solid ${C.line}`, borderRadius: '7px', background: C.surfaceAlt, color: C.slate, fontSize: '11px', lineHeight: 1.5, whiteSpace: 'pre-wrap', maxHeight: '120px', overflow: 'auto' } }, undoDraft.before || '（原稿为空）')])]) : null,
              h('div', { key: 'mode', style: { display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: '6px', marginTop: '10px' } }, [['method', '选择方法'], ['enhance', '增强提示词']].map(([id, label]) => h('button', { key: id, className: 'mc-btn', onClick: () => { setMode(id); setLibraryOpen(false) }, style: { padding: '8px', border: `1px solid ${mode === id && !libraryOpen ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: mode === id && !libraryOpen ? C.tealTintDeep : C.surface, color: mode === id && !libraryOpen ? C.teal : C.slate, cursor: 'pointer', fontSize: '12px', fontWeight: 800 } }, label)).concat(h('button', { key: 'library', className: 'mc-btn', onClick: () => { const next = !libraryOpen; setMode(next ? 'library' : 'method'); setLibraryOpen(next) }, style: { padding: '8px', border: `1px solid ${libraryOpen ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: libraryOpen ? C.tealTintDeep : C.surface, color: libraryOpen ? C.teal : C.slate, cursor: 'pointer', fontSize: '12px', fontWeight: 800 } }, '提示词库'))),
              libraryOpen ? h('div', { key: 'library-panel', style: { marginTop: '10px', padding: '10px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.tealTint } }, [h('input', { key: 'search', value: librarySearch, onChange: event => setLibrarySearch(event.target.value), placeholder: '搜索方法、用途或标签', style: { ...workbenchStyle.input, padding: '8px 9px', fontSize: '12px' } }), libraryFavorites.length ? h('div', { key: 'favorites', style: { marginTop: '8px', color: C.slate, fontSize: '11px' } }, [h('strong', { key: 'label', style: { color: C.teal } }, '我的收藏：'), ' ', libraryFavorites.map(id => methods.find(method => method.id === id)).filter(Boolean).map(method => h('button', { key: method.id, className: 'mc-btn', onClick: () => { setSelectedMethodId(method.id); setMode('method'); setLibraryOpen(false) }, style: { margin: '3px', border: `1px solid ${C.tealLine}`, borderRadius: '999px', background: C.surface, color: C.teal, cursor: 'pointer', padding: '3px 6px', fontSize: '10px' } }, method.title))]) : null, libraryHistory.length ? h('div', { key: 'history', style: { marginTop: '7px', color: C.slate, fontSize: '11px' } }, [h('strong', { key: 'label', style: { color: C.teal } }, '最近生成：'), ' ', libraryHistory.slice(0, 3).map(item => h('button', { key: `${item.id}:${item.at}`, className: 'mc-btn', onClick: () => { setSelectedMethodId(item.id); setMode('method'); if (item.question) setRequirement(item.question); setLibraryOpen(false) }, style: { margin: '3px', border: `1px solid ${C.tealLine}`, borderRadius: '999px', background: C.surface, color: C.teal, cursor: 'pointer', padding: '3px 6px', fontSize: '10px' } }, item.title || '未命名方法'))]) : null, h('div', { key: 'matches', style: { display: 'grid', gap: '5px', maxHeight: '180px', overflowY: 'auto', marginTop: '8px' } }, libraryMatches.map(method => h('button', { key: method.id, className: 'mc-btn', onClick: () => { setSelectedMethodId(method.id); setMode('method'); setLibraryOpen(false) }, style: { padding: '8px 9px', border: `1px solid ${method.id === selectedMethodId ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: C.surface, textAlign: 'left', color: C.ink, cursor: 'pointer', fontSize: '11px' } }, [h('strong', { key: 'title' }, method.title), h('span', { key: 'meta', style: { marginLeft: '6px', color: C.muted } }, method.purpose || method.category)])))] ) : null,
              libraryOpen ? h('div', { key: 'library-actions', style: { marginTop: '9px', padding: '10px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.surface } }, [h('select', { key: 'select', value: selectedMethodId, onChange: event => setSelectedMethodId(event.target.value), style: { width: '100%', padding: '8px', border: `1px solid ${C.line}`, borderRadius: '8px', background: C.surface, fontSize: '12px' } }, [h('option', { key: 'empty', value: '' }, '选择一个提示词…'), ...libraryMatches.map(method => h('option', { key: method.id, value: method.id }, method.title))]), libraryMethod ? h('div', { key: 'selected', style: { marginTop: '7px', color: C.slate, fontSize: '11px', lineHeight: 1.4 } }, `已选择「${libraryMethod.title}」：可直接填充模板，或基于当前草稿改造。`) : null, h('div', { key: 'buttons', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px', marginTop: '9px' } }, [h('button', { key: 'fill', className: 'mc-btn', disabled: !libraryMethod || loading, onClick: fillLibraryTemplate, style: { ...workbenchStyle.action, opacity: libraryMethod ? 1 : .55 } }, '填充模板'), h('button', { key: 'adapt', className: 'mc-btn', disabled: !libraryMethod || !draft.trim() || loading || !enhancer, onClick: adaptLibraryDraft, style: { ...workbenchStyle.action, opacity: libraryMethod && draft.trim() && enhancer ? 1 : .55 } }, loading ? h(Spinner, { key: 'spin', text: '改造中…' }) : '基于草稿改造')])]) : null,
              h('label', { key: 'requirement', style: { display: libraryOpen ? 'none' : 'block', marginTop: '10px', marginBottom: '9px' } }, [h('span', { key: 'label', style: { display: 'block', marginBottom: '5px', color: C.muted, fontSize: '11px', fontWeight: 800 } }, mode === 'enhance' ? '补充增强要求（可选）' : '本次要求 / 问题'), h('textarea', { key: 'input', value: requirement, onChange: event => setRequirement(event.target.value), placeholder: mode === 'enhance' ? '例如：使用简洁中文，先给结论，再列出实施步骤。' : '例如：请重点评估风险，并给出可执行的下一步。', style: { ...workbenchStyle.input, minHeight: '58px', resize: 'vertical', fontSize: '12px', lineHeight: 1.45 } })]),
              h('div', { key: 'context-level', style: { display: libraryOpen || mode === 'enhance' ? 'none' : 'grid', gridTemplateColumns: `repeat(${contextLevels.length},minmax(0,1fr))`, gap: '6px', marginBottom: '9px' } }, contextLevels.map(([id, label]) => h('button', { key: id, className: 'mc-btn', onClick: () => setContextLevel(id), style: { padding: '7px 5px', border: `1px solid ${contextLevel === id ? C.tealLineActive : C.tealLine}`, borderRadius: '8px', background: contextLevel === id ? C.tealTintDeep : C.surface, color: contextLevel === id ? C.teal : C.slate, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, label))),
              msgs.length ? h('details', { key: 'context', style: { display: libraryOpen || mode === 'enhance' ? 'none' : 'block', marginTop: '8px', paddingTop: '9px', borderTop: `1px solid ${C.divide}` } }, [h('summary', { key: 'summary', style: { color: C.muted, fontSize: '12px', fontWeight: 700, cursor: 'pointer' } }, activeMessages.length ? `可选：调整已选的 ${activeMessages.length} 条对话参考` : '可选：选择对话作为参考'), activeMessages.length ? h('div', { key: 'classification', style: { color: C.muted, fontSize: '11px', lineHeight: 1.45, margin: '9px 0 8px' } }, `自动归类：${selectedDraft.question ? '问题' : '—'} · ${selectedDraft.facts ? '事实' : '—'} · ${selectedDraft.constraints ? '约束' : '—'} · ${selectedDraft.options ? '方案' : '—'}`) : null, h('div', { key: 'privacy', style: { color: C.muted, fontSize: '11px', lineHeight: 1.45, margin: '9px 0 8px' } }, '仅展示用户与助手文本；工具调用、工具结果和代码块不会进入此面板。'), h('div', { key: 'messages', style: { display: 'grid', gap: '6px', maxHeight: '210px', overflow: 'auto', paddingRight: '2px' } }, msgs.map(item => h('label', { key: item.id, style: { display: 'grid', gridTemplateColumns: '18px minmax(0,1fr)', gap: '8px', padding: '8px', border: `1px solid ${selected.includes(item.id) ? C.tealLineStrong : C.line}`, borderRadius: '9px', background: selected.includes(item.id) ? C.tealTint : C.surface, cursor: 'pointer' } }, [h('input', { key: 'check', type: 'checkbox', checked: selected.includes(item.id), onChange: () => toggle(item.id), style: { marginTop: '2px', accentColor: C.teal } }), h('div', { key: 'text' }, [h('div', { key: 'role', style: { color: item.role === 'user' ? C.blue : C.teal, fontSize: '11px', fontWeight: 800 } }, item.role === 'user' ? '你的消息' : '助手消息'), h('div', { key: 'body', style: { marginTop: '2px', color: C.slate, fontSize: '12px', lineHeight: 1.45 } }, `${cleanSummary(item.text)}${item.truncated ? ' …（长消息已截断）' : ''}`)])])))]) : null,
              mode === 'enhance' ? enhancerPanel : null,
              h('div', { key: 'methods', style: { display: mode === 'method' ? 'block' : 'none', marginTop: '12px', paddingTop: '10px', borderTop: `1px solid ${C.divide}` } }, [h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px', marginBottom: '4px' } }, [h('div', { key: 'label', style: { color: C.muted, fontSize: '11px', fontWeight: 800 } }, showAllMethods ? '全部思考方法' : '常用思考方法'), h('button', { key: 'toggle', disabled: loading, onClick: () => setShowAllMethods(value => !value), style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, showAllMethods ? '返回常用 3 个' : `全部方法（${methods.length}）`)]), h('div', { key: 'tip', style: { marginBottom: '8px', color: C.muted, fontSize: '11px', lineHeight: 1.4 } }, requirement.trim() && recommended.length ? `推荐：${recommended.map(method => method.title).join('、')}；常用三种方法始终可选。` : '默认提供三种常用方法；也可以展开全部方法。'), recentMethods.length ? h('div', { key: 'recent', style: { display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px' } }, recentMethods.map(method => h('button', { key: method.id, className: 'mc-btn', onClick: () => setSelectedMethodId(method.id), style: { border: `1px solid ${C.tealLine}`, borderRadius: '999px', background: C.surface, color: C.teal, cursor: 'pointer', padding: '4px 7px', fontSize: '10px', fontWeight: 700 } }, `最近：${method.title}`))) : null, methodCards, structurePreview, methodFooter]),
              notice ? h('div', { key: 'notice', style: { marginTop: '10px', color: C.teal, fontSize: '12px', lineHeight: 1.45 } }, notice) : null,
            ]) : null
        return h('div', { ref: rootRef, style: { position: 'fixed', left: `${position.x}px`, top: `${position.y}px`, zIndex: 30 } }, [h(GlobalStyle, { key: 'gcss' }), h('div', { key: 'fans', style: { position: 'relative' } }, open ? fan : null), h('button', { key: 'enhance-shortcut', type: 'button', className: 'mc-btn', onClick: () => { setMode('enhance'); setOpen(true) }, title: '增强提示词', style: { position: 'absolute', right: '58px', top: '5px', width: '36px', height: '36px', padding: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${C.tealLine}`, borderRadius: '50%', background: C.surface, color: C.teal, boxShadow: '0 4px 12px rgba(17,38,60,.12)', cursor: 'pointer', fontSize: '16px', fontWeight: 800 } }, h(Icon, { key: 'ic', name: 'wand', size: 16 })), h('button', { key: 'launcher', type: 'button', className: 'mc-fab', onPointerDown: event => { suppressClick.current = false; drag.current = { dx: event.clientX - position.x, dy: event.clientY - position.y, moved: false } }, onClick: () => { if (suppressClick.current) { suppressClick.current = false; return } openPanel() }, style: buttonStyle, title: '对话增强器（⌘K）', 'aria-label': '打开对话增强器' }, h(Icon, { key: 'ic', name: 'sparkles', size: 22 })), panel])
      }

      /* ================= 独立插件 glue：DSH 插槽注册 + 默认 adapter 装配 ================= */
      // 独立 DSH 插件 glue —— 在工厂闭包内执行，可用闭包内的全部 dsh-promptkit 符号。
      // 职责：把 PromptStudio / QuickEnhancer 以 DSH 插槽形式注册，并用默认 adapter 装配。
      //
      // 配置（可选，用于语义增强）：
      //   window.DSH_PROMPTKIT_CONFIG = { baseUrl, apiKey, model }
      //   或 localStorage['dsh-promptkit.config.v1'] = JSON 同结构
      // 未配置时语义增强按钮隐藏（组件按 enhancer 可选处理），方法工坊/模板/组合全部本地可用。

      const promptkitConfig = (() => {
        try {
          return { ...(window.DSH_PROMPTKIT_CONFIG || {}), ...JSON.parse(window.localStorage.getItem('dsh-promptkit.config.v1') || '{}') }
        } catch { return {} }
      })()

      const promptkitMethodProvider = new StaticMethodProvider()

      const promptkitEnhancer = promptkitConfig.baseUrl && promptkitConfig.apiKey
        ? new OpenAIEnhancer({ baseUrl: promptkitConfig.baseUrl, apiKey: promptkitConfig.apiKey, model: promptkitConfig.model || 'gpt-4o-mini' })
        : null

      // 桥接 DSH 会话输入框（conversation.input.right 注入的 props）为 Composer 接口
      class DshDraftComposer {
        constructor(input, inputActions) { this.input = input; this.inputActions = inputActions; this.listeners = new Set() }
        getDraft() { return this.input?.draft ?? '' }
        write(text) { this.inputActions?.setDraft(String(text ?? '')) }
        onChange(cb) { this.listeners.add(cb); return () => this.listeners.delete(cb) }
        notify(draft) { for (const cb of this.listeners) cb(draft) }
      }

      // 快捷助手宿主：把 DSH 注入的 props 翻译为组件 deps
      function PromptkitQuickActionHost({ sessionId, useSession, inputActions, input }) {
        const snapshot = useSession(value => value)
        const messages = React.useMemo(() => conversationMessages(snapshot), [snapshot?.nodes])
        const composer = React.useMemo(() => new DshDraftComposer(input, inputActions), [input, inputActions])
        React.useEffect(() => { composer.notify(input?.draft ?? '') }, [input?.draft, composer])
        return h(QuickEnhancer, { methodProvider: promptkitMethodProvider, composer, enhancer: promptkitEnhancer, messages })
      }

      // 方法工坊宿主：conversation.view 视图，onSend 走当前会话
      function PromptkitStudioHost({ sessionId, onSend }) {
        return h(PromptStudio, { methodProvider: promptkitMethodProvider, onSend })
      }

      const promptkitApply = ctx => ctx.slots.inject('conversation.view', () => {
        const studio = [
          {
            name: 'conversation.view',
            id: 'dsh-promptkit-studio',
            order: 17,
            label: () => '方法工坊',
            inject: sessionId => {
              const session = ctx.sessions.binding(sessionId)?.session
              if (!session) throw new Error('dsh-promptkit: session unavailable')
              return { sessionId, onSend: text => session.prompt([{ type: 'text', text }], 'queue') }
            },
          },
          PromptkitStudioHost,
        ]
        const disposers = [
          ctx.slots.register(studio[0], studio[1]),
          ctx.slots.inject('conversation.input.right', () =>
            ctx.slots.register({ name: 'conversation.input.right', id: 'dsh-promptkit-quick-action', order: 85, label: () => '快捷助手' }, PromptkitQuickActionHost)),
        ]
        return () => disposers.forEach(dispose => dispose?.())
      })

    return { inject: ['slots', 'sessions'], apply: promptkitApply }
  },
})
