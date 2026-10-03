import type { Metadata } from 'next'

export const SITE_URL = 'https://react-structured.dev'
export const REPOSITORY_URL = 'https://github.com/ryanhefner/react-structured'
export const SITE_DESCRIPTION =
  'Type-safe Schema.org JSON-LD for React. Compose structured data, rich-result helpers, and linked graph documents without a framework dependency.'

export function pageMetadata(page: {
  route: string
  title: string
  description?: string
}): Metadata {
  const description = page.description ?? SITE_DESCRIPTION
  // Optional renderer prefix: https://your-project.opengraphs.com/<site>/
  const renderer = process.env.NEXT_PUBLIC_OG_IMAGE_BASE_URL
  const image = renderer
    ? new URL(
        `${page.route === '/' ? '' : page.route.slice(1) + '/'}social-image.png`,
        renderer.endsWith('/') ? renderer : renderer + '/',
      ).href
    : new URL('/social-image.png', SITE_URL).href
  return {
    title: page.title,
    description,
    alternates: { canonical: page.route },
    openGraph: {
      title: page.title,
      description,
      url: page.route,
      siteName: 'react-structured',
      type: 'website',
      locale: 'en_US',
      images: [{ url: image, width: 1200, height: 630, alt: page.title }],
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@ryanhefner',
      title: page.title,
      description,
      images: [image],
    },
  }
}
