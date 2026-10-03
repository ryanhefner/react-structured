'use client'

import { CodeBlock } from '@chakra-docs/chakra'

export function Snippet({
  code,
  language = 'tsx',
}: {
  code: string
  language?: string
}) {
  return <CodeBlock code={code} language={language} />
}
