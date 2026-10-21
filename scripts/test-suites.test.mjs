import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { matchesGlob } from 'node:path'
import test from 'node:test'
import library from '../vite.config.ts'
import docs from '../vite.docs.config.ts'

const read = (file) =>
  readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')
const included = (config, filename) =>
  config.test.include.some((pattern) => matchesGlob(`./${filename}`, pattern))

test('library and docs test suites are separate without dropping either suite', () => {
  for (const filename of ['Schema', 'RichResults', 'Graph', 'JsonLd']) {
    const file = `src/${filename}.test.tsx`
    assert.ok(included(library, file), file)
    assert.ok(!included(docs, file), file)
  }
  for (const filename of [
    'docs/lib/mobile-navigation.test.tsx',
    'docs/lib/site.test.ts',
    'docs/lib/structured-data.test.tsx',
    'docs/lib/future-feature.spec.ts',
  ]) {
    assert.ok(included(docs, filename), filename)
    assert.ok(!included(library, filename), filename)
  }
  assert.deepEqual(library.test.coverage.include, ['src/**/*.{ts,tsx}'])
})

test('CI runs docs tests with workspace dependencies and an already-built library', () => {
  const ci = read('.github/workflows/ci.yml')
  assert.match(ci, /pnpm install --frozen-lockfile/)
  assert.doesNotMatch(ci, /--filter react-structured install/)
  assert.match(ci, /pnpm run test:tooling/)
  assert.match(ci, /pnpm run test:ci/)
  assert.ok(ci.indexOf('pnpm run build') < ci.indexOf('pnpm run docs:test'))
  assert.match(ci, /pnpm run docs:test/)
  const workflow = read('.github/workflows/docs.yml')
  assert.match(workflow, /pnpm run docs:test/)
  assert.ok(
    workflow.indexOf('pnpm run docs:build') <
      workflow.indexOf('pnpm run docs:test'),
  )
  const pkg = JSON.parse(read('package.json'))
  assert.equal(pkg.scripts['test:ci'], 'vitest run --coverage')
  assert.equal(
    pkg.scripts['docs:test'],
    'vitest run --config vite.docs.config.ts',
  )
})
