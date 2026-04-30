import React from 'react'

import type { Thing, WithContext } from 'schema-dts'

import { JsonLd, type JsonLdScriptProps } from './JsonLdScript'
import type { NoInferSchemaType, SchemaData, SchemaType } from './types'

/**
 * Type-safe Schema component props
 *
 * TypeScript derives the data shape from the provided Schema.org type.
 * The top-level @type field is optional because the type prop is the
 * source of truth.
 */
export interface SchemaProps<
  T extends SchemaType = SchemaType,
> extends JsonLdScriptProps {
  /**
   * The Schema.org type (e.g., 'Article', 'Product', 'Event').
   *
   * The value is typed from schema-dts, so TypeScript provides autocomplete
   * and checks data against the selected type.
   *
   * @example
   * ```tsx
   * <Schema type="Article" data={articleData} />
   * <Schema type="Movie" data={movieData} />
   * ```
   */
  type: T
  /**
   * The schema data object. Must conform to the Schema.org specification
   * for the specified type. Top-level @type is optional; if provided,
   * TypeScript requires it to match the type prop.
   */
  data: SchemaData<NoInferSchemaType<T>>
  /**
   * Enable development-time warnings for Google rich result requirements.
   */
  validate?: boolean
}

/**
 * Schema component for rendering Schema.org structured data as JSON-LD
 *
 * Provides TypeScript support for Schema.org types via schema-dts.
 * The component enforces type safety for the selected Schema.org type.
 *
 * @example
 * ```tsx
 * <Schema
 *   type="Article"
 *   data={{
 *     headline: 'Article Title',
 *     datePublished: '2024-01-01',
 *     author: {
 *       '@type': 'Person',
 *       name: 'John Doe'
 *     }
 *   }}
 * />
 *
 * <Schema
 *   type="Movie"
 *   data={{
 *     name: 'The Matrix',
 *     director: {
 *       '@type': 'Person',
 *       name: 'The Wachowskis'
 *     }
 *   }}
 * />
 * ```
 */
export const Schema = <T extends SchemaType = SchemaType>({
  type,
  data,
  id,
  nonce,
  scriptKey,
  validate = true,
}: SchemaProps<T>): React.ReactElement => {
  // The component owns top-level JSON-LD metadata even if plain JS callers pass it.
  const dataObj = data as unknown as Record<string, unknown>
  const {
    '@context': _context,
    '@type': _type,
    ...dataWithoutJsonLdMetadata
  } = dataObj
  const schemaData: WithContext<Thing> = {
    '@context': 'https://schema.org',
    '@type': type,
    ...dataWithoutJsonLdMetadata,
  } as WithContext<Thing>

  return (
    <JsonLd
      data={schemaData}
      id={id}
      nonce={nonce}
      scriptKey={scriptKey}
      validate={validate}
    />
  )
}

export default Schema
