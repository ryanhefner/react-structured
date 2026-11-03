import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import nextConfig from '../docs/next.config.mjs'

const vercel = JSON.parse(
  readFileSync(new URL('../docs/vercel.json', import.meta.url), 'utf8'),
)

test('Vercel looks for Next.js build manifests, not static-export assets', () => {
  assert.equal(vercel.outputDirectory ?? '.next', nextConfig.distDir ?? '.next')
  assert.equal(vercel.framework, 'nextjs')
  assert.ok(!Object.hasOwn(vercel, 'outputDirectory'))
  assert.equal(nextConfig.output, 'export')
  assert.equal(vercel.buildCommand, 'cd .. && pnpm run docs:build')
})

test('documentation verification checks the exported site over HTTP independently of publishing', () => {
  const pkg = JSON.parse(
    readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
  )
  assert.match(pkg.scripts['docs:verify'], /pnpm run docs:smoke/)
  assert.equal(pkg.scripts['docs:smoke'], 'node scripts/docs-http-smoke.mjs')
  assert.doesNotMatch(pkg.scripts.verify, /docs:/)
  assert.equal(pkg.scripts.prepublishOnly, 'pnpm run verify')
})
