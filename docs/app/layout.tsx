import type { ReactNode } from 'react'

import type { Metadata, Viewport } from 'next'
import { toViewport } from 'next-meta/app'

import { getDocsManifest } from '@/lib/docs'
import { pageMetadata, SITE_URL, SITE_DESCRIPTION } from '@/lib/site'

import { SiteExperience } from './site-experience'

export const metadata: Metadata = pageMetadata(
  {
    route: '/',
    title: 'react-structured',
    description: SITE_DESCRIPTION,
  },
  {
    title: { default: 'react-structured', template: '%s – react-structured' },
  },
)

export const viewport: Viewport = toViewport({
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
})

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const manifest = await getDocsManifest()
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://kits.fontstack.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://kits.fontstack.com/kit/o0v0t0oi.css"
          precedence="default"
        />
      </head>
      <body>
        <SiteExperience
          records={manifest.search}
          year={new Date().getFullYear()}
          siteUrl={SITE_URL}
        >
          {children}
        </SiteExperience>
      </body>
    </html>
  )
}
