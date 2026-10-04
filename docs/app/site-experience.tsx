'use client'

import type { ReactNode } from 'react'

import { usePathname } from 'next/navigation'

import { CommuneFooter } from '@/components/docs/CommuneFooter'
import { Navbar } from '@/components/docs/Navbar'
import { SiteFooter } from '@/components/docs/SiteFooter'
import { SiteLink } from '@/components/docs/SiteLink'
import type { DocsSearchRecord } from '@chakra-docs/core'
import { Box, useSlotRecipe } from '@chakra-ui/react'

import { Analytics } from './analytics'
import { Provider } from './provider'

function SiteChrome({
  children,
  records,
  year,
}: {
  children: ReactNode
  records: readonly DocsSearchRecord[]
  year: number
}) {
  const styles = useSlotRecipe({ key: 'siteShell' })()
  return (
    <>
      <SiteLink href="#main-content" css={styles.skipLink}>
        Skip to content
      </SiteLink>
      <Navbar records={records} />
      <Box as="main" id="main-content" tabIndex={-1} css={styles.main}>
        {children}
      </Box>
      <SiteFooter year={year} />
      <CommuneFooter />
    </>
  )
}

export function SiteExperience({
  children,
  records,
  year,
  siteUrl,
}: {
  children: ReactNode
  records: readonly DocsSearchRecord[]
  year: number
  siteUrl: string
}) {
  const pathname = usePathname()
  const route = pathname.replace(/\/+$/, '') || '/'
  const capture =
    route === '/og-image' ||
    route.startsWith('/og-image/') ||
    route.endsWith('/social-image')
  return (
    <Analytics enabled={!capture}>
      <Provider siteUrl={siteUrl}>
        {capture ? (
          children
        ) : (
          <SiteChrome records={records} year={year}>
            {children}
          </SiteChrome>
        )}
      </Provider>
    </Analytics>
  )
}
