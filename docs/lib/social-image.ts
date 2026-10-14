import type { Metadata } from 'next'

import { getDocsManifest } from './docs'
import { OG_IMAGE_DEFAULTS } from './og-image'
import { createCaptureMetadata } from './site'

export const WITH_OSS_PAGE = {
  route: '/withoss',
  title: 'Made with open source',
  description:
    'The open-source projects that make react-structured.dev possible.',
}

export async function getSocialImagePages() {
  return [
    { route: '/', ...OG_IMAGE_DEFAULTS },
    WITH_OSS_PAGE,
    ...(await getDocsManifest()).pages.map((page) => ({
      route: page.route,
      title: page.title,
      description: page.description ?? OG_IMAGE_DEFAULTS.description,
    })),
  ]
}

export function captureMetadata(route: string): Metadata {
  return createCaptureMetadata(`${route === '/' ? '' : route}/social-image`)
}
