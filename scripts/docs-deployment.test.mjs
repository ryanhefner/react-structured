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
