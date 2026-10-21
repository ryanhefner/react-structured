import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import test from 'node:test'

test('package tooling runs even when docs runtime imports are unavailable', () => {
  const docs = new URL('../docs/', import.meta.url).href
  const tooling = new URL('./tooling.test.mjs', import.meta.url).href
  const result = spawnSync(
    process.execPath,
    [
      '--input-type=module',
      '--eval',
      `
        import { registerHooks } from 'node:module'
        registerHooks({
          resolve(specifier, context, nextResolve) {
            const resolved = nextResolve(specifier, context)
            if (resolved.url.startsWith(${JSON.stringify(docs)})) {
              throw new Error('Package tooling must not load docs runtime code: ' + resolved.url)
            }
            return resolved
          }
        })
        await import(${JSON.stringify(tooling)})
      `,
    ],
    { encoding: 'utf8', timeout: 30000 },
  )
  assert.ifError(result.error)
  assert.equal(result.status, 0, result.stdout + result.stderr)
})
