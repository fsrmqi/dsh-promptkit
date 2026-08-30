import { readdirSync, readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const readJson = file => JSON.parse(readFileSync(resolve(root, file), 'utf8'))
const version = readJson('package.json').version
const lock = readJson('package-lock.json')
if ([lock.version, lock.packages[''].version, readJson('ui/package.json').version].some(value => value !== version)) throw new Error('根包、锁文件与 UI 清单版本不一致。')
for (const [file, heading] of [['CHANGELOG.md', `## [${version}] - `], ['docs/UPGRADE-HISTORY.md', `## ${version}：`]]) {
  if (!readFileSync(resolve(root, file), 'utf8').split('\n').some(line => line.startsWith(heading))) throw new Error(`${file} 缺少 ${version} 的版本记录。`)
}
function check(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) check(path)
    else if (/\.(?:js|mjs)$/.test(entry.name)) {
      const result = spawnSync(process.execPath, ['--check', path], { stdio: 'inherit' })
      if (result.status !== 0) process.exit(result.status || 1)
    }
  }
}
for (const directory of ['src', 'dsh', 'ui', 'scripts']) check(resolve(root, directory))
// 同时检查 ESM 导出与相对依赖；不能只依赖剥离 import 后的拼接产物。
await import('../src/index.js')
console.log('源码依赖与全部脚本语法检查通过。')
