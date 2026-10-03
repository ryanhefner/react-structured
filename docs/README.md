# react-structured documentation

The docs app lives in this private workspace and uses the shared OSS-site
foundation: Chakra UI 3, Chakra Docs, Postkit, Shiki, Suisse fonts, and the
COMMUNE and OSS footers. It has no site CSS files.

## Local development

From the repository root:

```sh
nvm use
corepack enable
pnpm install --frozen-lockfile
pnpm run docs:dev
```

The default development address is `http://localhost:3000`. The Next config
also allows `react-structured.test` for a local reverse proxy. The site respects
system color mode; there is no manual theme switch. Ensure the shared Fontstack
kit permits the production and local domains.

## Local Chakra Docs testing

This development branch uses the locally published yalc packages while the next
Chakra Docs release is being prepared. The copies in `.yalc` are intentionally
not committed. On a second machine, populate them **before installing**:

```sh
cd docs
yalc add --no-pure @chakra-docs/chakra @chakra-docs/core @chakra-docs/next @chakra-docs/search @chakra-docs/shiki @chakra-docs/source-filesystem
cd ..
pnpm install --no-frozen-lockfile
```

The core/search pnpm overrides keep all Chakra Docs packages on the same local
dependency graph. After Chakra Docs is released, replace all six `file:.yalc/`
dependencies with the new immutable npm version, remove the two local overrides,
and refresh the lockfile. This step is required before clean CI or deployment.

## Content

Documentation lives in `content/*.md`. Frontmatter owns the title, description,
and navigation order. Do not duplicate the page title or description at the top
of the body. Use `##` for the first body heading. Markdown is rendered through
Postkit; code blocks, callouts, permalinks, layout, navigation, search, and page
actions use Chakra Docs. Raw HTML is inert, and executable MDX is unsupported.

Page actions use automatic composition and download Markdown from real,
generated `/markdown/<slug>.md` endpoints. They do not assume that a docs page
also has a `.md` route.

## Static deployment

```sh
pnpm run docs:build
pnpm run docs:typecheck
pnpm run docs:verify
```

Deploy `docs/out` to `react-structured.dev`. For Vercel, use `docs` as the project
root; `vercel.json` installs the workspace and builds the library before the
site. Do not deploy the yalc-pinned branch unchanged.

The site emits canonical/Open Graph/Twitter metadata, robots.txt, a sitemap,
and a generated fallback PNG. Set `NEXT_PUBLIC_OG_IMAGE_BASE_URL` at build time
to use an external opengraphs.com renderer for page-specific PNGs. Configure it
to capture these real HTML routes:

- `/social-image`
- `/docs/social-image`
- `/docs/<slug>/social-image`
- `/withoss/social-image`

Alternate capture templates are available at `/og-image` and
`/og-image/docs/<slug>`. Capture pages are `noindex`, have no site chrome, and
expose `data-og-ready="true"` after fonts and SVG assets are ready. Static routes
are generated at build time; no unsupported Next.js static-export rewrites are
used.
