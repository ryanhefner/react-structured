# react-structured

[![npm version](https://img.shields.io/npm/v/react-structured.svg)](https://www.npmjs.com/package/react-structured)
[![npm types](https://img.shields.io/npm/types/react-structured.svg)](https://www.npmjs.com/package/react-structured)
[![codecov](https://codecov.io/gh/ryanhefner/react-structured/branch/main/graph/badge.svg)](https://codecov.io/gh/ryanhefner/react-structured)
[![license](https://img.shields.io/npm/l/react-structured.svg)](LICENSE)

Type-safe React components for Schema.org JSON-LD, rich-result helpers, and linked `@graph` documents. Use them in any React application, including Next.js, without a Next.js dependency.

[Documentation](https://react-structured.dev) · [Getting started](https://react-structured.dev/docs/getting-started) · [API reference](https://react-structured.dev/docs/reference) · [Examples](https://react-structured.dev/docs/schema) · [Issues](https://github.com/ryanhefner/react-structured/issues)

Created by [Ryan Hefner](https://www.ryanhefner.com) and [Commune Software](https://commune.software).

## Install

```sh
npm install react-structured
```

Use an existing React 16.14 or newer application. TypeScript declarations are included, with Schema.org types powered by [`schema-dts`](https://github.com/google/schema-dts). Both ESM and CommonJS entry points are available.

## Quick start

Render structured data alongside the visible page content. This example returns a complete React component; replace its example values with facts about your site.

<!-- quickstart:start -->

```tsx
import { Schema } from 'react-structured'

export default function AboutPage() {
  return (
    <main>
      <Schema
        id="organization-jsonld"
        type="Organization"
        data={{
          name: 'Acme Studio',
          url: 'https://example.com',
        }}
      />
      <h1>About Acme Studio</h1>
      <p>We build useful software.</p>
    </main>
  )
}
```

<!-- quickstart:end -->

`Schema` emits an `application/ld+json` script with `@context` and the selected `@type`. It does not render visible content or fetch data. Inspect the initial HTML or rendered DOM to verify the script, and validate the data for your intended search feature. Valid Schema.org markup does not guarantee a search engine will show rich results.

## Choose the right component

| Component           | Use it for                                                                                  | Guide                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| `Schema`            | One Schema.org entity with inferred `SchemaData<'Type'>`                                    | [Typed schema examples](https://react-structured.dev/docs/schema)     |
| `Graph`             | Related entities connected by stable `@id` references                                       | [Graph documents](https://react-structured.dev/docs/graph)            |
| `JsonLd`            | A complete document that already includes `@context`                                        | [Raw JSON-LD](https://react-structured.dev/docs/json-ld)              |
| Rich-result helpers | `ArticleJsonLd`, `BreadcrumbJsonLd`, `FAQJsonLd`, `OrganizationJsonLd`, and `ProductJsonLd` | [Rich-result helpers](https://react-structured.dev/docs/rich-results) |

`Schema` supports every Schema.org `Thing` type represented by `schema-dts`; `Graph` supports its JSON-LD graph documents. TypeScript checks the selected data shape and any explicit top-level `@type`. Use `SchemaData`, `GraphData`, or `JsonLdData` when defining reusable data outside JSX.

Development-time warnings highlight missing fields for selected rich-result helpers. They are guidance, not a complete validator or a promise of eligibility. See the [API reference](https://react-structured.dev/docs/reference) for props and behavior.

## Next.js and metadata

Next.js App Router pages and layouts can render these components directly on the server; a client boundary is not required. With Pages Router, render them alongside page content. Do not nest a react-structured component inside `next/head` or a `PageMeta` component.

Use [`next-meta`](https://next-meta.dev) or native Next.js metadata for titles, canonical URLs, Open Graph, and social cards. Use react-structured alongside it for JSON-LD. Reuse the same absolute canonical and media URLs in both outputs, and avoid emitting the same entity twice.

Follow the [Next.js guide](https://react-structured.dev/docs/nextjs) for complete App Router and Pages Router examples. Other React applications need no Next.js package.

## Safety and script options

All rendering components accept `id`, `nonce`, `scriptKey`, and `validate`:

- Use a document-unique `id` to inspect the script. IDs do not deduplicate scripts; render each entity once.
- Pass your application's CSP `nonce` when required. The library does not generate or distribute nonces.
- React reserves `key` for component identity. `scriptKey` controls the underlying script's React key, not its DOM ID.
- `validate` controls development-time rich-result warnings and defaults to `true`.

The library escapes JSON-LD script content, including `</script>` sequences. Escaping prevents script breakout; it does not establish that user-supplied data is accurate or appropriate to publish. Model the visible page honestly, keep private data out of JSON-LD, and read the [security guide](https://react-structured.dev/docs/security).

## Help and contributing

[Open an issue](https://github.com/ryanhefner/react-structured/issues), browse the [documentation](https://react-structured.dev), or see the [source and tests](https://github.com/ryanhefner/react-structured/tree/main/src). Report security concerns privately to the [maintainer](mailto:hi@ryanhefner.com) rather than a public issue.

## Development

Repository development uses the pinned Node 24 and pnpm versions. These pins do not change the library's React peer compatibility or require consumers to use pnpm.

```sh
nvm use
corepack enable
pnpm install --frozen-lockfile
pnpm run verify
pnpm run build
```

The documentation site is published at [react-structured.dev](https://react-structured.dev). Run `pnpm run docs:dev` locally; see [docs development and deployment](docs/README.md) for the independent site checks and Vercel configuration. Package verification intentionally does not require docs workspace dependencies.

Coverage is generated with `pnpm run test:ci`. Publishing uses npm trusted publishing; package publishing and documentation deployment remain separate operations.

## License

[MIT](LICENSE)
