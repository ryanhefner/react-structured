import { Schema } from 'react-structured'

import { Welcome } from '@/components/docs/Welcome'
import { getDocsManifest } from '@/lib/docs'
import { pageMetadata, SITE_DESCRIPTION, SITE_URL } from '@/lib/site'

export const metadata = pageMetadata({
  route: '/',
  title: 'react-structured',
  description: SITE_DESCRIPTION,
})

export default async function Home() {
  return (
    <>
      <Schema
        id="website-jsonld"
        type="WebSite"
        data={{
          name: 'react-structured',
          url: SITE_URL,
          description: SITE_DESCRIPTION,
        }}
      />
      <Welcome nav={(await getDocsManifest()).nav} />
    </>
  )
}
