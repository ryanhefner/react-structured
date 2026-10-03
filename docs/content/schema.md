---
title: Schema
description: Render a single Schema.org entity with exhaustive schema-dts typing.
order: 2
---

`Schema` derives its data type from the `type` prop. Any Schema.org `Thing` type represented by schema-dts is supported, not just the rich-result helpers.

## Inline data

```tsx
import { Schema } from 'react-structured'

;<Schema
  type="Movie"
  data={{
    name: 'The Matrix',
    director: { '@type': 'Person', name: 'The Wachowskis' },
  }}
/>
```

## Separate typed data

```tsx
import { Schema, type SchemaData } from 'react-structured'

const course = {
  name: 'Introduction to TypeScript',
  provider: { '@type': 'Organization', name: 'Example University' },
} satisfies SchemaData<'Course'>

<Schema type="Course" data={course} />
```

The top-level `@type` is optional in `data`. If supplied, it must match the selected type. Nested entities still need their own `@type`.

## Props

| Prop        | Purpose                                                   |
| ----------- | --------------------------------------------------------- |
| `type`      | Required Schema.org type name                             |
| `data`      | Required `SchemaData<T>` for that type                    |
| `id`        | Document-unique script ID                                 |
| `nonce`     | Application-provided CSP nonce                            |
| `scriptKey` | React key for the emitted script                          |
| `validate`  | Development-time rich-result warnings; defaults to `true` |

`Schema` owns the final top-level `@context` and `@type`, including for JavaScript callers. See [security](/docs/security) for script serialization and CSP details.
