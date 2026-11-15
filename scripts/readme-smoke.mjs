import assert from 'node:assert/strict'
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ts from 'typescript'

const root = fileURLToPath(new URL('../', import.meta.url))
const markdown = readFileSync(path.join(root, 'README.md'), 'utf8')
const start = '<!-- quickstart:start -->'
const end = '<!-- quickstart:end -->'
assert.equal(markdown.split(start).length, 2, 'one quick-start start marker')
assert.equal(markdown.split(end).length, 2, 'one quick-start end marker')
assert.ok(markdown.indexOf(start) < markdown.indexOf(end))
const section = markdown.split(start)[1].split(end)[0]
const examples = [...section.matchAll(/^```tsx\r?\n([\s\S]*?)^```\s*$/gm)]
assert.equal(examples.length, 1, 'one complete TSX quick start')

const cache = path.join(root, '.npm-cache')
mkdirSync(cache, { recursive: true })
const temporary = mkdtempSync(path.join(cache, 'readme-'))
try {
  const source = path.join(temporary, 'quickstart.tsx')
  const options = {
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    jsx: ts.JsxEmit.ReactJSX,
    strict: true,
    skipLibCheck: true,
    noUnusedLocals: true,
    noEmitOnError: true,
    types: ['react'],
  }
  const host = ts.createCompilerHost(options)
  const original = host.getSourceFile.bind(host)
  host.getSourceFile = (filename, languageVersion, onError, fresh) =>
    filename === source
      ? ts.createSourceFile(
          filename,
          examples[0][1],
          languageVersion,
          true,
          ts.ScriptKind.TSX,
        )
      : original(filename, languageVersion, onError, fresh)
  host.writeFile = (filename, content) => {
    assert.equal(filename, path.join(temporary, 'quickstart.js'))
    writeFileSync(path.join(temporary, 'quickstart.mjs'), content)
  }
  const program = ts.createProgram([source], options, host)
  const diagnostics = ts.getPreEmitDiagnostics(program)
  assert.equal(
    diagnostics.length,
    0,
    ts.formatDiagnosticsWithColorAndContext(diagnostics, {
      getCurrentDirectory: () => root,
      getCanonicalFileName: (filename) => filename,
      getNewLine: () => '\n',
    }),
  )
  assert.equal(program.emit().emitSkipped, false)
  const example = await import(
    pathToFileURL(path.join(temporary, 'quickstart.mjs')).href
  )
  assert.equal(typeof example.default, 'function')
  const html = renderToStaticMarkup(createElement(example.default))
  const scripts = [
    ...html.matchAll(
      /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
    ),
  ]
  assert.equal(scripts.length, 1)
  const data = JSON.parse(scripts[0][1])
  assert.equal(data['@context'], 'https://schema.org')
  assert.equal(data['@type'], 'Organization')
  assert.ok(data.name)
  assert.ok(html.includes('<h1>'))
  console.log(
    'Actual README quick start typechecked against public exports and rendered valid JSON-LD.',
  )
} finally {
  rmSync(temporary, { recursive: true, force: true })
}
