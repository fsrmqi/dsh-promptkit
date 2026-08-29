import React from 'react'

// 知识区（诊断发现暂存）容量上限：超限时挤掉最旧的未处理项。
const KNOWLEDGE_INBOX_MAX = 12

// 认识缺口的分类字段：只有这两类值得入区留证——
//   hidden_premise  隐含前提：草稿默认了哪些未言明的假设
//   falsifiability  不可证伪要求：哪些要求无法被观察或测试判定
// 概念清晰是措辞问题，入区即噪音；行动性/语境契合在改写中直接消化。
export const DIAGNOSIS_GAP_FIELDS = [
  { key: 'hidden_premise', label: '隐含前提', hint: '草稿默认了哪些未言明的假设' },
  { key: 'falsifiability', label: '不可证伪要求', hint: '哪些要求无法被观察或测试判定' },
]

/**
 * useKnowledgeInbox：知识区暂存队列的状态容器（诊断闭环第 1 步的持久化载体）。
 *
 * 语义：增强完成时认识缺口自动入区（enqueue），但「入区 ≠ 存卡」——队列只存
 * localStorage，不写 Vault；用户逐条审阅后由上层主动调用 promote（写 Vault 假设卡）
 * 或 dismiss（丢弃），本 hook 不做任何 Vault 写入。
 *
 * 返回：
 *   entries           暂存条目数组（旧→新）
 *   enqueue           (diagnosis, draftFingerprint, methodTitle) => 入区，返回本次新增数
 *   dismiss           (id) => 从暂存移除
 *   findByFingerprint (fingerprint) => boolean：Vault 查重之外的区内容重
 */
export function useKnowledgeInbox({ storageKey, notice, vaultItems }) {
  const [entries, setEntries] = React.useState(() => {
    try { return JSON.parse(window.localStorage.getItem(storageKey('knowledge-inbox.v1')) || '[]') } catch { return [] }
  })
  // 队列即改即持久化：面板关闭后暂存不丢。
  React.useEffect(() => {
    try { window.localStorage.setItem(storageKey('knowledge-inbox.v1'), JSON.stringify(entries)) } catch {}
  }, [entries])

  const enqueue = (diagnosis, draftFingerprint, methodTitle) => {
    let addedCount = 0
    setEntries(prev => {
      const next = [...prev]
      for (const field of DIAGNOSIS_GAP_FIELDS) {
        const finding = diagnosis?.[field.key]
        if (!finding) continue
        // 查重按「维度 + 草稿指纹」：同一草稿的同一缺口只入区一次。
        const fingerprint = `${field.key}:${draftFingerprint}`
        if (next.some(entry => entry.fingerprint === fingerprint)) continue
        addedCount += 1
        next.push({
          id: `know:${Date.now()}:${field.key}:${Math.random().toString(36).slice(2, 6)}`,
          fingerprint,
          dimension: field.key,
          label: field.label,
          hint: field.hint,
          finding,
          draft: draftFingerprint,
          method: methodTitle || '',
          at: Date.now(),
        })
      }
      // 区满裁剪：保留最新 N 条（旧未处理项被挤出，避免无限堆积）。
      return next.slice(-KNOWLEDGE_INBOX_MAX)
    })
    return addedCount
  }

  const dismiss = id => setEntries(prev => prev.filter(item => item.id !== id))

  // 查重只针对 Vault 已有卡（provenance.fingerprint）：不能查暂存区——
  // 待晋升的条目自己就在区里，查区会把「自己」误判为重复，导致永远存不了卡。
  const existsInVault = fingerprint => vaultItems.some(item => item.provenance?.fingerprint === fingerprint)

  return { entries, enqueue, dismiss, existsInVault, max: KNOWLEDGE_INBOX_MAX }
}
