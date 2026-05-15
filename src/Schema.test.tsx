import type { ReactNode } from 'react'

import { afterEach, describe, expect, test } from 'vitest'

import { cleanup, render } from '@testing-library/react'

import { Schema } from './Schema'
import type { SchemaData } from './types'

const renderOptions = {
  baseElement: document.documentElement,
  container: document.head,
  wrapper: ({ children }: { children: ReactNode }) => <>{children}</>,
}

describe('Schema', () => {
  afterEach(() => {
    cleanup()
    document.head.innerHTML = ''
  })

  test('renders Article schema', () => {
    render(
      <Schema
        id="article-jsonld"
        nonce="nonce-value"
        type="Article"
        data={{
          headline: 'Test Article',
          datePublished: '2024-01-01',
        }}
      />,
      renderOptions,
    )

    const script = document.head.querySelector(
      'script[type="application/ld+json"]',
    )
    expect(script).toBeTruthy()
    expect(script?.id).toBe('article-jsonld')
    expect((script as HTMLScriptElement | null)?.nonce).toBe('nonce-value')
    const content = JSON.parse(script?.textContent || '{}')
    expect(content['@context']).toBe('https://schema.org')
    expect(content['@type']).toBe('Article')
    expect(content.headline).toBe('Test Article')
  })

  test('renders Organization schema', () => {
    render(
      <Schema
        type="Organization"
        data={{
          name: 'Test Company',
          url: 'https://example.com',
        }}
      />,
      renderOptions,
    )

    const script = document.head.querySelector(
      'script[type="application/ld+json"]',
    )
    expect(script).toBeTruthy()
    const content = JSON.parse(script?.textContent || '{}')
    expect(content['@type']).toBe('Organization')
    expect(content.name).toBe('Test Company')
  })

  test('renders Product schema', () => {
    render(
      <Schema
        type="Product"
        data={{
          name: 'Test Product',
          description: 'A test product',
          offers: {
            '@type': 'Offer',
            price: '29.99',
            priceCurrency: 'USD',
          },
        }}
      />,
      renderOptions,
    )

    const script = document.head.querySelector(
      'script[type="application/ld+json"]',
    )
    expect(script).toBeTruthy()
    const content = JSON.parse(script?.textContent || '{}')
    expect(content['@type']).toBe('Product')
    expect(content.name).toBe('Test Product')
    expect(content.offers['@type']).toBe('Offer')
  })

  test('renders BreadcrumbList schema', () => {
    render(
      <Schema
        type="BreadcrumbList"
        data={{
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://example.com',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'About',
              item: 'https://example.com/about',
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
    const content = JSON.parse(script?.textContent || '{}')
    expect(content['@type']).toBe('BreadcrumbList')
    expect(content.itemListElement).toHaveLength(2)
    expect(content.itemListElement[0].name).toBe('Home')
  })

  test('automatically sets @context', () => {
    render(
      <Schema
        type="Person"
        data={{
          name: 'John Doe',
        }}
      />,
      renderOptions,
    )

    const script = document.head.querySelector(
      'script[type="application/ld+json"]',
    )
    const content = JSON.parse(script?.textContent || '{}')
    expect(content['@context']).toBe('https://schema.org')
  })

  test('overrides @type from data with type prop', () => {
    const mismatchedData = {
      '@type': 'BlogPosting',
      headline: 'Test',
    } as unknown as SchemaData<'Article'>

    render(<Schema type="Article" data={mismatchedData} />, renderOptions)

    const script = document.head.querySelector(
      'script[type="application/ld+json"]',
    )
    const content = JSON.parse(script?.textContent || '{}')
    expect(content['@type']).toBe('Article')
  })

  test('accepts other Schema.org types from schema-dts', () => {
    render(
      <Schema
        type="Movie"
        data={{
          name: 'Test Movie',
          director: {
            '@type': 'Person',
            name: 'Director Name',
          },
        }}
      />,
      renderOptions,
    )

    const script = document.head.querySelector(
      'script[type="application/ld+json"]',
    )
    const content = JSON.parse(script?.textContent || '{}')
    expect(content['@type']).toBe('Movie')
    expect(content.name).toBe('Test Movie')
  })

  test('escapes JSON-LD script content', () => {
    const description =
      '</script><script>window.__schemaInjected = true</script>'

    render(
      <Schema
        type="Article"
        data={{
          headline: 'Escaped Article',
          description,
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
    expect(content.description).toBe(description)
  })
})
