import { mkdtemp, rm } from 'node:fs/promises'
import { spawn } from 'node:child_process'
import { tmpdir } from 'node:os'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

// 限制日志大小，隐藏本地 Web 登录令牌。
const safeLog = text => text.replace(/([?&]token=)[^\s]+/g, '$1[已隐藏]')
function launch(command, args, options) {
  const child = spawn(command, args, { ...options, stdio: ['ignore', 'pipe', 'pipe'], detached: process.platform !== 'win32' })
  let output = '', error
  const append = chunk => { output = (output + chunk.toString()).slice(-65536) }
  child.stdout.on('data', append)
  child.stderr.on('data', append)
  child.once('error', value => { error = value })
  const closed = new Promise(resolveClose => child.once('close', (code, signal) => resolveClose({ code, signal, error })))
  const kill = signal => {
    if (child.exitCode !== null || child.signalCode !== null || !child.pid) return
    try {
      if (process.platform === 'win32') child.kill(signal)
      else process.kill(-child.pid, signal)
    } catch (error) { if (error.code !== 'ESRCH') throw error }
  }
  const stop = async () => {
    kill('SIGTERM')
    const timer = setTimeout(() => kill('SIGKILL'), 2000)
    try { return await closed } finally { clearTimeout(timer) }
  }
  return { child, closed, stop, output: () => output }
}

async function run(command, args, options) {
  const processRun = launch(command, args, options)
  let timedOut = false
  const timer = setTimeout(() => { timedOut = true; void processRun.stop() }, 90_000)
  try {
    const result = await processRun.closed
    if (timedOut || result.error || result.code !== 0) throw new Error('安装命令失败或超时：' + safeLog(processRun.output()), { cause: result.error })
    return processRun.output()
  } finally { clearTimeout(timer) }
}

// URL 只是就绪线索；HTTP 可用且进程正常退出才算通过。
export async function bootWeb(command, options = {}, args = ['web', '--no-open', '--port', '0'], timeoutMs = 20_000) {
  const processRun = launch(command, args, options)
  const controller = new AbortController()
  let failure
  const timer = setTimeout(() => controller.abort(new Error('DSH Web 启动或 HTTP 探测超时')), timeoutMs)
  try {
    const url = await new Promise((resolveUrl, rejectUrl) => {
      const abort = () => rejectUrl(controller.signal.reason)
      controller.signal.addEventListener('abort', abort, { once: true })
      const observe = () => {
        const match = processRun.output().match(/dsh web: (http:\/\/[^\s]+)[\r\n]/)
        if (match) { controller.signal.removeEventListener('abort', abort); resolveUrl(match[1]) }
      }
      processRun.child.stdout.on('data', observe)
      processRun.child.stderr.on('data', observe)
      void processRun.closed.then(result => {
        controller.signal.removeEventListener('abort', abort)
        rejectUrl(new Error('DSH 在就绪前退出：' + safeLog(processRun.output()), { cause: result.error }))
      })
    })
    // DSH 用一次性 token 换取 Cookie，再跳转到不带 token 的页面。
    let current = new URL(url), verified = false
    const origin = current.origin, cookies = new Map()
    for (let hop = 0; hop < 4; hop++) {
      const response = await fetch(current, { signal: controller.signal, redirect: 'manual', headers: { cookie: [...cookies].map(([key, value]) => key + '=' + value).join('; ') } })
      await response.body?.cancel()
      for (const value of response.headers.getSetCookie()) {
        const cookie = value.split(';')[0], index = cookie.indexOf('=')
        if (index > 0) cookies.set(cookie.slice(0, index), cookie.slice(index + 1))
      }
      if (response.ok) { verified = true; break }
      const location = response.headers.get('location')
      if (![301, 302, 303, 307, 308].includes(response.status) || !location) throw new Error('DSH HTTP 探测失败：' + response.status)
      current = new URL(location, current)
      if (current.origin !== origin) throw new Error('DSH 不得跳转到其他来源')
    }
    if (!verified) throw new Error('DSH HTTP 跳转次数超限')
    controller.signal.throwIfAborted()
  } catch (error) { failure = error }
  finally {
    clearTimeout(timer)
    // 等待 close 后，调用方才可删除临时 profile。
    const result = await processRun.stop()
    if (!failure && (result.error || result.code !== 0)) failure = new Error('DSH 未正常退出：' + safeLog(processRun.output()), { cause: result.error })
  }
  if (failure) throw failure
}

export async function main() {
  const pluginDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const dshHome = await mkdtemp(join(tmpdir(), 'dsh-profile-smoke-'))
  const env = { ...process.env, DSH_HOME: dshHome, DSH_TELEMETRY_DISABLED: '1', MEMORY_CENTER_WORKSPACE: '', MEMORY_CENTER_DSH_CONFIG: join(dshHome, 'missing-registry.json') }
  const options = { env, cwd: dshHome }
  const dsh = process.env.DSH_BIN || 'dsh'
  try {
    // 验证实际发布文件，避免 link 模式掩盖漏打包文件。
    const packed = await run('npm', ['pack', pluginDir, '--ignore-scripts', '--json', '--pack-destination', dshHome], options)
    const tarball = join(dshHome, JSON.parse(packed)[0].filename)
    await run(dsh, ['plugin', '--profile', 'web', 'add', tarball], options)
    await bootWeb(dsh, options)
    process.stdout.write('DSH 打包安装、HTTP 探测与退出烟测通过。\n')
  } finally { await rm(dshHome, { recursive: true, force: true }) }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await main()
