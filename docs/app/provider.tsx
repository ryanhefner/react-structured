'use client'

import type { ReactNode } from 'react'

import { ThemeProvider } from 'next-themes'
import { LuCheck, LuChevronDown, LuChevronRight, LuCopy } from 'react-icons/lu'

import { DocsProvider } from '@chakra-docs/chakra'
import { NextLink } from '@chakra-docs/next/link'
import { createChakraDocsShikiAdapter } from '@chakra-docs/shiki'
import { ChakraProvider } from '@chakra-ui/react'
import { PostkitProvider } from '@postkit/react'

import { siteSystem } from './system'

const codeBlockAdapter = createChakraDocsShikiAdapter({
  themes: { light: 'github-dark', dark: 'github-dark' },
})

export function Provider({
  children,
  siteUrl,
}: {
  children: ReactNode
  siteUrl: string
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      enableColorScheme
      disableTransitionOnChange
      storageKey="react-structured-color-mode"
    >
      <ChakraProvider value={siteSystem}>
        <PostkitProvider
          system={siteSystem}
          codeBlockAdapter={codeBlockAdapter}
        >
          <DocsProvider
            config={{
              title: 'react-structured',
              siteUrl,
              linkComponent: NextLink,
              codeBlock: {
                adapter: codeBlockAdapter,
                copyIcon: <LuCopy aria-hidden="true" />,
                copiedIcon: <LuCheck aria-hidden="true" />,
              },
              icons: {
                sidebarIndicator: <LuChevronRight aria-hidden="true" />,
                mobileTocIndicator: <LuChevronDown aria-hidden="true" />,
              },
              pageActions: { size: 'sm' },
              layout: {
                stickyTop: siteSystem.token.var('spacing.docsStickyTop'),
                scrollMarginTop: siteSystem.token.var(
                  'spacing.docsScrollMargin',
                ),
              },
            }}
          >
            {children}
          </DocsProvider>
        </PostkitProvider>
      </ChakraProvider>
    </ThemeProvider>
  )
}
