import { OgImagePage } from '@/components/docs/OgImagePage'
import { createCaptureMetadata } from '@/lib/site'

export const metadata = createCaptureMetadata('/og-image')

export default function ImageTemplate() {
  return <OgImagePage />
}
