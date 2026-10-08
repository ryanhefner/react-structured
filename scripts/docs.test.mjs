import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { readFileSync, existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import { JSDOM } from 'jsdom'
import axe from 'axe-core'

const root = fileURLToPath(new URL('..', import.meta.url))
const docsRoot = path.join(root, 'docs')
const docsRequire = createRequire(path.join(docsRoot, 'package.json'))
const { buildFilesystemManifest, defineDocsDiscoveryConfig } = await import(
  docsRequire.resolve('@chakra-docs/source-filesystem')
)
const { createDocsMarkdown } = await import(
  docsRequire.resolve('@chakra-docs/core')
)
const { pageMetadata, SITE_URL } = await import('../docs/lib/site.ts')
const { getOgImageContent, isOgImageCapturePath } =
  await import('../docs/lib/og-image.ts')
const manifest = await buildFilesystemManifest({
  config: defineDocsDiscoveryConfig({
    rootDir: docsRoot,
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

const html = (route) =>
  path.join(
    docsRoot,
    'out',
    route === '/' ? 'index.html' : `${route.slice(1)}.html`,
  )
const load = (route) =>
  new JSDOM(readFileSync(html(route), 'utf8'), {
    url: new URL(route, SITE_URL).href,
  }).window.document
const text = (node) => node?.textContent.replace(/\s+/g, ' ').trim()

test('static LLM files index real Markdown exports and include every published body', () => {
  const index = readFileSync(path.join(docsRoot, 'out/llms.txt'), 'utf8')
  const full = readFileSync(path.join(docsRoot, 'out/llms-full.txt'), 'utf8')
  assert.ok(index.startsWith('# react-structured\n'))
  assert.ok(index.includes(`${SITE_URL}/llms-full.txt`))
  for (const page of manifest.pages) {
    if (page.frontmatter.draft || page.frontmatter.hidden) continue
    const markdownPath = `/markdown/${page.slug.join('/') || 'index'}.md`
    const url = `${SITE_URL}${markdownPath}`
    assert.ok(index.includes(`](${url})`), page.route)
    assert.ok(full.includes(`Source: ${url}`), page.route)
    assert.ok(full.includes(page.body.trim()), page.route)
    assert.ok(existsSync(path.join(docsRoot, 'out', markdownPath.slice(1))))
  }
})

test('OSS credits render separate named library and site sections', () => {
  const doc = load('/withoss')
  for (const [id, title] of [
    ['library', 'Library and packages'],
    ['site', 'Documentation site'],
  ]) {
    const section = doc.querySelector(`section[aria-labelledby="oss-${id}"]`)
    assert.equal(text(section?.querySelector('h2')), title)
    assert.ok(section?.querySelectorAll('li').length > 0)
  }
})

test('all nine documentation pages have one page heading and discoverable search records', () => {
  assert.equal(manifest.pages.length, 9)
  const records = new Set(manifest.search.map((record) => record.route))
  for (const page of manifest.pages) {
    assert.ok(records.has(page.route), page.route)
    const doc = load(page.route)
    assert.equal(doc.querySelectorAll('h1').length, 1, page.route)
    assert.equal(text(doc.querySelector('h1')), page.title)
    for (const heading of doc.querySelectorAll('h2, h3')) {
      assert.notEqual(
        text(heading)?.replace(/\s*#$/, ''),
        page.title,
        page.route,
      )
    }
    assert.ok(doc.querySelector('main'), page.route)
    assert.ok(doc.querySelector('nav'), page.route)
    assert.ok(
      [...doc.querySelectorAll('button')].some((button) =>
        text(button).includes('Copy page'),
      ),
      page.route,
    )
  }
})

test('generated Markdown endpoints contain complete, nonduplicated page copy', () => {
  for (const page of manifest.pages) {
    const slug = page.slug.length ? page.slug.join('/') : 'index'
    const actual = readFileSync(
      path.join(docsRoot, 'out/markdown', `${slug}.md`),
      'utf8',
    )
    assert.equal(actual, createDocsMarkdown(page), page.route)
    assert.ok(actual.startsWith('---\n'))
    assert.equal(
      actual.split(`title: ${JSON.stringify(page.title)}\n`).length - 1,
      1,
    )
    assert.ok(actual.includes(page.description))
  }
})

test('all local links and heading fragments resolve in the exported site', () => {
  for (const route of [
    '/',
    '/withoss',
    ...manifest.pages.map((page) => page.route),
  ]) {
    const doc = load(route)
    for (const link of doc.querySelectorAll('a[href]')) {
      const target = new URL(
        link.getAttribute('href'),
        new URL(route, SITE_URL),
      )
      if (target.origin !== SITE_URL) continue
      const pathname =
        decodeURIComponent(target.pathname).replace(/\/$/, '') || '/'
      const file = pathname.startsWith('/markdown/')
        ? path.join(docsRoot, 'out', pathname.slice(1))
        : html(pathname)
      assert.ok(existsSync(file), `${route} links to missing ${target.href}`)
      if (target.hash && !pathname.startsWith('/markdown/')) {
        assert.ok(
          load(pathname).getElementById(
            decodeURIComponent(target.hash.slice(1)),
          ),
          `${route} has broken anchor ${target.href}`,
        )
      }
    }
  }
})

test('metadata, sitemap, and fallback PNG are valid for the production domain', () => {
  assert.equal(SITE_URL, 'https://react-structured.dev')
  const saved = process.env.NEXT_PUBLIC_OG_IMAGE_BASE_URL
  try {
    delete process.env.NEXT_PUBLIC_OG_IMAGE_BASE_URL
    assert.equal(
      pageMetadata(manifest.pages[0]).openGraph.images[0].url,
      `${SITE_URL}/social-image.png`,
    )
    process.env.NEXT_PUBLIC_OG_IMAGE_BASE_URL =
      'https://example.opengraphs.com/react-structured.dev/'
    assert.equal(
      pageMetadata({ route: '/docs/schema', title: 'Schema' }).openGraph
        .images[0].url,
      'https://example.opengraphs.com/react-structured.dev/docs/schema/social-image.png',
    )
  } finally {
    if (saved === undefined) delete process.env.NEXT_PUBLIC_OG_IMAGE_BASE_URL
    else process.env.NEXT_PUBLIC_OG_IMAGE_BASE_URL = saved
  }
  const sitemap = readFileSync(path.join(docsRoot, 'out/sitemap.xml'), 'utf8')
  for (const page of manifest.pages) {
    const doc = load(page.route)
    assert.equal(
      doc.querySelector('link[rel="canonical"]').href,
      `${SITE_URL}${page.route}`,
    )
    assert.ok(sitemap.includes(`${SITE_URL}${page.route}`))
  }
  assert.ok(!sitemap.includes('social-image'))
  const png = readFileSync(path.join(docsRoot, 'out/social-image.png'))
  assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a')
  assert.equal(png.readUInt32BE(16), 1200)
  assert.equal(png.readUInt32BE(20), 630)
})

test('OG capture routes render fixed-size content without site chrome and are noindex', () => {
  const captures = [
    '/social-image',
    '/og-image',
    '/withoss/social-image',
    '/og-image/withoss',
  ]
  for (const page of manifest.pages)
    captures.push(`${page.route}/social-image`, `/og-image${page.route}`)
  for (const route of captures) {
    const doc = load(route)
    assert.equal(
      doc.querySelector('meta[name="robots"]').content,
      'noindex, nofollow',
      route,
    )
    assert.equal(doc.querySelectorAll('header, footer, nav').length, 0, route)
    assert.ok(doc.querySelector('[aria-label="Open Graph image"]'), route)
  }
  assert.equal(isOgImageCapturePath('/docs/schema/social-image'), true)
  assert.equal(isOgImageCapturePath('/docs/schema/social-image.png'), false)
  const copy = getOgImageContent(
    new URLSearchParams({
      title: 'x'.repeat(1000),
      description: '<script>alert(1)</script>',
    }),
  )
  assert.equal(copy.title.length, 100)
  assert.equal(copy.description, '<script>alert(1)</script>')
})

test('site uses the shared font kit, semantic footer, and its own JSON-LD renderer', () => {
  const doc = load('/')
  assert.equal(
    doc.querySelectorAll(
      'link[href="https://kits.fontstack.com/kit/o0v0t0oi.css"]',
    ).length,
    1,
  )
  assert.ok(doc.querySelector('footer[aria-label="Site credits and license"]'))
  assert.match(text(doc.querySelector('footer')), /2026/)
  assert.ok(
    doc.querySelector(
      'a[href="https://commune.software"] img[src="/assets/commune-software-wordmark.svg"]',
    ),
  )
  assert.ok(doc.querySelector('a[href="/withoss"] img[src="/assets/oss.svg"]'))
  const jsonld = JSON.parse(doc.querySelector('#website-jsonld').textContent)
  assert.equal(jsonld['@context'], 'https://schema.org')
  assert.equal(jsonld['@type'], 'WebSite')
  assert.equal(jsonld.url, SITE_URL)
})

test('tables, code blocks, and callouts are actually rendered', () => {
  assert.ok(load('/docs/reference').querySelector('table thead th'))
  const schema = load('/docs/schema')
  assert.ok(schema.querySelector('pre code'))
  assert.ok(schema.querySelector('button[aria-label="Copy code"]'))
  assert.ok(
    load('/docs/getting-started').querySelector(
      '[data-scope="chakra-docs-callout"], [data-part="callout"], [role="note"]',
    ),
  )
})

test('npm package stays library-only and does not include docs dependencies or artifacts', () => {
  const packed = JSON.parse(
    execFileSync('npm', ['pack', '--dry-run', '--json', '--ignore-scripts'], {
      cwd: root,
      encoding: 'utf8',
      env: { ...process.env, npm_config_cache: path.join(root, '.npm-cache') },
    }),
  )[0]
  assert.ok(packed.files.some((file) => file.path === 'dist/esm/index.mjs'))
  assert.ok(packed.files.some((file) => file.path === 'types/index.d.ts'))
  assert.ok(
    !packed.files.some(
      (file) => file.path.startsWith('docs/') || file.path.includes('.yalc'),
    ),
  )
  const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'))
  assert.deepEqual(Object.keys(pkg.dependencies), ['schema-dts'])
  assert.equal(pkg.peerDependencies.react, '>=16.14')
})

test('exported pages have no detectable structural accessibility violations', async () => {
  for (const route of ['/', '/docs', '/docs/schema', '/withoss']) {
    const dom = new JSDOM(readFileSync(html(route), 'utf8'), {
      url: new URL(route, SITE_URL).href,
      runScripts: 'outside-only',
    })
    // Only evaluate the installed, trusted axe runtime, not document scripts.
    dom.window.eval(axe.source)
    const result = await dom.window.axe.run(dom.window.document, {
      rules: { 'color-contrast': { enabled: false } },
    })
    assert.equal(
      result.violations.length,
      0,
      `${route}: ${JSON.stringify(
        result.violations.map((violation) => ({
          id: violation.id,
          elements: violation.nodes.map((node) => node.target),
        })),
      )}`,
    )
    dom.window.close()
  }
})
