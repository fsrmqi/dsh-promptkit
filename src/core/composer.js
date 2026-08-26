// Composer：写入目标输入框的抽象。
// 开源版可接任意 <textarea>，闭源版（DSH 插件）接消息框 inputActions。

export class Composer {
  /** @returns {string} 当前草稿 */
  getDraft() { return '' }

  /** @param {string} text 写入目标 */
  write(text) { throw new Error('Composer.write() 未实现') }

  /** @returns {{start:number,end:number,text:string,draft:string}|null} 当前选区（可选实现） */
  getSelection() { return null }

  /** 用 text 替换给定选区；不支持选区的宿主可不实现。 */
  replaceSelection(text, selection = this.getSelection()) { this.write(text) }

  /**
   * 订阅草稿变化（含用户手动输入与 write() 写入），组件据此同步本地状态。
   * @param {(text:string)=>void} cb
   * @returns {()=>void} 取消订阅函数（可选实现）
   */
  onChange(cb) { return () => {} }
}

/** 构造 “前缀 + 新内容”：若当前草稿非空，插入空行分隔。 */
export function withPrefix(current, next) {
  const cur = (current || '').trim()
  return cur ? `${cur}\n\n${next}` : next
}
