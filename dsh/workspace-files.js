import { opendir } from 'node:fs/promises'
import { join, relative, sep } from 'node:path'

const IGNORED_DIRS = new Set(['node_modules', 'dist', 'build', 'coverage', '__pycache__'])
const compareFilePaths = (a, b) => a.length - b.length || (a < b ? -1 : a > b ? 1 : 0)

/** 有界、异步的目录索引；所有查询共享一次扫描，过期后按需刷新，不跟随符号链接。 */
export function createWorkspaceFileIndex({ workspaceRoots = [], fs, maxEntries = 20_000, maxDepth = 24, maxScanMs = 250, ttlMs = 5_000, now = Date.now } = {}) {
  let cached = null
  let scanning = null
  async function scan() {
    const started = now()
    const files = new Set()
    const queue = workspaceRoots.map(root => ({ root, dir: root, depth: 0 }))
    let visited = 0
    let truncated = false
    for (let cursor = 0; cursor < queue.length; cursor += 1) {
      if (visited >= maxEntries || now() - started >= maxScanMs) { truncated = true; break }
      const { root, dir, depth } = queue[cursor]
      try {
        // 测试可注入内存目录；生产使用 opendir，避免整目录同步读取阻塞模型流。
        const entries = fs?.readdirSync ? fs.readdirSync(dir, { withFileTypes: true }) : await (fs?.opendir || opendir)(dir)
        for await (const entry of entries) {
          if (visited >= maxEntries || now() - started >= maxScanMs) { truncated = true; break }
          visited += 1
          const full = join(dir, entry.name)
          if (entry.isDirectory()) {
            if (IGNORED_DIRS.has(entry.name) || entry.name.startsWith('.')) continue
            if (depth >= maxDepth) { truncated = true; continue }
            queue.push({ root, dir: full, depth: depth + 1 })
          } else if (entry.isFile()) {
            files.add(relative(root, full).split(sep).join('/'))
          }
        }
      } catch {
        // 无权限或扫描途中删除的目录不能算完整索引；其余目录仍可用。
        truncated = true
      }
    }
    return { files: [...files].sort(compareFilePaths), truncated, refreshedAt: now(), visited }
  }
  return {
    async search(query = '', limit = 20) {
      if (!cached || now() - cached.refreshedAt >= ttlMs) {
        if (!scanning) scanning = scan().then(result => { cached = result }).finally(() => { scanning = null })
        await scanning
      }
      const normalized = String(query).trim().toLowerCase()
      const boundedLimit = Number.isFinite(Number(limit)) ? Math.max(1, Math.min(50, Math.floor(Number(limit)) || 20)) : 20
      return { files: cached.files.filter(path => !normalized || path.toLowerCase().includes(normalized)).slice(0, boundedLimit), truncated: cached.truncated, indexedFiles: cached.files.length }
    },
  }
}
