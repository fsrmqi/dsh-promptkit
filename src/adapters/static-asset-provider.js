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
  onChange(callback) { this.listeners.add(callback); return () => this.listeners.delete(callback) }
  _read() { try { const rows = JSON.parse(window.localStorage.getItem(this.key) || '[]'); return Array.isArray(rows) ? rows.filter(item => item && item.id && item.body) : [] } catch { return [] } }
  _write(rows) { try { window.localStorage.setItem(this.key, JSON.stringify(rows)) } catch {} ; this.listeners.forEach(listener => { try { listener(rows) } catch {} }); try { window.dispatchEvent?.(new CustomEvent(this.event)) } catch {} }
}
