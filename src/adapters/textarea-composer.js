import { Composer } from '../core/composer.js'

// 示例 Composer：写入任意 <textarea> 元素。
// 闭源版（DSH 插件）可继承 Composer 并桥接到 inputActions.setDraft。
export class TextareaComposer extends Composer {
  /** @param {HTMLTextAreaElement} el */
  constructor(el) {
    super()
    this.el = el
    this._cb = null
  }

  getDraft() { return this.el ? this.el.value : '' }

  write(text) {
    if (!this.el) return
    this.el.value = text
    this.el.dispatchEvent(new Event('input', { bubbles: true }))
    this._cb?.(text)
  }

  onChange(cb) { this._cb = cb }
}
