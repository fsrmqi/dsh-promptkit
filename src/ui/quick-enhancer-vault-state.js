import React from 'react'

const INITIAL_DRAFT = {
  vaultTitle: '', vaultTags: '', vaultNote: '', vaultBody: '', vaultProject: '', vaultParentId: '',
  vaultEditingId: '', vaultFormOpen: false, vaultCompareId: '', vaultThinkingKind: 'conclusion',
  vaultEpistemicStatus: 'inferred', vaultRationale: '', vaultNextAction: '', vaultRelatedIds: [],
  vaultDialectic: { thesis: '', antithesis: '', synthesis: '' },
  vaultVerification: { status: 'pending', evidence: '', checkedAt: 0 }, vaultType: 'prompt', vaultBackup: '',
}

function reducer(state, action) {
  if (action.type === 'reset') return { ...INITIAL_DRAFT }
  if (action.type !== 'set') return state
  const next = typeof action.value === 'function' ? action.value(state[action.field]) : action.value
  return state[action.field] === next ? state : { ...state, [action.field]: next }
}

/** Vault 编辑草稿的单一状态容器；保留 setState 风格 setter 以降低调用方迁移成本。 */
export function useQuickEnhancerVaultState() {
  const [draft, dispatch] = React.useReducer(reducer, INITIAL_DRAFT)
  const setter = React.useCallback(field => value => dispatch({ type: 'set', field, value }), [])
  return {
    ...draft,
    setVaultTitle: setter('vaultTitle'), setVaultTags: setter('vaultTags'), setVaultNote: setter('vaultNote'),
    setVaultBody: setter('vaultBody'), setVaultProject: setter('vaultProject'), setVaultParentId: setter('vaultParentId'),
    setVaultEditingId: setter('vaultEditingId'), setVaultFormOpen: setter('vaultFormOpen'), setVaultCompareId: setter('vaultCompareId'),
    setVaultThinkingKind: setter('vaultThinkingKind'), setVaultEpistemicStatus: setter('vaultEpistemicStatus'),
    setVaultRationale: setter('vaultRationale'), setVaultNextAction: setter('vaultNextAction'), setVaultRelatedIds: setter('vaultRelatedIds'),
    setVaultDialectic: setter('vaultDialectic'), setVaultVerification: setter('vaultVerification'), setVaultType: setter('vaultType'),
    setVaultBackup: setter('vaultBackup'), resetVaultDraft: () => dispatch({ type: 'reset' }),
  }
}
