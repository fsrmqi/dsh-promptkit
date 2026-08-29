// Vault 单张资产卡：折叠态（标题 + 类型徽章 + 认识状态 + 正文预览）
// 与展开态（元数据 + 完整正文 + 操作行）渐进披露。
// 操作行统一用 linkBtnStyle 链接式按钮；「用于增强」最多勾 3 张（过多上下文稀释注意力）。
import { h, C, Icon, LatexText, Card } from '../foundation.js'

// 资产卡链接式按钮的统一样式：无边框 teal 文字，破坏性动作单独覆盖颜色。
export const linkBtnStyle = { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '11px', fontWeight: 800 }

// 认识状态的视觉三重编码：圆点色 + 文字标签（满足 WCAG 不以颜色为唯一信息通道）。
export function epistemicMetaOf(C) {
  return {
    verified: { label: '已证实', color: C.statusVerified },
    inferred: { label: '推断', color: C.statusInferred },
    to_verify: { label: '待核实', color: C.statusToVerify },
    preference: { label: '个人偏好', color: C.statusPreference },
  }
}

export function VaultAssetCard({
  item, expanded, comparing, assetContextIds, epistemicLabel, thinkingLabel,
  onToggleExpand, onToggleFavorite, onAppend, onFill, onToggleContext, onNextAction,
  onEdit, onDerive, onRelations, onCompare, onCopy, onDelete,
}) {
  const meta = (epistemicMetaOf(C))[item.epistemicStatus] || epistemicMetaOf(C).inferred
  return h(Card, { key: item.id }, [
    // 折叠头：标题 + 收藏星标 + 旋转 chevron；整行可点展开。
    h('div', { key: 'head', style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' } }, [
      h('button', { key: 'toggle', onClick: onToggleExpand, style: { flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '5px', border: 0, background: 'transparent', padding: 0, cursor: 'pointer', textAlign: 'left' } }, [
        h('strong', { key: 'title', style: { fontSize: '12px', color: C.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, `${item.favorite ? '★ ' : ''}${item.title}`),
        h(Icon, { key: 'chevron', name: 'chevronDown', size: 13, style: { color: C.muted, flexShrink: 0, transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform .18s ease' } }),
      ]),
      h('button', { key: 'fav', onClick: onToggleFavorite, style: { border: 0, background: 'transparent', color: C.teal, cursor: 'pointer', fontSize: '12px', flexShrink: 0 }, title: '收藏/取消收藏' }, item.favorite ? '取消收藏' : '收藏'),
    ]),
    // 状态行：类型徽章 + 认识状态点 + 项目归属。
    h('div', { key: 'status', style: { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', marginTop: '5px' } }, [
      h('span', { key: 'type', style: { display: 'inline-block', padding: '1px 7px', borderRadius: '999px', background: C.tealTint, color: C.teal, fontSize: '10px', fontWeight: 700, whiteSpace: 'nowrap' } }, thinkingLabel[item.thinkingKind] || '结论'),
      h('span', { key: 'epistemic', style: { display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: 700, color: meta.color } }, [
        h('span', { key: 'dot', style: { width: '7px', height: '7px', borderRadius: '50%', background: meta.color, flexShrink: 0 } }),
        meta.label,
      ]),
      item.project ? h('span', { key: 'project', style: { color: C.muted, fontSize: '10px' } }, item.project) : null,
    ]),
    // 展开态元数据：重要性说明 / 验证状态 / 辩证三段——渐进披露，折叠态不渲染。
    expanded && item.rationale ? h('div', { key: 'rationale', style: { marginTop: '5px', color: C.slate, fontSize: '10px', lineHeight: 1.4 } }, `为什么重要：${item.rationale}`) : null,
    expanded && item.verification ? h('div', { key: 'verification', style: { marginTop: '4px', color: C.slate, fontSize: '10px', lineHeight: 1.4 } }, `验证：${item.verification.status === 'confirmed' ? '已证实' : item.verification.status === 'refuted' ? '已被推翻' : item.verification.status === 'inconclusive' ? '暂无结论' : '待验证'}${item.verification.evidence ? ` · ${item.verification.evidence}` : ''}`) : null,
    expanded && item.dialectic ? h('div', { key: 'dialectic', style: { marginTop: '4px', color: C.slate, fontSize: '10px', lineHeight: 1.4 } }, `观点：${item.dialectic.thesis || '—'} · 反观点：${item.dialectic.antithesis || '—'} · 综合：${item.dialectic.synthesis || '—'}`) : null,
    // 正文：折叠限高预览、展开可滚动；LaTeX 内联渲染。
    h('div', { key: 'body', style: { marginTop: '5px', color: C.slate, fontSize: '11px', lineHeight: 1.45, ...(expanded ? { maxHeight: '240px', overflow: 'auto' } : { maxHeight: '34px', overflow: 'hidden' }) } }, h(LatexText, { text: item.body, block: true })),
    // 展开态操作行：追加 / 用于增强 / 执行下一步 / 填充 / 编辑 / 派生 / 关系 /
    // 版本对比（仅有父版本时）/ 复制 / 删除（靠右、红色）。
    expanded ? h('div', { key: 'actions', style: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '7px' } }, [
      h('button', { key: 'append', onClick: onAppend, style: linkBtnStyle }, '追加'),
      h('button', {
        key: 'context',
        disabled: !assetContextIds.includes(item.id) && assetContextIds.length >= 3,
        onClick: onToggleContext,
        style: { ...linkBtnStyle, color: assetContextIds.includes(item.id) ? C.teal : C.slate, cursor: !assetContextIds.includes(item.id) && assetContextIds.length >= 3 ? 'not-allowed' : 'pointer' },
      }, assetContextIds.includes(item.id) ? '✓ 用于增强' : '用于增强'),
      item.nextAction ? h('button', { key: 'next', onClick: onNextAction, style: linkBtnStyle }, '执行下一步') : null,
      h('button', { key: 'replace', onClick: onFill, style: linkBtnStyle }, '填充'),
      h('button', { key: 'edit', onClick: onEdit, style: linkBtnStyle }, '编辑'),
      h('button', { key: 'derive', onClick: onDerive, style: linkBtnStyle }, '派生'),
      h('button', { key: 'relations', onClick: onRelations, style: linkBtnStyle }, '关系'),
      item.parentId ? h('button', { key: 'compare', onClick: onCompare, style: linkBtnStyle }, comparing ? '收起对比' : '版本对比') : null,
      h('button', { key: 'copy', onClick: onCopy, style: linkBtnStyle }, '复制'),
      h('button', { key: 'delete', onClick: onDelete, style: { ...linkBtnStyle, marginLeft: 'auto', color: C.red } }, '删除'),
    ]) : null,
    comparing && item.parentBody ? VersionDiff({ item }) : null,
  ])
}

// 版本对比：父版本（旧）与当前（新）并排双栏，只读展示。
// parentBody 由主组件查 vaultById 后传入（parent.title 可用于后续标注）。
function VersionDiff({ item }) {
  return h('div', { style: { marginTop: '7px', padding: '8px', border: `1px solid ${C.tealLine}`, borderRadius: '8px', background: C.surfaceAlt, fontSize: '10px', lineHeight: 1.45, display: 'grid', gap: '5px' } }, [
    h('div', { key: 'grid', style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px' } }, [
      h('div', { key: 'old', style: { whiteSpace: 'pre-wrap', color: C.muted, maxHeight: '96px', overflow: 'auto' } }, item.parentBody || ''),
      h('div', { key: 'new', style: { whiteSpace: 'pre-wrap', color: C.ink, maxHeight: '96px', overflow: 'auto' } }, item.body),
    ]),
  ])
}
