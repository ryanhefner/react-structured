# react-structured

[![npm version](https://img.shields.io/npm/v/react-structured.svg)](https://www.npmjs.com/package/react-structured)
[![npm types](https://img.shields.io/npm/types/react-structured.svg)](https://www.npmjs.com/package/react-structured)
[![codecov](https://codecov.io/gh/ryanhefner/react-structured/branch/main/graph/badge.svg)](https://codecov.io/gh/ryanhefner/react-structured)
[![license](https://img.shields.io/npm/l/react-structured.svg)](LICENSE)

Type-safe React components for Schema.org JSON-LD structured data, Google rich results, and linked `@graph` documents.

`react-structured` is a small React JSON-LD library powered by [`schema-dts`](https://github.com/google/schema-dts). It gives you typed Schema.org data for SEO, structured data, rich results, and Next.js apps without requiring Next.js.

## Why react-structured?

- Full `schema-dts` coverage for Schema.org `Thing` types and JSON-LD `@graph` documents
- Framework-agnostic React components that also work in Next.js App Router and Pages Router
- Type-safe `SchemaData<'Product'>`, `SchemaData<'Movie'>`, `GraphData`, and `JsonLdData`
- Small JSON-LD focused API: `Schema`, `Graph`, `JsonLd`, and common rich-result helpers
- Safe script serialization with `</script>` escaping and CSP `nonce` support
- Development-time warnings for common Google rich-result required fields

## Installation

```sh
npm install react-structured
```

## Usage

`Schema` renders a single Schema.org node as a JSON-LD script tag.

```tsx
import { Schema, type SchemaData } from 'react-structured'

// Article schema
<Schema
  type="Article"
  data={{
    headline: 'Article Title',
    datePublished: '2024-01-01',
    author: {
      '@type': 'Person',
      name: 'John Doe'
    }
  }}
/>

// Product schema
<Schema
  type="Product"
  data={{
    name: 'Product Name',
    description: 'Product description',
    offers: {
      '@type': 'Offer',
      price: '29.99',
      priceCurrency: 'USD'
    }
  }}
/>

// Other Schema.org types are typed too
<Schema
  type="Movie"
  data={{
    name: 'The Matrix',
    director: {
      '@type': 'Person',
      name: 'The Wachowskis'
    }
  }}
/>

// Use SchemaData when defining data separately
const courseData = {
  name: 'Introduction to TypeScript',
  provider: { '@type': 'Organization', name: 'Example University' }
} satisfies SchemaData<'Course'>

<Schema type="Course" data={courseData} />
```

`Graph` renders a JSON-LD `@graph` document.

```tsx
import { Graph, type GraphData } from 'react-structured'

const graphData = {
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://example.com/#person',
      name: 'Jane Doe'
    },
    {
      '@type': 'WebSite',
      '@id': 'https://example.com/#website',
      name: 'Example',
      publisher: { '@id': 'https://example.com/#person' }
    }
  ]
} satisfies GraphData

<Graph data={graphData} />
```

`JsonLd` renders a complete JSON-LD document when you want to provide `@context` yourself.

```tsx
import { JsonLd, type JsonLdData } from 'react-structured'

const personData = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Jane Doe'
} satisfies JsonLdData

<JsonLd id="person-jsonld" nonce={nonce} data={personData} />
```

Rich-result helpers are available for common Google Search targets. They use the same `schema-dts` data model and add development-time warnings for Google-required fields where Google defines them.

```tsx
import { BreadcrumbJsonLd, ProductJsonLd } from 'react-structured'

<ProductJsonLd
  data={{
    name: 'Product Name',
    offers: {
      '@type': 'Offer',
      price: '29.99',
      priceCurrency: 'USD'
    }
  }}
/>

<BreadcrumbJsonLd
  data={{
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://example.com'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Products',
        item: 'https://example.com/products'
      }
    ]
  }}
/>
```

## Supported Schema Types

### Full schema-dts Support

This package uses [`schema-dts`](https://github.com/google/schema-dts) to derive TypeScript definitions for Schema.org types and JSON-LD graph documents.

- `Schema` supports every Schema.org `Thing` type represented by `schema-dts`.
- `Graph` supports `schema-dts` JSON-LD `Graph` documents.
- `JsonLd` supports complete `WithContext<Thing>` and `Graph` JSON-LD documents.
- The generated JSON-LD always includes `@context: "https://schema.org"`.

That means TypeScript will:

- Autocomplete Schema.org type names such as `Article`, `Product`, `Movie`, and `Course`
- Check that `data` is valid for the provided `type`
- Allow top-level `@type` to be omitted because the component sets it
- Require top-level `@type` to match the `type` prop if you include it
- Check that graph nodes are valid Schema.org `Thing` objects

Common structured data types include:

- `Article`
- `BlogPosting`
- `BreadcrumbList`
- `Event`
- `FAQPage`
- `LocalBusiness`
- `Organization`
- `Person`
- `Product`
- `Recipe`
- `Review`
- `VideoObject`
- `WebPage`
- `WebSite`

The same typing works for other Schema.org types:

```tsx
import { Schema, type SchemaData } from 'react-structured'

<Schema
  type="SoftwareApplication"
  data={{
    name: 'Example App',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web'
  }}
/>

const bookData = {
  name: 'Example Book',
  author: { '@type': 'Person', name: 'Jane Doe' }
} satisfies SchemaData<'Book'>

<Schema type="Book" data={bookData} />
```

This keeps the components flexible while preserving type safety for Schema.org types represented by `schema-dts`.

## react-structured vs next-seo

`react-structured` is not a full SEO/meta-tag framework. It focuses on type-safe JSON-LD structured data.

Use `react-structured` when you want:

- React JSON-LD components without a Next.js peer dependency
- Broad Schema.org coverage through `schema-dts`
- Direct control over JSON-LD data and `@graph` relationships
- Structured data in React, Vite, Remix, Astro islands, Next.js, or another React environment

Use `next-seo` when you want a broader Next.js SEO toolkit for title tags, canonical URLs, robots tags, Open Graph, Twitter cards, and curated JSON-LD helpers in one package.

## Component API

All rendering components accept these script options:

- `id`: `id` attribute for the rendered script tag
- `nonce`: CSP nonce attribute
- `scriptKey`: React key applied to the rendered script tag
- `validate`: Enables development-time Google rich-result warnings. Defaults to `true`.

React reserves the `key` prop for the component instance. Use React's `key` normally when rendering lists of components, and use `scriptKey` only when the underlying `<script>` element needs its own key.

### Schema

Renders Schema.org structured data as JSON-LD with exhaustive type safety.

**Props:**

- `type` (required): The Schema.org type (e.g., `Article`, `Product`, `Movie`)
- `data` (required): The schema data object conforming to the specified type

The component automatically:

- Sets `@context` to `https://schema.org`
- Sets `@type` to the value of the `type` prop
- Escapes JSON-LD script content before rendering
- Renders the data as a JSON-LD script tag

### Graph

Renders a Schema.org JSON-LD `@graph` document.

**Props:**

- `data` (required): A `GraphData` object with an `@graph` array of Schema.org `Thing` nodes

The component automatically:

- Sets `@context` to `https://schema.org`
- Renders `@graph` using the nodes provided in `data`
- Escapes JSON-LD script content before rendering
- Renders the graph as a JSON-LD script tag

### JsonLd

Renders a complete JSON-LD document.

**Props:**

- `data` (required): A `JsonLdData` document, either `WithContext<Thing>` or `SchemaGraph`

Use this when you already have a complete JSON-LD object and do not want `Schema` or `Graph` to manage `@context`.

### Rich-result helpers

These helpers wrap `Schema` for common Google Search structured data targets:

- `ArticleJsonLd`
- `BreadcrumbJsonLd`
- `FAQJsonLd`
- `OrganizationJsonLd`
- `ProductJsonLd`

They preserve the same `schema-dts` data shape while making intent clearer. In development, `ProductJsonLd`, `BreadcrumbJsonLd`, and `FAQJsonLd` warn when Google-required rich-result fields are missing. `ArticleJsonLd` and `OrganizationJsonLd` do not warn for required fields because Google's current documentation lists no required properties for those features.

## Next.js

`react-structured` does not depend on Next.js, but it works in both App Router and Pages Router.

### App Router

```tsx
// app/products/[slug]/page.tsx
import { ProductJsonLd } from 'react-structured'

export default function ProductPage() {
  return (
    <>
      <ProductJsonLd
        data={{
          name: 'Product Name',
          offers: {
            '@type': 'Offer',
            price: '29.99',
            priceCurrency: 'USD',
          },
        }}
      />
      <main>{/* page content */}</main>
    </>
  )
}
```

### Pages Router

```tsx
// pages/products/[slug].tsx
import Head from 'next/head'
import { ProductJsonLd } from 'react-structured'

export default function ProductPage() {
  return (
    <>
      <Head>
        <ProductJsonLd
          data={{
            name: 'Product Name',
            offers: {
              '@type': 'Offer',
              price: '29.99',
              priceCurrency: 'USD',
            },
          }}
        />
      </Head>
      <main>{/* page content */}</main>
    </>
  )
}
```

## Type Safety

All schema types are fully typed with TypeScript:

- `type` is limited to Schema.org type names from `schema-dts`
- `data` is inferred from the selected `type`
- Top-level `@type` is optional, but must match when present
- `GraphData` is typed from `schema-dts` and requires graph nodes to be Schema.org `Thing` objects
- rich-result helpers add development warnings for Google-required fields

The components enforce type safety, so invalid schema data is caught during development. This helps keep structured data aligned to Schema.org specifications.

## Coverage

Coverage is generated with Vitest and uploaded to Codecov from GitHub Actions.

```sh
npm run test:ci
```

## Examples

See the test files for more examples of how to use each schema type and helper component.
