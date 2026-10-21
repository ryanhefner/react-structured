# react-structured documentation

The docs app lives in the repository's pnpm workspace and uses the shared OSS-site
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

The committed Chakra Docs dependencies use pinned public releases. To test
local changes to Chakra Docs, publish the packages to your yalc store and link
them in the docs workspace:

```sh
cd docs
yalc add --no-pure @chakra-docs/chakra @chakra-docs/core @chakra-docs/next @chakra-docs/search @chakra-docs/shiki @chakra-docs/source-filesystem
cd ..
pnpm install --no-frozen-lockfile
```

Yalc copies and registrations are intentionally untracked. Remove local links
and restore the committed public versions before running docs CI or deploying.

## Content

Documentation lives in `content/*.md`. Frontmatter owns the title, description,
and navigation order. Do not duplicate the page title or description at the top
of the body. Use `##` for the first body heading. Markdown is rendered through
Postkit; code blocks, callouts, permalinks, layout, navigation, search, and page
actions use Chakra Docs. Raw HTML is inert, and executable MDX is unsupported.

Page actions use automatic composition and download Markdown from real,
generated `/markdown/<slug>.md` endpoints. They do not assume that a docs page
also has a `.md` route.

## LLM documentation

`/llms.txt` indexes the published docs using their real `/markdown/<slug>.md`
endpoints. `/llms-full.txt` includes their complete Markdown bodies. Both are
generated from the docs manifest into `docs/out` at build time and exclude draft
and hidden content. `docs:verify` validates the files and their links. Rebuild
and deploy the site after editing docs; no npm publish is needed.

## Static deployment

```sh
pnpm run docs:tooling
pnpm run docs:build
pnpm run docs:test
pnpm run docs:typecheck
pnpm run docs:verify
pnpm run docs:release-check
```

Deploy `docs/out` to `react-structured.dev`. For Vercel, use `docs` as the project
root; `vercel.json` checks public dependencies, installs the workspace, and builds
the library before the site. Production installs must not depend on a local yalc store. The
manual Documentation checks workflow runs the same public-dependency guard and
uploads the static site after validation.

`pnpm test` and `pnpm run test:ci` run only the library tests; package coverage
does not include the private docs app. `pnpm run test:tooling` checks package
tooling without loading docs code, so `prepublishOnly` can verify a library-only
install. `pnpm run docs:tooling` checks docs tooling, including LLM files,
recommendations, analytics, and dependency guards. `pnpm run docs:test` runs the
docs unit tests separately, including navigation, metadata, and JSON-LD. Install the full
workspace and run `pnpm run build` first: these tests use the built local library
through its public package exports. Both CI and Documentation checks run the
docs suites; filtering the install to the root library is only appropriate for the
library-only publish workflow.

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

## Analytics

Set `NEXT_PUBLIC_FATHOM_SITE_ID` and optionally
`NEXT_PUBLIC_FATHOM_CUSTOM_DOMAIN` before building. React Fathom tracks initial
loads, App Router navigation, and docs interaction events. Empty IDs disable
network analytics. Query strings, fragments, search text, clipboard contents,
and feedback comments are not sent. OG capture pages bypass analytics.

The site pins the published `react-fathom@0.3.0` and Chakra Docs `0.3.0` releases.
No local yalc copies of these packages are needed for a clean CI or deployment
install.
