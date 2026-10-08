---
title: Rich-result Helpers
description: Express common article, product, breadcrumb, FAQ, and organization data.
order: 5
---

Helpers make common intent explicit while retaining the same schema-dts data shapes and script options as `Schema`.

## Available helpers

| Helper               | Schema.org type                            |
| -------------------- | ------------------------------------------ |
| `ArticleJsonLd`      | `Article`, `NewsArticle`, or `BlogPosting` |
| `BreadcrumbJsonLd`   | `BreadcrumbList`                           |
| `FAQJsonLd`          | `FAQPage`                                  |
| `OrganizationJsonLd` | `Organization`                             |
| `ProductJsonLd`      | `Product`                                  |

## Product example

```tsx
import { ProductJsonLd } from 'react-structured'

;<ProductJsonLd
  data={{
    name: 'Example Product',
    image: 'https://example.com/product.jpg',
    offers: {
      '@type': 'Offer',
      price: '29.99',
      priceCurrency: 'USD',
      url: 'https://example.com/products/example',
    },
  }}
/>
```

## Article variants

```tsx
import { ArticleJsonLd } from 'react-structured'

;<ArticleJsonLd
  type="BlogPosting"
  data={{
    headline: 'Notes from the workbench',
    datePublished: '2026-10-03',
    author: { '@type': 'Person', name: 'Jane Doe' },
  }}
/>
```

`ArticleJsonLd` defaults to `Article`; its data remains tied to the chosen article type.

## Development warnings

Warnings cover common missing fields in products, breadcrumbs, and FAQs. They are non-blocking, deduplicated, disabled in production, and can be disabled explicitly with `validate={false}`. They are not exhaustive validation.

> A helper does not guarantee search eligibility. Search-engine feature policies and required fields can change; verify your deployed page with the relevant provider's current validation tools.
