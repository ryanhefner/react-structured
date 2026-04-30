/**
 * Schema.org type definitions using schema-dts
 * Provides exhaustive TypeScript definitions for all Schema.org types
 *
 * Based on https://schema.org/ and https://github.com/google/schema-dts
 */

import type {
  Thing,
  WithContext,
  Graph as SchemaDtsGraph,
  Answer,
  Article,
  BlogPosting,
  BreadcrumbList,
  Event,
  FAQPage,
  ListItem,
  LocalBusiness,
  Organization,
  Person,
  Product,
  Question,
  Recipe,
  Review,
  VideoObject,
  WebPage,
  WebSite,
} from 'schema-dts'

// Re-export commonly used types from schema-dts
export type {
  Thing,
  WithContext,
  SchemaDtsGraph as SchemaGraph,
  Answer,
  Article,
  BlogPosting,
  BreadcrumbList,
  Event,
  FAQPage,
  ListItem,
  LocalBusiness,
  Organization,
  Person,
  Product,
  Question,
  Recipe,
  Review,
  VideoObject,
  WebPage,
  WebSite,
}

/**
 * Extracts the Schema.org @type value from a schema-dts type.
 */
export type ExtractSchemaType<T> = T extends { '@type': infer U } ? U : never

/**
 * Union of every Schema.org @type value represented by schema-dts.
 */
export type SchemaType = ExtractSchemaType<Thing>

/**
 * The schema-dts object type that matches a Schema.org @type value.
 */
export type SchemaThing<T extends SchemaType> = Extract<Thing, { '@type': T }>

export type NoInferSchemaType<T> = [T][T extends unknown ? 0 : never]

type WithOptionalTopLevelType<T> = T extends { '@type': infer U }
  ? Omit<T, '@type'> & { '@type'?: U }
  : T

/**
 * Type-safe top-level schema data for the provided Schema.org @type value.
 *
 * The Schema component owns the final top-level @type value, so @type is
 * optional in data. If provided, TypeScript requires it to match the type prop.
 */
export type SchemaData<T extends SchemaType> = WithOptionalTopLevelType<
  SchemaThing<T>
>

/**
 * A typed Schema.org node that can be used inside a JSON-LD @graph document.
 */
export type GraphNode = Thing

/**
 * Type-safe data for a JSON-LD @graph document.
 *
 * The Graph component owns @context, so it is optional in data. If provided,
 * TypeScript requires the schema.org context value used by schema-dts.
 */
export type GraphData = Omit<SchemaDtsGraph, '@context'> & {
  '@context'?: SchemaDtsGraph['@context']
}

/**
 * Low-level JSON-LD document shapes supported by react-structured.
 */
export type JsonLdData = WithContext<Thing> | SchemaDtsGraph

/**
 * Union type of common Schema.org types. Schema itself supports every
 * Schema.org type represented by schema-dts.
 */
export type PredefinedSchemaType =
  | 'Article'
  | 'BlogPosting'
  | 'BreadcrumbList'
  | 'Event'
  | 'FAQPage'
  | 'LocalBusiness'
  | 'Organization'
  | 'Person'
  | 'Product'
  | 'Recipe'
  | 'Review'
  | 'VideoObject'
  | 'WebPage'
  | 'WebSite'

/**
 * Type mapping for common schemas.
 */
export type PredefinedSchemaData = SchemaData<PredefinedSchemaType>

/**
 * Type-safe schema data that matches the provided type
 */
export type TypedSchemaData<T extends SchemaType> = SchemaData<T>
