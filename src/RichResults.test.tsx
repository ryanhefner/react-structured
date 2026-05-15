import type { ReactNode } from 'react'

import { afterEach, describe, expect, test } from 'vitest'

import { cleanup, render } from '@testing-library/react'

import {
  ArticleJsonLd,
  BreadcrumbJsonLd,
  FAQJsonLd,
  OrganizationJsonLd,
  ProductJsonLd,
} from './RichResults'

const renderOptions = {
  baseElement: document.documentElement,
  container: document.head,
  wrapper: ({ children }: { children: ReactNode }) => <>{children}</>,
}

const getJsonLd = () => {
  const script = document.head.querySelector(
    'script[type="application/ld+json"]',
  )

  return JSON.parse(script?.textContent || '{}')
}

describe('rich result helpers', () => {
  afterEach(() => {
    cleanup()
    document.head.innerHTML = ''
  })

  test('renders Article JSON-LD', () => {
    render(
      <ArticleJsonLd
        data={{
          headline: 'Article Title',
          datePublished: '2024-01-01',
          author: { '@type': 'Person', name: 'Jane Doe' },
        }}
      />,
      renderOptions,
    )

    const content = getJsonLd()
    expect(content['@type']).toBe('Article')
    expect(content.headline).toBe('Article Title')
  })

  test('renders Breadcrumb JSON-LD', () => {
    render(
      <BreadcrumbJsonLd
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
              name: 'Blog',
              item: 'https://example.com/blog',
            },
          ],
        }}
      />,
      renderOptions,
    )

    const content = getJsonLd()
    expect(content['@type']).toBe('BreadcrumbList')
    expect(content.itemListElement).toHaveLength(2)
  })

  test('renders FAQ JSON-LD', () => {
    render(
      <FAQJsonLd
        data={{
          mainEntity: [
            {
              '@type': 'Question',
              name: 'What is react-structured?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'A JSON-LD renderer for React.',
              },
            },
          ],
        }}
      />,
      renderOptions,
    )

    const content = getJsonLd()
    expect(content['@type']).toBe('FAQPage')
    expect(content.mainEntity[0].acceptedAnswer.text).toBe(
      'A JSON-LD renderer for React.',
    )
  })

  test('renders Organization JSON-LD', () => {
    render(
      <OrganizationJsonLd
        data={{
          name: 'Example Inc.',
          url: 'https://example.com',
        }}
      />,
      renderOptions,
    )

    const content = getJsonLd()
    expect(content['@type']).toBe('Organization')
    expect(content.name).toBe('Example Inc.')
  })

  test('renders Product JSON-LD', () => {
    render(
      <ProductJsonLd
        id="product-jsonld"
        data={{
          name: 'Example Product',
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
    const content = getJsonLd()

    expect(script?.id).toBe('product-jsonld')
    expect(content['@type']).toBe('Product')
    expect(content.offers['@type']).toBe('Offer')
  })
})
