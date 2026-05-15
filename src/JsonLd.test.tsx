import type { ReactNode } from 'react'

import { afterEach, describe, expect, test, vi } from 'vitest'

import { cleanup, render } from '@testing-library/react'

import { JsonLd } from './JsonLdScript'

const renderOptions = {
  baseElement: document.documentElement,
  container: document.head,
  wrapper: ({ children }: { children: ReactNode }) => <>{children}</>,
}

describe('JsonLd', () => {
  afterEach(() => {
    cleanup()
    document.head.innerHTML = ''
    vi.restoreAllMocks()
  })

  test('renders a complete JSON-LD document', () => {
    render(
      <JsonLd
        id="person-jsonld"
        nonce="nonce-value"
        data={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: 'Jane Doe',
        }}
      />,
      renderOptions,
    )

    const script = document.head.querySelector(
      'script[type="application/ld+json"]',
    )
    const content = JSON.parse(script?.textContent || '{}')

    expect(script?.id).toBe('person-jsonld')
    expect((script as HTMLScriptElement | null)?.nonce).toBe('nonce-value')
    expect(content['@context']).toBe('https://schema.org')
    expect(content['@type']).toBe('Person')
    expect(content.name).toBe('Jane Doe')
  })

  test('warns in development for Google rich result issues', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    render(
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'Incomplete Product',
        }}
      />,
      renderOptions,
    )

    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining(
        'Product rich results require at least one of `review`, `aggregateRating`, or `offers`.',
      ),
    )
  })

  test('can disable development warnings', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)

    render(
      <JsonLd
        validate={false}
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'Incomplete Product',
        }}
      />,
      renderOptions,
    )

    expect(warn).not.toHaveBeenCalled()
  })
})
