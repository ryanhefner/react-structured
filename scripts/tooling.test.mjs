import './test-suites.test.mjs'
import assert from 'node:assert/strict'
import { readFileSync, existsSync } from 'node:fs'
import test from 'node:test'

const read = (file) =>
  readFileSync(new URL(`../${file}`, import.meta.url), 'utf8')

test('development and CI use the pinned Node 24 and pnpm toolchain', () => {
  const pkg = JSON.parse(read('package.json'))
  assert.equal(read('.nvmrc').trim(), '24.18.0')
  assert.equal(read('.node-version').trim(), '24.18.0')
  assert.equal(pkg.packageManager, 'pnpm@11.25.0')
  assert.ok(existsSync(new URL('../pnpm-lock.yaml', import.meta.url)))
  assert.ok(!existsSync(new URL('../package-lock.json', import.meta.url)))
  for (const workflow of ['ci', 'publish']) {
    const yaml = read(`.github/workflows/${workflow}.yml`)
    assert.match(yaml, /node-version-file: \.nvmrc/)
    assert.match(
      yaml,
      /pnpm(?: --filter react-structured)? install --frozen-lockfile/,
    )
    assert.doesNotMatch(yaml, /npm ci|cache: npm/)
  }
  assert.equal(pkg.peerDependencies.react, '>=16.14')
  assert.match(
    read('.github/workflows/publish.yml'),
    /npm publish --access public/,
  )
})
