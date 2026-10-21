import {
  createDocsLlmsFullText,
  createDocsLlmsText,
  createDocsMarkdown,
  type DocsManifest,
  type DocsPage,
} from '@chakra-docs/core'

export function createLlmsText(
  manifest: DocsManifest,
  options: { title: string; description: string; siteUrl: string },
  full = false,
) {
  const llmsOptions = {
    ...options,
    markdownUrl: markdownRoute,
    details: `Full documentation: [llms-full.txt](${options.siteUrl}/llms-full.txt).`,
  }
  return full
    ? createDocsLlmsFullText(manifest, llmsOptions)
    : createDocsLlmsText(manifest, llmsOptions)
}

export function markdownRoute(page: Pick<DocsPage, 'slug'>) {
  return `/markdown/${page.slug.length ? page.slug.join('/') : 'index'}.md`
}

export function pageMarkdown(page: DocsPage) {
  return createDocsMarkdown(page)
}
