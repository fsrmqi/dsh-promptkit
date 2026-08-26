import React from 'react'
import { h, C, S, workbenchStyle, GlobalStyle, Spinner, Icon, Panel } from './foundation.js'
import { list, cleanSummary, cleanContext, selectedConversationDraft } from '../lib/utils.js'
import { withPrefix } from '../core/composer.js'

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
  const [showOptional, setShowOptional] = React.useState(false)
  React.useEffect(() => {
    let alive = true
    setLoadingMethods(true)
    methodProvider.list().then(value => { if (alive) setMethods(list(value)) }).catch(error => { if (alive) setMessage(String(error?.message || error)) }).finally(() => { if (alive) setLoadingMethods(false) })
    methodProvider.getFavorites?.().then(value => { if (alive) setFavorites(list(value)) }).catch(() => {})
    methodProvider.getHistory?.().then(value => { if (alive) setHistory(list(value)) }).catch(() => {})
    const offHistory = methodProvider.onHistoryChange?.(value => { if (alive) setHistory(list(value)) })
    return () => { alive = false; offHistory?.() }
  }, [methodProvider])
  const categories = ['全部', ...Array.from(new Set(methods.map(item => item.category))).filter(Boolean)]
  const pinnedSet = new Set(['苏格拉底式提问', '第一性原理', '双向钢人论证'])
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
  const restoreRecent = item => {
    setMethodId(item.id)
    setQuestion(item.question || '')
    setPreview(null)
    setMessage('正在重新生成预览…')
    methodProvider.compose({ methodId: item.id, question: item.question || '', facts, constraints, options })
      .then(value => { setPreview(value); setMessage('已恢复最近一次问题，并重新生成预览。') })
      .catch(error => setMessage(String(error?.message || error)))
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
  const previewPanel = preview ? h(Panel, { key: 'preview', title: '发送前预览', hint: `${preview.estimated_chars} 字符` }, h('div', { style: { padding: '16px' } }, [
    h('pre', { key: 'text', style: { margin: 0, whiteSpace: 'pre-wrap', fontSize: '12px', lineHeight: 1.6, color: C.slate, maxHeight: '300px', overflow: 'auto', background: C.paper, padding: '12px', borderRadius: '6px', border: `1px solid ${C.divide}` } }, preview.prompt),
    h('div', { key: 'actions', style: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '14px' } }, [
      onSend ? h('button', { key: 'send', className: 'pk-action-primary', onClick: () => onSend(preview.prompt).then(() => setMessage('已发送。')).catch(error => setMessage(String(error?.message || error))), style: workbenchStyle.actionPrimary }, '发送到当前会话') : null,
      composer ? h('button', { key: 'write', onClick: writePreview, style: { ...workbenchStyle.action, background: C.surface, color: C.ink } }, '写入输入框') : null,
      h('button', { key: 'copy', onClick: copyPreview, style: { ...workbenchStyle.action, background: C.surface, color: C.muted } }, '复制 Prompt'),
    ]),
  ])) : null
  // 紧凑左栏单行列表渲染
  const methodList = h('ul', {
    key: 'list',
    style: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      borderTop: `1px solid ${C.divide}`,
      borderBottom: `1px solid ${C.divide}`,
    },
  }, visibleMethods.map(item => {
    const selected = item.id === methodId
    const isPinned = pinnedSet.has(item.title)
    const isFav = favorites.includes(item.id)
    return h('li', { key: item.id, style: { borderBottom: `1px solid ${C.divide}` } },
      h('button', {
        className: 'pk-btn',
        onClick: () => { setMethodId(item.id); setPreview(null); setMessage('') },
        style: {
          width: '100%',
          padding: '9px 12px',
          border: 0,
          borderLeft: `2px solid ${selected ? C.teal : 'transparent'}`,
          background: selected ? C.tealTint : 'transparent',
          color: C.ink,
          textAlign: 'left',
          cursor: 'pointer',
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: '10px',
          alignItems: 'center',
        }
      }, [
        h('span', {
          key: 'title',
          style: {
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: 500,
            color: selected ? C.teal : C.ink,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }
        }, [
          isPinned ? h('span', { key: 'pin', style: { fontSize: '10px', color: C.muted, fontWeight: 400 }, title: '常用' }, '常用') : null,
          h('span', { key: 't', style: { overflow: 'hidden', textOverflow: 'ellipsis' } }, item.title),
          isFav ? h(Icon, { key: 'fav', name: 'star', size: 12, style: { color: C.teal, fill: C.teal, flexShrink: 0 }, title: '已收藏', 'aria-label': '已收藏' }) : null,
        ]),
        h('span', { key: 'purpose', style: { fontSize: '11px', color: C.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' } }, item.purpose || ''),
      ])
    )
  }))
  const historyList = history.length ? h(Panel, { key: 'history', title: '最近生成', hint: `${history.length} 条` },
    h('ul', { style: { listStyle: 'none', padding: '4px 14px 12px', margin: 0, display: 'grid', gap: '2px' } },
      history.slice(0, 5).map(item => h('li', { key: `${item.id}:${item.at}`, style: { borderBottom: `1px solid ${C.divide}` } },
        h('button', {
          onClick: () => restoreRecent(item),
          style: {
            width: '100%',
            padding: '8px 0',
            border: 0,
            background: 'transparent',
            color: C.slate,
            textAlign: 'left',
            cursor: 'pointer',
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: '10px',
            fontSize: '12px',
          }
        }, [
          h('span', { key: 't', style: { fontWeight: 500, color: C.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, item.title || ''),
          h('span', { key: 'q', style: { color: C.slate, fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, item.question || '未命名问题'),
          h('span', { key: 'time', style: { color: C.muted, fontSize: '11px', gridColumn: '1 / -1', textAlign: 'right' } }, item.at ? new Date(item.at).toLocaleTimeString() : ''),
        ])
      ))
    )
  ) : null
  return h('main', { style: { ...S.page, width: '100%', boxSizing: 'border-box', background: 'transparent', margin: '0 auto' } }, [
    h(GlobalStyle, { key: 'gcss' }),
    h('header', { key: 'header', style: { marginBottom: '20px', paddingBottom: '14px', borderBottom: `1px solid ${C.divide}` } }, [
      h('div', { key: 't-row', style: { display: 'flex', alignItems: 'baseline', gap: '12px', justifyContent: 'space-between' } }, [
        h('h1', { key: 'title', style: { ...S.title, margin: 0 } }, '方法工坊'),
        h('span', { key: 'count', style: { fontSize: '12px', color: C.muted } }, `${visibleMethods.length} / ${methods.length}`)
      ]),
      h('p', { key: 'lead', style: { ...S.lead, margin: '6px 0 0' } }, '选择方法,用精简的问题、事实和约束生成可编辑 Prompt。')
    ]),
    loadingMethods ? h('div', { key: 'loading', style: S.empty }, h(Spinner, { text: '正在读取方法库…' })) : h('div', {
      key: 'layout',
      style: {
        display: 'grid',
        gridTemplateColumns: 'minmax(280px, 320px) minmax(0, 1fr)',
        gap: '36px',
        alignItems: 'start',
      }
    }, [
      h('aside', { key: 'methods', style: { position: 'sticky', top: '14px' } }, [
        h('div', { key: 'filter', style: { display: 'grid', gap: '8px', marginBottom: '14px' } }, [
          h('input', { key: 'search', value: search, onChange: event => setSearch(event.target.value), placeholder: '搜索方法、用途或标签', style: { ...workbenchStyle.input, padding: '8px 10px', fontSize: '12px' } }),
          h('select', { key: 'select', value: category, onChange: event => setCategory(event.target.value), style: { width: '100%', padding: '8px 10px', border: `1px solid ${C.line}`, borderRadius: '6px', background: C.surface, color: C.ink, fontSize: '12px' } }, categories.map(value => h('option', { key: value, value }, value))),
        ]),
        methodList,
      ]),
      h('section', { key: 'form', style: { display: 'grid', gap: '20px', minWidth: 0 }, onKeyDown: event => { if ((event.metaKey || event.ctrlKey) && event.key === 'Enter' && method && question.trim()) { event.preventDefault(); void compose() } } }, [
        h('div', { key: 'header', style: { borderBottom: `1px solid ${C.divide}`, paddingBottom: '14px' } }, [
          h('div', { key: 't-row', style: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px' } }, [
            h('h2', { key: 'title', style: { ...S.title, fontSize: '17px', margin: 0 } }, method?.title || '方法输入'),
            h('span', { key: 'category', style: { fontSize: '12px', color: C.muted } }, method ? `${method.category} · ${method.mode === 'guided' ? '会逐步追问' : '会一次性分析'}` : ''),
          ]),
          method?.purpose ? h('p', { key: 'purpose', style: { margin: '8px 0 0', fontSize: '13px', color: C.slate, lineHeight: 1.55 } }, method.purpose) : null,
        ]),
        h('div', { key: 'tools', style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } }, [
          messages?.length ? h('button', { key: 'extract', onClick: () => setExtracted(selectedConversationDraft(messages)), style: { ...workbenchStyle.action, background: C.surface, color: C.ink, display: 'inline-flex', alignItems: 'center', gap: '5px' } }, [h(Icon, { key: 'ic', name: 'extract', size: 13 }), extracted ? '重新提取' : '从对话提取']) : null,
          method ? h('button', { key: 'favorite', onClick: () => toggleFavorite(method.id), style: { ...workbenchStyle.action, background: isFav(method, favorites) ? C.tealTintDeep : C.surface, color: isFav(method, favorites) ? C.teal : C.ink, display: 'inline-flex', alignItems: 'center', gap: '5px' } }, [h(Icon, { key: 'ic', name: 'star', size: 13, style: isFav(method, favorites) ? { fill: C.teal } : undefined }), isFav(method, favorites) ? '已收藏' : '收藏方法']) : null,
          h('button', { key: 'clear', onClick: () => { setQuestion(''); setFacts(''); setConstraints(''); setOptions(''); setExtracted(null); setPreview(null) }, style: { ...workbenchStyle.action, background: C.surface, color: C.muted, display: 'inline-flex', alignItems: 'center', gap: '5px' } }, [h(Icon, { key: 'ic', name: 'trash', size: 13 }), '清空'])
        ]),
        extracted ? h('div', { key: 'extracted', style: { padding: '12px 14px', border: `1px solid ${C.tealLine}`, borderRadius: '10px', background: C.paper, fontSize: '12px', lineHeight: 1.55 } }, [
          h('div', { key: 'head', style: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' } }, [
            h('span', { style: workbenchStyle.badge(C.teal) }, `已提取 ${extracted.source_count} 条`),
            h('span', { style: { color: C.ink, fontWeight: 600 } }, '从对话生成草稿'),
          ]),
          h('div', { key: 'summary', style: { marginTop: '8px', fontSize: '11px', color: C.muted } }, `问题 ${extracted.question ? '✓' : '—'} · 事实 ${extracted.facts ? '✓' : '—'} · 约束 ${extracted.constraints ? '✓' : '—'} · 未决问题 ${extracted.unresolved ? '✓' : '—'}`),
          extracted.question ? h('div', { key: 'question', style: { marginTop: '7px', color: C.slate } }, `问题：${cleanSummary(extracted.question)}`) : null,
          extracted.unresolved ? h('div', { key: 'unresolved', style: { marginTop: '4px', color: C.slate } }, `未决：${cleanSummary(extracted.unresolved)}`) : null,
          h('button', { key: 'apply', className: 'pk-action-primary', onClick: () => { setQuestion(extracted.question); setFacts(extracted.facts); setConstraints(extracted.constraints); setOptions(extracted.options); setExtracted(null) }, style: { ...workbenchStyle.actionPrimary, marginTop: '10px' } }, '确认并填入表单')
        ]) : null,
        method ? h('div', { key: 'guide', style: { padding: '10px 14px', borderRadius: '6px', background: C.paperWarm, color: C.slate, fontSize: '12px', lineHeight: 1.55 } }, [
          h('strong', { key: 'label', style: { color: C.ink, marginRight: '6px', fontWeight: 500 } }, '你会得到'),
          h('span', null, method.outcome || (method.mode === 'guided' ? 'AI 会逐步追问,直到问题足够清楚。' : '一份结构化分析、风险和下一步行动。'))
        ]) : null,
        h('div', { key: 'steps', style: { display: 'flex', gap: '6px', flexWrap: 'wrap' } }, [stepPill(question, '问题'), stepPill(facts, '事实'), stepPill(constraints, '约束'), stepPill(options, '方案')]),
        h('div', { key: 'q', className: 'pk-field' }, [
          h('label', { className: 'pk-label', htmlFor: 'pk-question' }, '问题'),
          h('textarea', { id: 'pk-question', value: question, onChange: e => setQuestion(e.target.value), placeholder: '输入你想解决的问题', style: { ...workbenchStyle.input, minHeight: '84px', resize: 'vertical', width: '100%' } })
        ]),
        showOptional || facts || constraints || options ? h('div', { key: 'supporting', style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '12px' } }, [
          h('div', { key: 'f', className: 'pk-field' }, [h('label', { className: 'pk-label' }, '已知事实 (可选)'), h('textarea', { value: facts, onChange: e => setFacts(e.target.value), placeholder: '输入已知的事实', style: { ...workbenchStyle.input, minHeight: '54px', resize: 'vertical', width: '100%' } })]),
          h('div', { key: 'c', className: 'pk-field' }, [h('label', { className: 'pk-label' }, '现实约束 (可选)'), h('textarea', { value: constraints, onChange: e => setConstraints(e.target.value), placeholder: '输入资源、时间或不可接受的结果', style: { ...workbenchStyle.input, minHeight: '54px', resize: 'vertical', width: '100%' } })]),
          h('div', { key: 'o', className: 'pk-field' }, [h('label', { className: 'pk-label' }, '已有方案 (可选)'), h('textarea', { value: options, onChange: e => setOptions(e.target.value), placeholder: '输入已有方案或备选路径', style: { ...workbenchStyle.input, minHeight: '54px', resize: 'vertical', width: '100%' } })])
        ]) : h('button', { key: 'show-optional', onClick: () => setShowOptional(true), style: { ...workbenchStyle.action, background: 'transparent', color: C.muted, width: 'fit-content', display: 'inline-flex', alignItems: 'center', gap: '5px' } }, [h(Icon, { key: 'ic', name: 'plus', size: 13 }), '添加可选字段（事实 / 约束 / 方案）']),
        getRecentSessions ? h('div', { key: 'history-controls', style: { paddingTop: '12px', borderTop: `1px solid ${C.divide}` } }, [
          h('div', { key: 'l', style: { fontSize: '12px', fontWeight: 500, color: C.ink, marginBottom: '4px' } }, '追加最近会话摘要'),
          h('div', { key: 'h', style: { fontSize: '11px', color: C.muted, marginBottom: '8px' } }, '只读取已保存的简短摘要,不读取完整历史对话、工具参数或工具结果。'),
          h('div', { key: 'ctl', style: { display: 'flex', gap: '8px', flexWrap: 'wrap' } }, [
            h('select', { key: 'limit', value: recentLimit, onChange: e => { setRecentLimit(e.target.value); setRecentPreview(null) }, style: { padding: '7px 9px', border: `1px solid ${C.line}`, borderRadius: '6px', fontSize: '12px' } }, [['0', '不追加'], ['1', '最近 1 个'], ['3', '最近 3 个'], ['5', '最近 5 个']].map(([value, label]) => h('option', { key: value, value }, label))),
            h('button', { key: 'preview', disabled: recentLimit === '0', onClick: previewRecent, style: { ...workbenchStyle.action, background: C.surface, color: C.ink } }, '预览摘要')
          ]),
          recentPreview ? h('div', { key: 'preview', style: { marginTop: '10px', padding: '10px 12px', border: `1px solid ${C.line}`, borderRadius: '6px', background: C.paper, fontSize: '12px', lineHeight: 1.55, whiteSpace: 'pre-wrap', maxHeight: '210px', overflow: 'auto' } }, [
            h('div', { key: 'text', style: { color: C.slate } }, recentPreview.summary || '未找到可追加的已保存会话摘要。'),
            h('button', { key: 'apply', disabled: !recentPreview.summary, onClick: appendRecent, style: { ...workbenchStyle.action, marginTop: '8px' } }, `追加 ${recentPreview.count} 个摘要到事实`)
          ]) : null
        ]) : null,
        searchMemory ? h('div', { key: 'search', style: { paddingTop: '12px', borderTop: `1px solid ${C.divide}` } }, [
          h('div', { key: 'l', style: { fontSize: '12px', fontWeight: 500, color: C.ink, marginBottom: '4px' } }, '按自然语言搜索项目记忆'),
          h('div', { key: 'h', style: { fontSize: '11px', color: C.muted, marginBottom: '8px' } }, '用一句自然语言描述你要找的旧决策或证据;搜索范围由宿主注入的 searchMemory 决定。'),
          h('div', { key: 'ctl', style: { display: 'flex', gap: '8px' } }, [
            h('input', { key: 'query', value: contextQuery, onChange: e => setContextQuery(e.target.value), placeholder: '例如:之前关于 Feign 兼容的决策', style: { ...workbenchStyle.input, fontSize: '12px' } }),
            h('button', { key: 'go', disabled: !contextQuery.trim(), onClick: searchContext, style: { ...workbenchStyle.action, background: C.surface, color: C.ink } }, '搜索')
          ]),
          contextPreview ? h('div', { key: 'preview', style: { marginTop: '10px', padding: '10px 12px', border: `1px solid ${C.line}`, borderRadius: '6px', background: C.paper, fontSize: '12px', lineHeight: 1.55, whiteSpace: 'pre-wrap', maxHeight: '210px', overflow: 'auto' } }, [
            h('div', { key: 'text', style: { color: C.slate } }, cleanContext(contextPreview) || '未找到可追加的项目记忆。'),
            h('button', { key: 'apply', onClick: appendContext, style: { ...workbenchStyle.action, marginTop: '8px' } }, '追加到事实')
          ]) : null
        ]) : null,
        h('button', { key: 'compose', className: 'pk-action-primary', onClick: compose, style: { ...workbenchStyle.actionPrimary, display: 'inline-flex', alignItems: 'center', gap: '8px' } }, [h(Icon, { key: 'ic', name: 'sparkle', size: 14 }), h('span', { key: 't' }, '生成 Prompt 预览'), h('span', { key: 'kbd', style: { opacity: 0.65, fontSize: '11px', fontWeight: 600 } }, '⌘↵')]),
        previewPanel,
        historyList,
        message ? h('div', { key: 'message', style: { color: C.teal, fontSize: '13px', padding: '10px 14px', background: C.tealTint, borderRadius: '6px', border: `1px solid ${C.tealLine}` } }, message) : null,
      ]),
    ]),
  ])
}

function isFav(method, favorites) { return !!method && favorites.includes(method.id) }

function stepPill(value, label) {
  return h('span', { key: label, style: { display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 9px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, border: `1px solid ${value ? 'var(--pk-teal-line-active)' : 'var(--pk-line)'}`, background: value ? 'var(--pk-teal-tint)' : 'transparent', color: value ? 'var(--pk-teal)' : 'var(--pk-muted)' } }, value ? `✓ ${label}` : label)
}

export { PromptStudio }
