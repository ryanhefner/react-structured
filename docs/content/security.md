---
title: Serialization and CSP
description: Understand script-safe JSON-LD serialization and application-owned security boundaries.
order: 7
---

All rendering components share a serializer that escapes script-breaking characters. You do not need to create your own `dangerouslySetInnerHTML` wrapper around them.

## Content Security Policy

Pass the nonce supplied by your application's security layer.

```tsx
import { Schema } from 'react-structured'

;<Schema
  id="organization-jsonld"
  nonce={nonce}
  type="Organization"
  data={{ name: 'Example Studio' }}
/>
```

The library does not generate nonces or configure HTTP headers. Do not hard-code a nonce; reuse the value associated with the current response's CSP.

## Application-owned validation

Script-safe serialization is not a complete content policy. Validate untrusted input, bound its size, and ensure that URLs and claims are appropriate for your application before rendering.

Development rich-result warnings are advisory, not a security boundary or a production schema validator.

## Stable identity

Use document-unique `id` values. React's `key` identifies a component instance; `scriptKey` applies to the emitted script element. Neither option automatically merges or deduplicates JSON-LD data.
