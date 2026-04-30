import React from 'react'

import type { JsonLdScriptProps } from './JsonLdScript'
import { Schema } from './Schema'
import type { NoInferSchemaType, SchemaData, SchemaType } from './types'

type ArticleJsonLdType = Extract<
  SchemaType,
  'Article' | 'NewsArticle' | 'BlogPosting'
>

type RichResultProps<T extends SchemaType> = JsonLdScriptProps & {
  data: SchemaData<NoInferSchemaType<T>>
  validate?: boolean
}

export type ArticleJsonLdProps<T extends ArticleJsonLdType = 'Article'> =
  JsonLdScriptProps & {
    type?: T
    data: SchemaData<NoInferSchemaType<T>>
    validate?: boolean
  }

export type BreadcrumbJsonLdProps = RichResultProps<'BreadcrumbList'>

export type FAQJsonLdProps = RichResultProps<'FAQPage'>

export type OrganizationJsonLdProps = RichResultProps<'Organization'>

export type ProductJsonLdProps = RichResultProps<'Product'>

export const ArticleJsonLd = <T extends ArticleJsonLdType = 'Article'>({
  type,
  data,
  ...scriptProps
}: ArticleJsonLdProps<T>): React.ReactElement => (
  <Schema type={(type ?? 'Article') as T} data={data} {...scriptProps} />
)

export const BreadcrumbJsonLd = ({
  data,
  ...scriptProps
}: BreadcrumbJsonLdProps): React.ReactElement => (
  <Schema type="BreadcrumbList" data={data} {...scriptProps} />
)

export const FAQJsonLd = ({
  data,
  ...scriptProps
}: FAQJsonLdProps): React.ReactElement => (
  <Schema type="FAQPage" data={data} {...scriptProps} />
)

export const OrganizationJsonLd = ({
  data,
  ...scriptProps
}: OrganizationJsonLdProps): React.ReactElement => (
  <Schema type="Organization" data={data} {...scriptProps} />
)

export const ProductJsonLd = ({
  data,
  ...scriptProps
}: ProductJsonLdProps): React.ReactElement => (
  <Schema type="Product" data={data} {...scriptProps} />
)
