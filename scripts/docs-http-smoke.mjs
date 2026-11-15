import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { JSDOM } from 'jsdom'

const output = fileURLToPath(new URL('../docs/out/', import.meta.url))
const mime = {
  '.html': 'text/html; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.png': 'image/png',
  '.md': 'text/markdown; charset=utf-8',
}

// This checks the built static artifact through HTTP, not Next's development
// server. Production hosts must provide equivalent clean-URL and real-404 rules.
const server = createServer(async (request, response) => {
  try {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end()
      return
    }
    const pathname = decodeURIComponent(
      new URL(request.url, 'http://localhost').pathname,
    )
    const requested = path.resolve(output, '.' + pathname)
    const relative = path.relative(output, requested)
    if (relative.startsWith('..') || path.isAbsolute(relative)) {
      response.writeHead(400).end()
      return
    }
    const candidates =
      pathname === '/'
        ? [path.join(output, 'index.html')]
        : [requested, requested + '.html', path.join(requested, 'index.html')]
    let content
    let filename
    for (const candidate of candidates) {
      try {
        content = await readFile(candidate)
        filename = candidate
        break
      } catch (error) {
        if (!['ENOENT', 'EISDIR', 'ENOTDIR'].includes(error.code)) throw error
      }
    }
    const status = content ? 200 : 404
    if (!content) {
      content = await readFile(path.join(output, '404.html'))
      filename = '404.html'
    }
    response.writeHead(status, {
      'Content-Type':
        mime[path.extname(filename)] ?? 'application/octet-stream',
      'Content-Length': content.length,
      'X-Content-Type-Options': 'nosniff',
    })
    response.end(request.method === 'HEAD' ? undefined : content)
  } catch {
    response.writeHead(500).end()
  }
})

try {
  await new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(0, '127.0.0.1', resolve)
  })
  const origin = `http://127.0.0.1:${server.address().port}`
  const request = (route, method = 'GET') =>
    fetch(origin + route, { method, signal: AbortSignal.timeout(10_000) })

  for (const route of ['/', '/docs', '/docs/getting-started', '/withoss']) {
    const response = await request(route)
    assert.equal(response.status, 200, route)
    const dom = new JSDOM(await response.text())
    try {
      const document = dom.window.document
      assert.equal(document.querySelectorAll('main').length, 1, route)
      assert.equal(document.querySelectorAll('h1').length, 1, route)
      assert.equal(
        document.querySelector('link[rel="canonical"]')?.href,
        new URL(route, 'https://react-structured.dev').href,
        route,
      )
      assert.ok(
        document.querySelector('script[type="application/ld+json"]'),
        route,
      )
    } finally {
      dom.window.close()
    }
    const head = await request(route, 'HEAD')
    assert.equal(head.status, 200, route)
    assert.equal(await head.text(), '', route)
  }
  for (const file of [
    'robots.txt',
    'sitemap.xml',
    'llms.txt',
    'llms-full.txt',
  ]) {
    const response = await request('/' + file)
    assert.equal(response.status, 200, file)
    assert.match(
      response.headers.get('content-type'),
      file.endsWith('.xml') ? /application\/xml/ : /text\/plain/,
    )
    assert.match(await response.text(), /https:\/\/react-structured\.dev/, file)
    const head = await request('/' + file, 'HEAD')
    assert.equal(head.status, 200, file)
    assert.equal(await head.text(), '', file)
  }
  const markdown = await request('/markdown/getting-started.md')
  assert.equal(markdown.status, 200)
  assert.match(markdown.headers.get('content-type'), /text\/markdown/)
  assert.match(await markdown.text(), /react-structured/)
  for (const route of ['/not-a-real-page', '/docs/not-a-real-page']) {
    assert.equal((await request(route)).status, 404, route)
    assert.equal((await request(route, 'HEAD')).status, 404, route)
  }
  assert.equal((await request('/docs', 'POST')).status, 405)
  console.log(
    'Static docs HTTP smoke passed: content, metadata, JSON-LD, discovery files, Markdown, HEAD, and real 404s.',
  )
} finally {
  if (server.listening) {
    server.closeAllConnections()
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    )
  }
}
