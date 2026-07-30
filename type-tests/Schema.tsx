import { Graph } from '../src/Graph'
import { JsonLd } from '../src/JsonLdScript'
import { BreadcrumbJsonLd, FAQJsonLd, ProductJsonLd } from '../src/RichResults'
import { Schema } from '../src/Schema'
import type { GraphData, GraphNode, JsonLdData, SchemaData } from '../src/types'

const articleSchema = (
  <Schema
    type="Article"
    data={{
      headline: 'Article Title',
      datePublished: '2024-01-01',
      author: {
        '@type': 'Person',
        name: 'John Doe',
      },
    }}
  />
)

const articleSchemaWithMatchingType = (
  <Schema
    type="Article"
    data={{
      '@type': 'Article',
      headline: 'Article Title',
    }}
  />
)

const movieData = {
  name: 'The Matrix',
  director: {
    '@type': 'Person',
    name: 'The Wachowskis',
  },
} satisfies SchemaData<'Movie'>

const movieSchema = <Schema type="Movie" data={movieData} />

const graphNode: GraphNode = {
  '@type': 'Person',
  '@id': 'https://example.com/#person',
  name: 'Jane Doe',
}

const graphData = {
  '@graph': [
    graphNode,
    {
      '@type': 'WebSite',
      '@id': 'https://example.com/#website',
      name: 'Example',
      publisher: { '@id': 'https://example.com/#person' },
    },
  ],
} satisfies GraphData

const graphSchema = <Graph data={graphData} />

const rawJsonLdData: JsonLdData = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Jane Doe',
}

const rawJsonLd = (
  <JsonLd id="person-jsonld" nonce="nonce" data={rawJsonLdData} />
)

const productJsonLd = (
  <ProductJsonLd
    data={{
      name: 'Example Product',
      offers: {
        '@type': 'Offer',
        price: '10',
        priceCurrency: 'USD',
      },
    }}
  />
)

const breadcrumbJsonLd = (
  <BreadcrumbJsonLd
    data={{
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://example.com',
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Blog',
          item: 'https://example.com/blog',
        },
      ],
    }}
  />
)

const faqJsonLd = (
  <FAQJsonLd
    data={{
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is react-structured?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A JSON-LD renderer for React.',
          },
        },
      ],
    }}
  />
)

const invalidArticleData: SchemaData<'Article'> = {
  // @ts-expect-error Product is not assignable to Article data.
  '@type': 'Product',
  name: 'Wrong shape',
}

const invalidArticleShape: SchemaData<'Article'> = {
  // @ts-expect-error sku is a Product property, not Article data.
  sku: 'SKU-123',
}

const mismatchedSchema = (
  <Schema
    type="Article"
    data={{
      // @ts-expect-error Product data cannot be used with type="Article".
      '@type': 'Product',
      name: 'Wrong shape',
    }}
  />
)

const invalidGraphData: GraphData = {
  '@graph': [
    // @ts-expect-error Graph nodes must include a Schema.org @type.
    {
      name: 'Missing type',
    },
  ],
}

const invalidGraphContext: GraphData = {
  // @ts-expect-error Graph context must match schema-dts.
  '@context': 'https://example.invalid',
  '@graph': [],
}

// @ts-expect-error UnknownType is not a Schema.org type known to schema-dts.
type UnknownData = SchemaData<'UnknownType'>

void articleSchema
void articleSchemaWithMatchingType
void movieSchema
void graphSchema
void rawJsonLd
void productJsonLd
void breadcrumbJsonLd
void faqJsonLd
void invalidArticleData
void invalidArticleShape
void mismatchedSchema
void invalidGraphData
void invalidGraphContext
void (0 as unknown as UnknownData)
