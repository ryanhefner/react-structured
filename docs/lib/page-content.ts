import { createDocsMarkdown, type DocsPage } from '@chakra-docs/core'

export function markdownRoute(page: Pick<DocsPage, 'slug'>) {
  return `/markdown/${page.slug.length ? page.slug.join('/') : 'index'}.md`
}

export function pageMarkdown(page: DocsPage) {
  return createDocsMarkdown(page)
}
