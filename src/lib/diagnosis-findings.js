// 新协议明确区分检查通过与缺口；旧输出只过滤明确、完整的无问题表述。
export function diagnosisFinding(value, dimension) {
  const text = String(value || '').trim()
  if (!text || /^\[OK\]/i.test(text)) return null
  if (/^\[GAP\]/i.test(text)) return text.replace(/^\[GAP\]\s*/i, '').trim() || null
  const plain = text.replace(/[。.!！；;]+$/, '').trim()
  if (/^(?:无|没有|无问题|无明显问题|未发现问题|不适用|none|n\/a|no issues?)$/i.test(plain)) return null
  if (dimension === 'hidden_premise' && /^(?:(?:无|没有|不存在|未发现)(?:明显的?|额外的?)?(?:隐含前提|隐含假设|未言明的假设)|no (?:hidden|unstated) (?:assumptions|premises)(?: found)?)$/i.test(plain)) return null
  if (dimension === 'falsifiability' && /^(?:(?:所有|各项)?(?:要求|目标|验收条件|验收标准)?(?:均|都|已)?(?:可验证|可测试|可判定|可以验证|可以测试)|(?:all )?requirements are (?:testable|verifiable|falsifiable))$/i.test(plain)) return null
  return text
}

// 使用完整文本的可逆键，避免短前缀或哈希碰撞把不同任务合并。
export function diagnosisFingerprint(dimension, draft) {
  return `${dimension}:v2:${JSON.stringify(String(draft || '').trim())}`
}
