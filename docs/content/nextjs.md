---
title: Next.js
description: Use JSON-LD alongside native metadata or next-meta in either router.
order: 6
---

react-structured has no Next.js peer dependency. Its components emit JSON-LD scripts and work in both App Router and Pages Router pages.

## App Router

```tsx
import type { Metadata } from 'next'
import { ProductJsonLd } from 'react-structured'

const productUrl = 'https://example.com/products/example'

export const metadata: Metadata = {
  title: 'Example Product',
  alternates: { canonical: productUrl },
}

export default function ProductPage() {
  return (
    <>
      <ProductJsonLd
        data={{
          name: 'Example Product',
          url: productUrl,
          offers: { '@type': 'Offer', price: '29.99', priceCurrency: 'USD' },
        }}
      />
      <main>Example Product</main>
    </>
  )
}
```

JSON-LD is separate from Next.js's `Metadata` object. Reuse canonical and media URLs so the two outputs agree.

## Pages Router

Render `PageMeta` from next-meta and the structured-data component as siblings.

```tsx
import { PageMeta } from 'next-meta'
import { Schema } from 'react-structured'

export default function AboutPage() {
  return (
    <>
      <PageMeta title="About Example" canonical="https://example.com/about" />
      <Schema type="Organization" data={{ name: 'Example Studio' }} />
      <main>About Example Studio</main>
    </>
  )
}
```

> Do not nest these components inside `next/head` or `PageMeta`. JSON-LD can live in the document body, and indirect children of `Head` are not the appropriate composition here.

## Server rendering

Prefer rendering page data on the server so the initial HTML includes it. Browser-only data and late client navigation updates need their own integration checks. The package does not manage router events or deduplicate scripts across layouts.
