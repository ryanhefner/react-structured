import React from 'react'

import { afterEach, describe, expect, test } from 'vitest'

import { cleanup, render } from '@testing-library/react'

import { Graph } from './Graph'
import type { GraphData } from './types'

const renderOptions = {
  baseElement: document.documentElement,
  container: document.head,
  wrapper: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}

describe('Graph', () => {
  afterEach(() => {
    cleanup()
    document.head.innerHTML = ''
  })

  test('renders a JSON-LD graph document', () => {
    render(
      <Graph
        id="graph-jsonld"
        nonce="nonce-value"
        data={{
          '@graph': [
            {
              '@type': 'Person',
              '@id': 'https://example.com/#person',
              name: 'Jane Doe',
            },
            {
              '@type': 'WebSite',
              '@id': 'https://example.com/#website',
              name: 'Example',
              publisher: { '@id': 'https://example.com/#person' },
            },
          ],
        }}
      />,
      renderOptions,
    )

    const script = document.head.querySelector(
      'script[type="application/ld+json"]',
    )

    expect(script).toBeTruthy()
    expect(script?.id).toBe('graph-jsonld')
    expect((script as HTMLScriptElement | null)?.nonce).toBe('nonce-value')

    const content = JSON.parse(script?.textContent || '{}')
    expect(content['@context']).toBe('https://schema.org')
    expect(content['@graph']).toHaveLength(2)
    expect(content['@graph'][0]['@type']).toBe('Person')
    expect(content['@graph'][1].publisher['@id']).toBe(
      'https://example.com/#person',
    )
  })

  test('sets @context from the component', () => {
    const data = {
      '@context': 'https://example.invalid',
      '@graph': [
        {
          '@type': 'Person',
          name: 'Jane Doe',
        },
      ],
    } as unknown as GraphData

    render(<Graph data={data} />, renderOptions)

    const script = document.head.querySelector(
      'script[type="application/ld+json"]',
    )
    const content = JSON.parse(script?.textContent || '{}')
    expect(content['@context']).toBe('https://schema.org')
  })

  test('escapes JSON-LD script content', () => {
    const name = '</script><script>window.__graphInjected = true</script>'

    render(
      <Graph
        data={{
          '@graph': [
            {
              '@type': 'Person',
              name,
            },
          ],
        }}
      />,
      renderOptions,
    )

    const script = document.head.querySelector(
      'script[type="application/ld+json"]',
    )

    expect(script?.textContent).toContain('\\u003c/script')
    expect(script?.textContent).not.toContain('</script><script>')

    const content = JSON.parse(script?.textContent || '{}')
    expect(content['@graph'][0].name).toBe(name)
  })
})
