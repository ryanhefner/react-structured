'use client'

import type { ReactNode } from 'react'

import { markdownRoute, pageMarkdown } from '@/lib/page-content'
import { REPOSITORY_URL } from '@/lib/site'
import {
  DocsArticle,
  DocsBreadcrumbs,
  DocsLayout,
  DocsPageActions,
  DocsPagination,
} from '@chakra-docs/chakra'
import type { DocsNavItem, DocsPage as DocsPageModel } from '@chakra-docs/core'
import { Box, Flex } from '@chakra-ui/react'

import { DocsMobileControls } from './DocsMobileControls'

export function DocsPage({
  page,
  nav,
  children,
}: {
  page: DocsPageModel
  nav: DocsNavItem[]
  children: ReactNode
}) {
  return (
    <DocsLayout
      nav={nav}
      page={page}
      headings={page.headings}
      mobileNavigation={false}
      mobileToc={false}
      sidebarCollapsible
      sidebarDefaultExpanded="active"
      sidebarSlotProps={{ 'aria-label': 'Documentation navigation' }}
      tocSlotProps={{ 'aria-label': 'On this page' }}
    >
      <DocsMobileControls nav={nav} page={page} />
      <DocsArticle
        page={page}
        breadcrumbs={
          <Flex align="center" justify="space-between" flexWrap="wrap" gap={3}>
            <DocsBreadcrumbs
              homeHref="/"
              homeLabel="Home"
              nav={nav}
              page={page}
            />
            <Box ms="auto" flexShrink={0}>
              <DocsPageActions.Root
                page={page}
                markdown={pageMarkdown(page)}
                markdownUrl={markdownRoute(page)}
                size="sm"
                editUrl={`${REPOSITORY_URL}/edit/main/docs/content/${page.slug.length ? page.slug.join('/') : 'index'}.md`}
              />
            </Box>
          </Flex>
        }
      >
        {children}
        <DocsPagination
          nav={nav}
          page={page}
          slotProps={{ 'aria-label': 'Previous and next pages' }}
        />
      </DocsArticle>
    </DocsLayout>
  )
}
