import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

const pkg = JSON.parse(
  readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
)
const readme = readFileSync(new URL('../README.md', import.meta.url), 'utf8')

test('package metadata and README provide focused discovery and support paths', () => {
  assert.match(pkg.description, /JSON-LD/)
  assert.equal(pkg.homepage, 'https://react-structured.dev')
  assert.equal(
    pkg.bugs.url,
    'https://github.com/ryanhefner/react-structured/issues',
  )
  assert.equal(new Set(pkg.keywords).size, pkg.keywords.length)
  for (const keyword of [
    'react',
    'json-ld',
    'schema-dts',
    'structured-data',
    'typescript',
  ]) {
    assert.ok(pkg.keywords.includes(keyword), keyword)
  }
  assert.match(pkg.author, /Ryan Hefner/)
  assert.ok(
    pkg.contributors.some(
      ({ name, url }) =>
        name === 'Commune Software' && url === 'https://commune.software',
    ),
  )
  for (const filename of ['README.md', 'LICENSE'])
    assert.ok(pkg.files.includes(filename))
  for (const url of [
    pkg.homepage,
    `${pkg.homepage}/docs/getting-started`,
    `${pkg.homepage}/docs/reference`,
    pkg.bugs.url,
  ]) {
    assert.ok(readme.includes(`](${url})`), url)
  }
  assert.match(readme, /<!-- quickstart:start -->[\s\S]*```tsx/)
  assert.match(readme, /<!-- quickstart:end -->/)
  assert.match(pkg.scripts.build, /node scripts\/readme-smoke\.mjs/)
})
