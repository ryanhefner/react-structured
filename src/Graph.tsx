import React from 'react'

import type { Graph as SchemaDtsGraph } from 'schema-dts'

import { JsonLd, type JsonLdScriptProps } from './JsonLdScript'
import type { GraphData } from './types'

/**
 * Type-safe Graph component props.
 *
 * Graph data is typed from schema-dts and rendered as a JSON-LD @graph
 * document. The component owns @context.
 */
export interface GraphProps extends JsonLdScriptProps {
  /**
   * The graph data object. Each @graph item must be a Schema.org Thing from
   * schema-dts.
   */
  data: GraphData
  /**
   * Enable development-time warnings for Google rich result requirements.
   */
  validate?: boolean
}

/**
 * Graph component for rendering Schema.org JSON-LD @graph documents.
 *
 * @example
 * ```tsx
 * <Graph
 *   data={{
 *     '@graph': [
 *       {
 *         '@type': 'Person',
 *         '@id': 'https://example.com/#person',
 *         name: 'Jane Doe'
 *       },
 *       {
 *         '@type': 'WebSite',
 *         '@id': 'https://example.com/#website',
 *         name: 'Example'
 *       }
 *     ]
 *   }}
 * />
 * ```
 */
export const Graph = ({
  data,
  id,
  nonce,
  scriptKey,
  validate = true,
}: GraphProps): React.ReactElement => {
  const graphData: SchemaDtsGraph = {
    '@context': 'https://schema.org',
    '@graph': data['@graph'],
  }

  return (
    <JsonLd
      data={graphData}
      id={id}
      nonce={nonce}
      scriptKey={scriptKey}
      validate={validate}
    />
  )
}

export default Graph
