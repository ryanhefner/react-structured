'use client'

import { useRouter } from 'next/navigation'
import { SiGithub } from 'react-icons/si'

import { DocsSearch } from '@chakra-docs/chakra'
import type { DocsSearchRecord } from '@chakra-docs/core'
import {
  Box,
  Container,
  Flex,
  IconButton,
  Portal,
  Tooltip,
  useSlotRecipe,
} from '@chakra-ui/react'

import { SiteLink } from './SiteLink'

export function Navbar({ records }: { records: readonly DocsSearchRecord[] }) {
  const router = useRouter()
  const styles = useSlotRecipe({ key: 'siteNavbar' })()
  return (
    <Box as="header" css={styles.root}>
      <Container css={styles.container}>
        <Flex h="full" align="center" justify="space-between" gap={4}>
          <SiteLink href="/" css={styles.brand}>
            react-structured
          </SiteLink>
          <Flex align="center" gap={2} minW={0}>
            <DocsSearch
              records={records}
              onNavigate={(href) => router.push(href)}
              prefetch="intent"
            />
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <IconButton
                  asChild
                  aria-label="View react-structured on GitHub"
                  variant="ghost"
                  css={styles.githubTrigger}
                >
                  <SiteLink href="https://github.com/ryanhefner/react-structured">
                    <SiGithub />
                  </SiteLink>
                </IconButton>
              </Tooltip.Trigger>
              <Portal>
                <Tooltip.Positioner>
                  <Tooltip.Content>GitHub</Tooltip.Content>
                </Tooltip.Positioner>
              </Portal>
            </Tooltip.Root>
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}
