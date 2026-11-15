import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = new URL('../', import.meta.url)
const requireDocs = createRequire(new URL('docs/package.json', root))
const { buildFilesystemManifest, defineDocsDiscoveryConfig } = await import(
  requireDocs.resolve('@chakra-docs/source-filesystem')
)

test('README documentation links and fragments resolve against real published pages', async () => {
  const manifest = await buildFilesystemManifest({
    config: defineDocsDiscoveryConfig({
      rootDir: fileURLToPath(new URL('docs/', root)),
      collections: [
        {
          id: 'docs',
          name: 'Documentation',
          contentPath: 'content',
          basePath: '/docs',
          include: ['**/*.md'],
        },
      ],
    }),
  })
  const readme = readFileSync(new URL('README.md', root), 'utf8')
  let docsLinks = 0
  for (const [, href] of readme.matchAll(/\]\(([^)\s]+)\)/g)) {
    if (href.startsWith('#')) continue
    if (!/^[a-z][a-z\d+.-]*:/i.test(href)) {
      assert.ok(existsSync(new URL(href.split('#')[0], root)), href)
      continue
    }
    const url = new URL(href)
    if (url.origin !== 'https://react-structured.dev') continue
    if (url.pathname === '/') continue
    docsLinks++
    const page = manifest.byRoute[url.pathname]
    assert.ok(page, href)
    if (url.hash)
      assert.ok(
        page.headings.some(({ id }) => `#${id}` === url.hash),
        href,
      )
  }
  assert.ok(docsLinks >= 8, 'README links to the focused guides and reference')
})
