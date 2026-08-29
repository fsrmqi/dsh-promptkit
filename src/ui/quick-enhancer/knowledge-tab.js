// 知识区 tab：诊断发现的「待审阅」暂存区。增强完成时认识缺口自动入区（见
// use-knowledge-inbox.js），用户逐条主动决定：存为假设卡（进收件箱待验证队列 +
// 可注入增强上下文）或忽略。这里不做任何自动写入 Vault 的动作。
import { h, C } from '../foundation.js'

export function KnowledgeTab({ entries, max, onPromote, onDismiss }) {
  return h('div', { key: 'knowledge-tab', style: { display: 'grid', gap: '8px' } }, [
    h('div', { key: 'hint', style: { color: C.muted, fontSize: '11px', lineHeight: 1.4 } },
      entries.length
        ? `语义增强发现的 ${entries.length} 条认识缺口在此暂存（本地保存，最多 ${max} 条）。是否留证由你决定：存卡进入验证流程，忽略则丢弃。`
        : '暂无待审阅的发现。语义增强诊断出「隐含前提」或「不可证伪要求」时会自动出现在这里。'),
    // 新发现的在上：倒序渲染让用户先看到最近的诊断结果。
    ...entries.slice().reverse().map(entry => h('div', { key: entry.id, style: { padding: '9px', border: `1px solid ${C.amberLine}`, borderRadius: '8px', background: C.amberTint, display: 'grid', gap: '5px' } }, [
      h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' } }, [
        h('span', { key: 'tag', style: { display: 'inline-block', padding: '1px 8px', borderRadius: '999px', background: C.amber, color: '#fff', fontSize: '10px', fontWeight: 800, whiteSpace: 'nowrap' } }, entry.label),
        // 方法名与日期分别拼接：原来的 `?:` + 字符串连接混用会吞掉日期分隔符。
        h('span', { key: 'meta', style: { color: C.muted, fontSize: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
          [entry.method ? `${entry.method} · ` : '', new Date(entry.at).toLocaleDateString()].join('')),
      ]),
      h('div', { key: 'finding', style: { color: C.slate, fontSize: '11px', lineHeight: 1.45, whiteSpace: 'pre-wrap', wordBreak: 'break-word' } }, entry.finding),
      h('div', { key: 'draft', style: { color: C.muted, fontSize: '10px', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, `原草稿：${entry.draft || '（空）'}`),
      h('div', { key: 'actions', style: { display: 'flex', gap: '8px', marginTop: '2px' } }, [
        h('button', { key: 'promote', onClick: () => onPromote(entry), style: { border: 0, borderRadius: '7px', background: C.teal, color: '#fff', padding: '5px 10px', cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, '存为假设卡'),
        h('button', { key: 'dismiss', onClick: () => onDismiss(entry.id), style: { border: 0, background: 'transparent', color: C.muted, cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, '忽略'),
      ]),
    ])),
  ])
}
