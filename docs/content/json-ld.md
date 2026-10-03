---
title: JsonLd
description: Render a complete JSON-LD document when you own the context and type.
order: 4
---

Use `JsonLd` when your application already has a complete document. Unlike `Schema` and `Graph`, it does not supply or rewrite the context and type.

## Render a complete document

```tsx
import { JsonLd, type JsonLdData } from 'react-structured'

const person = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Jane Doe',
  url: 'https://example.com/about',
} satisfies JsonLdData

<JsonLd id="person-jsonld" data={person} />
```

## Supported document shapes

`JsonLdData` accepts a schema-dts `WithContext<Thing>` or complete `SchemaGraph`. It is not a general-purpose validator for arbitrary JSON-LD vocabularies.

`JsonLdScript` is also exported as an alias for the same renderer. Prefer `JsonLd` in new code to express the document-level API.

## Serialization

The renderer uses the same script-safe serialization and development warnings as the higher-level components. Cyclic objects and unsupported JSON values remain application errors; build valid JSON-serializable data before rendering.
