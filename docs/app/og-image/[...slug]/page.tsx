import { notFound } from 'next/navigation'

import { OgImagePage } from '@/components/docs/OgImagePage'
import { createCaptureMetadata } from '@/lib/site'
import { getSocialImagePages } from '@/lib/social-image'

export const dynamicParams = false
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  return createCaptureMetadata(`/og-image/${slug.join('/')}`)
}

export async function generateStaticParams() {
  return (await getSocialImagePages())
    .filter((page) => page.route !== '/')
    .map((page) => ({ slug: page.route.split('/').filter(Boolean) }))
}

export default async function ImageTemplate({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const page = (await getSocialImagePages()).find(
    (page) => page.route === `/${slug.join('/')}`,
  )
  if (!page) notFound()
  return <OgImagePage defaults={page} />
}
