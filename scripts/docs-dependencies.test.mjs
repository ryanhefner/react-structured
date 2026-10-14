import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'

const read = (file) =>
  readFileSync(new URL('../' + file, import.meta.url), 'utf8')

test('every locked source-map-js version includes the indexed-map DoS fix', () => {
  const versions = [
    ...read('pnpm-lock.yaml').matchAll(/^ {2}source-map-js@(\d+\.\d+\.\d+):/gm),
  ]
  assert.ok(versions.length > 0)
  for (const [, version] of versions) {
    const [major, minor, patch] = version.split('.').map(Number)
    assert.ok(
      major > 1 || (major === 1 && (minor > 2 || (minor === 2 && patch >= 2))),
      version,
    )
  }
})

test('every locked nanoid 3 release includes the zero-size generator fix', () => {
  const versions = [
    ...read('pnpm-lock.yaml').matchAll(/^ {2}nanoid@(3\.\d+\.\d+):/gm),
  ]
  assert.ok(versions.length > 0)
  for (const [, version] of versions) {
    const [, minor, patch] = version.split('.').map(Number)
    assert.ok(minor > 3 || (minor === 3 && patch >= 18), version)
  }
})

test('site analytics uses the pinned public React Fathom release', () => {
  assert.equal(
    JSON.parse(read('docs/package.json')).dependencies['react-fathom'],
    '0.3.0',
  )
  assert.doesNotMatch(read('pnpm-lock.yaml'), /file:.*\.yalc\/react-fathom/)
  assert.match(read('pnpm-lock.yaml'), /react-fathom@0\.3\.0:/)
})

test('the docs site uses pinned published Chakra Docs packages, not local links', () => {
  const manifest = JSON.parse(read('docs/package.json'))
  const dependencies = Object.entries(manifest.dependencies).filter(([name]) =>
    name.startsWith('@chakra-docs/'),
  )
  assert.ok(dependencies.length >= 4)
  for (const [name, version] of dependencies) {
    assert.equal(version, '0.3.0', name)
  }
  assert.doesNotMatch(read('pnpm-lock.yaml'), /file:.*\.yalc\/@chakra-docs\//)
})
