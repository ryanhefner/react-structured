---
title: Graph
description: Connect multiple Schema.org entities in one JSON-LD graph.
order: 3
---

Use a graph when a page describes connected entities. Give each entity a stable, absolute `@id`, and reference that identifier rather than duplicating the same entity.

## Connect a publisher and website

```tsx
import { Graph, type GraphData } from 'react-structured'

const data = {
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://example.com/#organization',
      name: 'Example Studio',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://example.com/#website',
      url: 'https://example.com',
      name: 'Example',
      publisher: { '@id': 'https://example.com/#organization' },
    },
  ],
} satisfies GraphData

<Graph id="site-graph" data={data} />
```

## Context and typing

`Graph` supplies `@context: "https://schema.org"`. Every node in `@graph` is typed as a schema-dts `Thing`; each node owns its `@type`.

The component accepts the same `id`, `nonce`, `scriptKey`, and `validate` options as `Schema`. Development warnings inspect graph nodes as well as single entities.

## Identity is application-owned

The package does not deduplicate entities, fetch linked data, or resolve graph references. Keep IDs stable and render each graph once in the document. A script's `id` is DOM identity, not automatic deduplication.
