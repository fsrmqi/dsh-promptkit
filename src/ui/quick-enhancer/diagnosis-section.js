// 五维诊断卡（哲学启发式量表）：概念清晰/隐含前提/可证伪性/可行动性/语境契合。
// 标签键序与 host 的 DIAGNOSIS_LABELS 保持一致；流式期间诊断行先于正文到达，
// diagnosis 增量填充时诊断卡先亮起来，用户先看到「体检结果」再看改写。
// 底部的「查看知识区」入口只负责跳转——存卡与否由用户在知识区里决定。
import { h, C, Icon } from '../foundation.js'

const DIAGNOSIS_LABELS = { concept_clarity: '概念清晰', hidden_premise: '隐含前提', falsifiability: '可证伪性', actionability: '可行动性', context_fit: '语境契合' }

export function DiagnosisSection({ diagnosis, matchedMethod, knowledgeCount, hasAssetProvider, onOpenKnowledge }) {
  if (!diagnosis) return null
  return h('details', { key: 'diagnosis', open: true, style: { marginTop: '9px', padding: '9px 10px', border: `1px solid ${C.tealLine}`, borderRadius: '8px', background: C.tealTint, fontSize: '11px', lineHeight: 1.5 } }, [
    h('summary', { key: 'sum', style: { color: C.teal, fontWeight: 800, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '5px' } }, [
      h(Icon, { key: 'ic', name: 'gauge', size: 12 }),
      '五维诊断',
      // 自动匹配到旗舰方法时提示诊断采用了该方法的检查侧重（方法感知量表）。
      matchedMethod ? h('span', { key: 'hint', style: { color: C.muted, fontWeight: 600 } }, ` · ${matchedMethod.title} 侧重`) : null,
    ]),
    h('div', { key: 'rows', style: { marginTop: '6px', display: 'grid', gap: '3px' } }, Object.entries(DIAGNOSIS_LABELS).map(([key, label]) => h('div', { key, style: { color: C.slate } }, [
      h('strong', { key: 'l', style: { color: C.teal } }, `${label}：`),
      diagnosis[key] || '—',
    ]))),
    // 诊断闭环入口：发现自动进灵感库「知识区」暂存，用户审阅后主动决定存卡或忽略。
    // 这里只提供入口，不替用户做决定。
    hasAssetProvider ? h('div', { key: 'save-cards', style: { marginTop: '7px', paddingTop: '7px', borderTop: `1px dashed ${C.tealLine}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' } }, [
      h('span', { key: 'hint', style: { color: C.muted, fontSize: '10px', lineHeight: 1.4, flex: 1 } },
        knowledgeCount > 0
          ? `知识区有 ${knowledgeCount} 条诊断发现待审阅，可存为假设卡或忽略。`
          : '认识缺口已自动放入灵感库「知识区」，审阅后可存为假设卡。'),
      h('button', {
        key: 'go',
        onClick: onOpenKnowledge,
        style: { flexShrink: 0, border: 0, borderRadius: '7px', background: C.teal, color: '#fff', padding: '5px 10px', cursor: 'pointer', fontSize: '11px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' },
      }, [
        '查看知识区',
        knowledgeCount > 0 ? h('span', { key: 'n', style: { background: C.surface, color: C.teal, borderRadius: '999px', padding: '0 6px', fontSize: '10px', fontWeight: 800 } }, String(knowledgeCount)) : null,
      ]),
    ]) : null,
  ])
}
