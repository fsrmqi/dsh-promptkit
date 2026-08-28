import { AssetProvider } from '../core/asset-provider.js'

const TYPES = new Set(['prompt', 'snippet', 'insight'])
const THINKING_KINDS = new Set(['question', 'goal', 'fact', 'assumption', 'decision', 'method', 'conclusion', 'action', 'dialectic'])
const EPISTEMIC_STATUSES = new Set(['verified', 'inferred', 'to_verify', 'preference'])

/** 完全本地的灵感库实现；数据可用 JSON 导出并以增量方式恢复。 */
export class StaticAssetProvider extends AssetProvider {
  constructor({ storagePrefix = 'promptkit.' } = {}) {
    super()
    this.key = `${storagePrefix}vault.assets.v1`
    this.event = `${storagePrefix}vault.changed.v1`
    this.listeners = new Set()
    this.source = `asset-provider:${Math.random().toString(36).slice(2)}`
    this._onStorage = event => { if (event?.key === this.key) this._notify(this._read()) }
    this._onLocalChange = event => { if (event?.detail?.key === this.key && event.detail.source !== this.source) this._notify(this._read()) }
    this._listening = false
  }
  async list() { return this._read().sort((a, b) => Number(b.updatedAt || 0) - Number(a.updatedAt || 0)) }
  async save(input) {
    const body = String(input?.body || '').trim()
    if (!body) throw new Error('灵感内容不能为空。')
    const now = Date.now()
    const current = this._read()
    const id = String(input?.id || `asset:${now.toString(36)}-${Math.random().toString(36).slice(2, 8)}`)
    const previous = current.find(item => item.id === id)
    const asset = {
      id,
      type: TYPES.has(input?.type) ? input.type : 'prompt',
      title: String(input?.title || '').trim() || body.split('\n').find(Boolean)?.slice(0, 48) || '未命名灵感',
      body,
      tags: [...new Set((Array.isArray(input?.tags) ? input.tags : String(input?.tags || '').split(/[，,]/)).map(tag => String(tag).trim().replace(/^#/, '')).filter(Boolean))],
      note: String(input?.note || '').trim(),
      project: String(input?.project || previous?.project || '').trim(),
      parentId: String(input?.parentId || previous?.parentId || '').trim(),
      thinkingKind: THINKING_KINDS.has(input?.thinkingKind) ? input.thinkingKind : (previous?.thinkingKind || 'conclusion'),
      epistemicStatus: EPISTEMIC_STATUSES.has(input?.epistemicStatus) ? input.epistemicStatus : (previous?.epistemicStatus || 'inferred'),
      rationale: String(input?.rationale ?? previous?.rationale ?? '').trim(),
      nextAction: String(input?.nextAction ?? previous?.nextAction ?? '').trim(),
      relatedIds: [...new Set((Array.isArray(input?.relatedIds) ? input.relatedIds : previous?.relatedIds || []).map(String).filter(relatedId => relatedId && relatedId !== id))],
      dialectic: input?.dialectic && typeof input.dialectic === 'object' ? {
        thesis: String(input.dialectic.thesis || '').trim(), antithesis: String(input.dialectic.antithesis || '').trim(), synthesis: String(input.dialectic.synthesis || '').trim(),
      } : previous?.dialectic,
      verification: input?.verification && typeof input.verification === 'object' ? {
        status: ['pending', 'confirmed', 'refuted', 'inconclusive'].includes(input.verification.status) ? input.verification.status : 'pending',
        evidence: String(input.verification.evidence || '').trim(), checkedAt: Number(input.verification.checkedAt || 0) || undefined,
      } : previous?.verification,
      provenance: input?.provenance && typeof input.provenance === 'object' ? input.provenance : previous?.provenance,
      favorite: Boolean(input?.favorite ?? previous?.favorite),
      createdAt: Number(previous?.createdAt || now), updatedAt: now, lastUsedAt: previous?.lastUsedAt, useCount: Number(previous?.useCount || 0),
    }
    this._write([asset, ...current.filter(item => item.id !== id)])
    return asset
  }
  async remove(id) { this._write(this._read().filter(item => item.id !== id)) }
  async toggleFavorite(id) {
    let changed = null
    this._write(this._read().map(item => {
      if (item.id !== id) return item
      changed = { ...item, favorite: !item.favorite, updatedAt: Date.now() }
      return changed
    }))
    return changed
  }
  async markUsed(id) {
    let changed = null
    this._write(this._read().map(item => {
      if (item.id !== id) return item
      changed = { ...item, lastUsedAt: Date.now(), useCount: Number(item.useCount || 0) + 1 }
      return changed
    }))
    return changed
  }
  async import(raw) {
    let parsed
    try { parsed = typeof raw === 'string' ? JSON.parse(raw) : raw } catch { throw new Error('灵感库备份不是有效 JSON。') }
    const incoming = Array.isArray(parsed?.assets) ? parsed.assets : []
    const valid = incoming.filter(item => item && typeof item.body === 'string' && item.body.trim()).map(item => ({
      ...item, id: `asset:${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
      type: TYPES.has(item.type) ? item.type : 'prompt', title: String(item.title || '未命名灵感'),
      tags: Array.isArray(item.tags) ? item.tags.map(String) : [], createdAt: Date.now(), updatedAt: Date.now(),
    }))
    if (!valid.length) throw new Error('备份中没有可导入的灵感资产。')
    this._write([...valid, ...this._read()])
    return valid
  }
  onChange(callback) {
    this.listeners.add(callback)
    if (!this._listening) {
      window.addEventListener?.('storage', this._onStorage)
      window.addEventListener?.(this.event, this._onLocalChange)
      this._listening = true
    }
    return () => {
      this.listeners.delete(callback)
      if (this.listeners.size || !this._listening) return
      window.removeEventListener?.('storage', this._onStorage)
      window.removeEventListener?.(this.event, this._onLocalChange)
      this._listening = false
    }
  }
  _read() {
    try {
      const raw = JSON.parse(window.localStorage.getItem(this.key) || 'null')
      // 兼容旧版裸数组（无版本包装）与当前 { version, assets } 格式。
      const payload = Array.isArray(raw) ? { version: 0, assets: raw } : raw
      if (!payload || typeof payload !== 'object') return []
      const rows = Array.isArray(payload.assets) ? payload.assets : []
      return this._migrate(Number(payload.version || 0), rows).filter(item => item && item.id && item.body)
    } catch { return [] }
  }
  /** 版本迁移策略：v0（裸数组）→ v1 只需补全语义字段；更高版本未知时原样保留以免丢数据。 */
  _migrate(fromVersion, rows) {
    if (fromVersion >= 1) return rows
    return rows.map(item => ({
      id: String(item.id),
      type: ['prompt', 'snippet', 'insight'].includes(item.type) ? item.type : 'prompt',
      title: String(item.title || '').trim() || String(item.body || '').split('\n').find(Boolean)?.slice(0, 48) || '未命名灵感',
      body: String(item.body || ''),
      tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
      note: String(item.note || ''),
      project: String(item.project || ''),
      parentId: String(item.parentId || ''),
      thinkingKind: item.thinkingKind || 'conclusion',
      epistemicStatus: item.epistemicStatus || 'inferred',
      rationale: String(item.rationale || ''),
      nextAction: String(item.nextAction || ''),
      relatedIds: Array.isArray(item.relatedIds) ? item.relatedIds.map(String) : [],
      verification: item.verification && typeof item.verification === 'object' ? item.verification : undefined,
      favorite: Boolean(item.favorite),
      createdAt: Number(item.createdAt || 0) || undefined,
      updatedAt: Number(item.updatedAt || 0) || undefined,
      lastUsedAt: Number(item.lastUsedAt || 0) || undefined,
      useCount: Number(item.useCount || 0),
    }))
  }
  _notify(rows) { this.listeners.forEach(listener => { try { listener(rows) } catch {} }) }
  _write(rows) {
    const payload = { version: 1, assets: rows }
    try { window.localStorage.setItem(this.key, JSON.stringify(payload)) }
    catch (error) {
      throw Object.assign(new Error('灵感库写入失败：浏览器未允许本地存储或空间已满。'), { cause: error })
    }
    this._notify(rows)
    try { window.dispatchEvent?.(new CustomEvent(this.event, { detail: { key: this.key, source: this.source } })) } catch {}
  }
}
