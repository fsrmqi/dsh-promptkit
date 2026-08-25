import { Composer } from '../core/composer.js'

// 示例 Composer：写入任意 <textarea> 元素，并对用户输入保持响应（input 事件订阅）。
// 闭源版（DSH 插件）可继承 Composer 并桥接到 inputActions.setDraft。
export class TextareaComposer extends Composer {
  /** @param {HTMLTextAreaElement} el */
  constructor(el) {
    super()
    this.el = el
    this._subs = new Set()
    if (el) el.addEventListener('input', () => this._notify())
  }

  getDraft() { return this.el ? this.el.value : '' }

  write(text) {
    if (!this.el) return
    this.el.value = text
    // 派发 input 事件：既让宿主框架感知变化，也触发 _notify 同步订阅者。
    this.el.dispatchEvent(new Event('input', { bubbles: true }))
  }

  onChange(cb) {
    this._subs.add(cb)
    return () => { this._subs.delete(cb) }
  }

  _notify() {
    const text = this.getDraft()
    this._subs.forEach(cb => { try { cb(text) } catch {} })
  }
}
