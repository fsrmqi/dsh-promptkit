// 复用真 React + jsdom 的交互回归，避免手写 hook 桩与组件实现脱节。
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const testFile = fileURLToPath(new URL('../test/ui-regression.test.js', import.meta.url))
const result = spawnSync(process.execPath, ['--test', testFile], { stdio: 'inherit' })
process.exit(result.status || (result.error ? 1 : 0))
