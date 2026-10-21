'use client'

import { DocsArticle, DocsLayout } from '@chakra-docs/chakra'
import type { DocsNavItem } from '@chakra-docs/core'
import { Heading, Stack, Text } from '@chakra-ui/react'

import { DocsMobileControls } from './DocsMobileControls'
import { SiteLink } from './SiteLink'
import { Snippet } from './Snippet'

const example = `import { Schema, type SchemaData } from 'react-structured'

const article = {
  headline: 'Hello, open web.',
  author: { '@type': 'Person', name: 'Jane Doe' },
  datePublished: '2026-10-03',
} satisfies SchemaData<'Article'>

export default function ArticlePage() {
  return <Schema type="Article" data={article} />
}`

export function Welcome({ nav }: { nav: DocsNavItem[] }) {
  return (
    <DocsLayout
      nav={nav}
      sidebarCollapsible
      sidebarDefaultExpanded="active"
      mobileNavigation={false}
      mobileToc={false}
      sidebarSlotProps={{ 'aria-label': 'Documentation navigation' }}
    >
      <DocsMobileControls nav={nav} />
      <DocsArticle>
        <Stack gap={6}>
          <Heading as="h1" size="4xl">
            Structured data, composed.
          </Heading>
          <Text fontSize="xl" color="fg.muted">
            Type-safe Schema.org JSON-LD for React. Single entities, connected
            graphs, and rich-result helpers. No framework dependency.
          </Text>
          <Snippet code={example} />
          <Text>
            Describe what your pages contain with typed data, then render it as
            safely serialized JSON-LD.
          </Text>
          <Stack direction={{ base: 'column', sm: 'row' }} gap={6}>
            <SiteLink href="/docs/getting-started" color="site.link">
              Get started →
            </SiteLink>
            <SiteLink href="/docs/schema" color="site.link">
              Schema
            </SiteLink>
            <SiteLink href="/docs/graph" color="site.link">
              Graph
            </SiteLink>
          </Stack>
        </Stack>
      </DocsArticle>
    </DocsLayout>
  )
}
