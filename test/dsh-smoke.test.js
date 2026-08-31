import test from 'node:test'
import assert from 'node:assert/strict'
import { bootWeb } from '../scripts/dsh-profile-smoke.mjs'

const fixture = (status, exitCode, ignoreStop = false) => `
  const server = require('node:http').createServer((req, res) => { res.writeHead(${status}); res.end('测试'); });
  process.on('SIGTERM', () => { ${ignoreStop ? '' : `server.close(() => setTimeout(() => process.exit(${exitCode}), 80));`} });
  server.listen(0, '127.0.0.1', () => console.log('dsh web: http://127.0.0.1:' + server.address().port + '/?token=synthetic'));
`
test('烟测等待 HTTP 响应与正常退出', async () => {
  await bootWeb(process.execPath, {}, ['-e', fixture(200, 0)], 3000)
})
test('仅打印 URL 但 HTTP 失败不能通过', async () => {
  await assert.rejects(bootWeb(process.execPath, {}, ['-e', fixture(503, 0)], 3000), /HTTP 探测失败/)
})
test('就绪后的清理失败不能通过', async () => {
  await assert.rejects(bootWeb(process.execPath, {}, ['-e', fixture(200, 7)], 3000), /未正常退出/)
})
test('拒绝退出的子进程会被强制回收并标记失败', { timeout: 7000 }, async () => {
  await assert.rejects(bootWeb(process.execPath, {}, ['-e', fixture(200, 0, true)], 3000), /未正常退出/)
})
test('启动失败与就绪超时均清理子进程', async () => {
  await assert.rejects(bootWeb(process.execPath, {}, ['-e', 'process.exit(2)'], 3000), /就绪前退出/)
  await assert.rejects(bootWeb(process.execPath, {}, ['-e', 'setInterval(() => {}, 1000)'], 150), /超时/)
})

test('DSH 登录跳转后携带 Cookie 验证最终页面', async () => {
  const code = `
    const server = require('node:http').createServer((req, res) => {
      if(req.url.includes('token=')) { res.writeHead(302, {location:'/', 'set-cookie':'auth=test; HttpOnly'}); res.end(); }
      else { res.writeHead(req.headers.cookie === 'auth=test' ? 200 : 401); res.end('页面'); }
    });
    process.on('SIGTERM', () => server.close(() => process.exit(0)));
    server.listen(0, '127.0.0.1', () => console.log('dsh web: http://127.0.0.1:' + server.address().port + '/?token=synthetic'));
  `
  await bootWeb(process.execPath, {}, ['-e', code], 3000)
})
