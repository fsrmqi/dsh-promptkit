// 五维诊断卡（哲学启发式量表）：概念清晰/隐含前提/可证伪性/可行动性/语境契合。
// 标签键序与 host 的 DIAGNOSIS_LABELS 保持一致；流式期间诊断行先于正文到达，
// diagnosis 增量填充时诊断卡先亮起来，用户先看到「体检结果」再看改写。
// 诊断默认只供本次查看；用户可明确决定是否保存到知识区。
import { h, C, Icon } from '../foundation.js'
import { DIAGNOSIS_LABELS } from '../../lib/enhance-output.js'

export function DiagnosisSection({ diagnosis, matchedMethod, knowledgeCount, hasAssetProvider, onOpenKnowledge, onSaveDiagnosis }) {
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
      diagnosis[key]?.replace(/^\[(?:OK|GAP)\]\s*/i, '') || '未返回此项诊断',
    ]))),
    hasAssetProvider ? h('div', { key: 'save-cards', style: { marginTop: '7px', paddingTop: '7px', borderTop: `1px dashed ${C.tealLine}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' } }, [
      h('span', { key: 'hint', style: { color: C.muted, fontSize: '10px', lineHeight: 1.4, flex: 1 } },
        knowledgeCount > 0
          ? `知识区有 ${knowledgeCount} 条诊断发现待审阅，可存为假设卡或忽略。`
          : '诊断只供本次查看；需要长期跟进时可手动保存到知识区。'),
      h('button', { key: 'save', onClick: () => onSaveDiagnosis?.(diagnosis, matchedMethod?.title || ''), style: { flexShrink: 0, border: `1px solid ${C.tealLineActive}`, borderRadius: '7px', background: C.surface, color: C.teal, padding: '5px 10px', cursor: 'pointer', fontSize: '11px', fontWeight: 800 } }, '保存到知识区'),
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
