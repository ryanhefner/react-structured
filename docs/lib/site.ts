import type { Metadata } from 'next'
import { defineMeta, toMetadata } from 'next-meta/app'

export const SITE_URL = 'https://react-structured.dev'
export const REPOSITORY_URL = 'https://github.com/ryanhefner/react-structured'
export const SITE_DESCRIPTION =
  'Type-safe Schema.org JSON-LD for React. Compose structured data, rich-result helpers, and linked graph documents without a framework dependency.'

const siteDefaults = defineMeta({
  baseUrl: SITE_URL,
  siteName: 'react-structured',
  type: 'website',
  locale: 'en_US',
  twitter: { card: 'summary_large_image', creator: '@ryanhefner' },
})

export function pageMetadata(
  page: {
    route: string
    title: string
    description?: string
  },
  native: Metadata = {},
): Metadata {
  const description = page.description ?? SITE_DESCRIPTION
  // Optional renderer prefix: https://your-project.opengraphs.com/<site>/
  const renderer = process.env.NEXT_PUBLIC_OG_IMAGE_BASE_URL
  const image = renderer
    ? new URL(
        `${page.route === '/' ? '' : page.route.slice(1) + '/'}social-image.png`,
        renderer.endsWith('/') ? renderer : renderer + '/',
      ).href
    : new URL('/social-image.png', SITE_URL).href
  return toMetadata(
    {
      title: page.title,
      description,
      canonical: page.route,
      url: page.route,
      images: [{ url: image, width: 1200, height: 630, alt: page.title }],
    },
    { defaults: siteDefaults, native },
  )
}

export function createCaptureMetadata(path: string): Metadata {
  return toMetadata(
    { title: 'Open Graph image', baseUrl: SITE_URL, canonical: path },
    {
      native: {
        robots: { index: false, follow: false },
        openGraph: null,
        twitter: null,
      },
    },
  )
}
