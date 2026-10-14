import { StructuredData } from '@/components/docs/StructuredData'
import { Welcome } from '@/components/docs/Welcome'
import { getDocsManifest } from '@/lib/docs'
import { pageMetadata, SITE_DESCRIPTION } from '@/lib/site'

export const metadata = pageMetadata({
  route: '/',
  title: 'react-structured',
  description: SITE_DESCRIPTION,
})

export default async function Home() {
  return (
    <>
      <StructuredData
        page={{
          route: '/',
          title: 'react-structured',
          description: SITE_DESCRIPTION,
        }}
      />
      <Welcome nav={(await getDocsManifest()).nav} />
    </>
  )
}
