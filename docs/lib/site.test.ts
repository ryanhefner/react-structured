import { afterEach, describe, expect, test, vi } from 'vitest'

import {
  createCaptureMetadata,
  pageMetadata,
  SITE_DESCRIPTION,
  SITE_URL,
} from './site'

afterEach(() => vi.unstubAllEnvs())

describe('next-meta site integration', () => {
  test('resolves canonical and social URLs and uses the site description fallback', () => {
    vi.stubEnv('NEXT_PUBLIC_OG_IMAGE_BASE_URL', '')
    const metadata = pageMetadata({ route: '/docs/schema', title: 'Schema' })
    expect(metadata.title).toBe('Schema')
    expect(metadata.description).toBe(SITE_DESCRIPTION)
    expect(metadata.alternates?.canonical).toBe(`${SITE_URL}/docs/schema`)
    expect(metadata.openGraph).toMatchObject({
      title: 'Schema',
      description: SITE_DESCRIPTION,
      siteName: 'react-structured',
      type: 'website',
      url: `${SITE_URL}/docs/schema`,
      images: [
        { url: `${SITE_URL}/social-image.png`, width: 1200, height: 630 },
      ],
    })
    expect(metadata.twitter).toMatchObject({
      card: 'summary_large_image',
      creator: '@ryanhefner',
      images: [{ url: `${SITE_URL}/social-image.png` }],
    })
  })

  test.each([
    'https://renderer.example.com/site',
    'https://renderer.example.com/site/',
  ])('preserves root and nested image renderer paths for %s', (renderer) => {
    vi.stubEnv('NEXT_PUBLIC_OG_IMAGE_BASE_URL', renderer)
    expect(
      pageMetadata({ route: '/', title: 'Home' }).openGraph?.images,
    ).toMatchObject([
      { url: 'https://renderer.example.com/site/social-image.png' },
    ])
    expect(
      pageMetadata({
        route: '/docs/schema',
        title: 'Schema',
        description: 'Guide',
      }).openGraph?.images,
    ).toMatchObject([
      { url: 'https://renderer.example.com/site/docs/schema/social-image.png' },
    ])
  })

  test('preserves native root title templates without changing social titles', () => {
    const title = {
      default: 'react-structured',
      template: '%s – react-structured',
    }
    const metadata = pageMetadata(
      { route: '/', title: 'react-structured' },
      { title },
    )
    expect(metadata.title).toEqual(title)
    expect(metadata.metadataBase?.toString()).toBe(`${SITE_URL}/`)
    expect(metadata.openGraph?.title).toBe('react-structured')
  })

  test.each([
    '/og-image',
    '/og-image/docs/schema',
    '/docs/schema/social-image',
  ])(
    'keeps capture route %s canonical, noindex, and free of inherited cards',
    (route) => {
      const metadata = createCaptureMetadata(route)
      expect(metadata.alternates?.canonical).toBe(`${SITE_URL}${route}`)
      expect(metadata.robots).toEqual({ index: false, follow: false })
      expect(metadata.openGraph).toBeNull()
      expect(metadata.twitter).toBeNull()
    },
  )
})
