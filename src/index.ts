export { Graph, type GraphProps } from './Graph'
export {
  JsonLd,
  default as JsonLdScript,
  type JsonLdProps,
  type JsonLdScriptProps,
} from './JsonLdScript'
export {
  ArticleJsonLd,
  BreadcrumbJsonLd,
  FAQJsonLd,
  OrganizationJsonLd,
  ProductJsonLd,
  type ArticleJsonLdProps,
  type BreadcrumbJsonLdProps,
  type FAQJsonLdProps,
  type OrganizationJsonLdProps,
  type ProductJsonLdProps,
} from './RichResults'
export { Schema, default, type SchemaProps } from './Schema'
export * from './types'

// Re-export schema-dts for users who need other Schema.org types
export type { Thing, WithContext, Graph as SchemaGraph } from 'schema-dts'
