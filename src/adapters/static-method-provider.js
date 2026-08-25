import { MethodProvider } from '../core/method-provider.js'
import { BUILTIN_METHODS } from '../methods/builtin.js'

// 开源示例 MethodProvider：内置静态方法 + 本地 compose（不依赖后端 prompt-compose 视图）。
// 闭源版可替换为接 Memory Center / DSH 私有 catalog 的实现。
export class StaticMethodProvider extends MethodProvider {
  async list() { return BUILTIN_METHODS }

  async compose({ methodId, question, facts, constraints, options }) {
    const method = BUILTIN_METHODS.find(m => m.id === methodId) || BUILTIN_METHODS[0]
    const parts = [
      `# ${method.title}`,
      method.purpose && `目标：${method.purpose}`,
      question && `问题：${question}`,
      facts && `事实：${facts}`,
      constraints && `约束：${constraints}`,
      options && `备选：${options}`,
    ].filter(Boolean)
    const prompt = parts.join('\n\n')
    return { prompt, estimated_chars: prompt.length, method }
  }

  async getTemplate(methodId) {
    const m = BUILTIN_METHODS.find(x => x.id === methodId)
    return { prompt: `# ${m?.title || '方法'}\n\n` }
  }
}
