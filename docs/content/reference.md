---
title: API Reference
description: Components, script options, and exported Schema.org types at a glance.
order: 8
---

## Components

| Export                         | Required props       | Additional props                               |
| ------------------------------ | -------------------- | ---------------------------------------------- |
| `Schema` (also default export) | `type`, `data`       | Shared script options                          |
| `Graph`                        | `data` with `@graph` | Shared script options                          |
| `JsonLd`, `JsonLdScript`       | Complete `data`      | Shared script options                          |
| `ArticleJsonLd`                | `data`               | Optional article `type`, shared script options |
| `BreadcrumbJsonLd`             | `data`               | Shared script options                          |
| `FAQJsonLd`                    | `data`               | Shared script options                          |
| `OrganizationJsonLd`           | `data`               | Shared script options                          |
| `ProductJsonLd`                | `data`               | Shared script options                          |

## Shared script options

| Option      | Type        | Default                            |
| ----------- | ----------- | ---------------------------------- |
| `id`        | `string`    | Unset                              |
| `nonce`     | `string`    | Unset                              |
| `scriptKey` | React `Key` | Unset                              |
| `validate`  | `boolean`   | `true` (development warnings only) |

## Data types

- `SchemaType`: all supported Schema.org `@type` names.
- `SchemaThing<T>`: the schema-dts entity corresponding to a type.
- `SchemaData<T>` and `TypedSchemaData<T>`: an entity with optional top-level `@type`.
- `GraphNode`: a typed schema-dts `Thing`.
- `GraphData`: a graph with an optional Schema.org context.
- `JsonLdData`: a complete `WithContext<Thing>` or `SchemaGraph` document.
- `Thing`, `WithContext`, and `SchemaGraph`: re-exported schema-dts types.

Component prop types and commonly used schema-dts types are also exported from the package root. Use `import type` when you only need declarations.

## Compatibility

React is the only runtime peer dependency (`>=16.14`). schema-dts supplies declarations. The repository uses Node 24 and pnpm for development; these tooling pins do not add a Next.js runtime requirement to the library.
