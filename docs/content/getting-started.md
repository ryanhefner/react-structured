---
title: Getting Started
description: Install react-structured and render your first typed JSON-LD entity.
order: 1
---

Install the library with your preferred package manager. React 16.14 or newer is a peer dependency; Next.js is not required.

## Install

```sh
pnpm add react-structured
```

For npm, use `npm install react-structured`. For Yarn, use `yarn add react-structured`.

## Render an entity

```tsx
import { Schema } from 'react-structured'

export function OrganizationData() {
  return (
    <Schema
      id="organization-jsonld"
      type="Organization"
      data={{
        name: 'Example Studio',
        url: 'https://example.com',
      }}
    />
  )
}
```

The component emits a `script` with `type="application/ld+json"`, supplies the Schema.org context and selected type, and escapes script content.

## Check the output

Inspect the rendered HTML, not just the visible page. JSON-LD does not display a UI. Keep structured data consistent with the page's visible content and use absolute URLs for entity identifiers and media.

> TypeScript checks Schema.org data shapes. It does not verify factual accuracy, rich-result eligibility, or whether a search engine will display a rich result.

Continue with [Schema](/docs/schema), or use [Graph](/docs/graph) when multiple entities refer to one another.
