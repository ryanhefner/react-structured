'use client'

import { CodeBlock } from '@chakra-docs/chakra'

export function Snippet({
  code,
  language = 'tsx',
}: {
  code: string
  language?: string
}) {
  return (
    <CodeBlock
      code={code}
      language={language}
      // Chakra 3.36 attaches aria-expanded to a generic content div.
      // These samples are not collapsible; omit that unsupported attribute.
      contentSlotProps={{ 'aria-expanded': null }}
    />
  )
}
