import { readFileSync } from 'node:fs'

const pkg = JSON.parse(
  readFileSync(new URL('../docs/package.json', import.meta.url)),
)
const workspace = readFileSync(
  new URL('../pnpm-workspace.yaml', import.meta.url),
  'utf8',
)
const local = Object.entries(pkg.dependencies)
  .filter(
    ([name, version]) =>
      name.startsWith('@chakra-docs/') &&
      !/^\d+\.\d+\.\d+(?:-[\w.-]+)?$/.test(version),
  )
  .map(([name]) => name)

if (local.length || /file:docs\/\.yalc/.test(workspace)) {
  throw new Error(
    `Docs deployment requires immutable public Chakra Docs versions. Replace local yalc dependencies and core/search overrides after the Chakra Docs release: ${local.join(', ')}. See docs/README.md.`,
  )
}

console.log('Docs use immutable public Chakra Docs dependencies.')
