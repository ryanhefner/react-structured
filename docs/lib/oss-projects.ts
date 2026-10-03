/** Selected credits, not an exhaustive transitive dependency or license inventory. */
export const ossProjectGroups = [
  {
    id: 'library',
    title: 'Library and packages',
    description:
      'Selected dependencies and framework peers used by the published library and its optional packages. Optional integrations are labeled below.',
    projects: [
      {
        name: 'React',
        packages: ['react'],
        description: 'Components and rendering for the library APIs.',
        href: 'https://react.dev/',
      },
      {
        name: 'schema-dts',
        packages: ['schema-dts'],
        description:
          'Typed Schema.org definitions for JSON-LD component props.',
        href: 'https://github.com/google/schema-dts',
      },
    ],
  },
  {
    id: 'site',
    title: 'Documentation site',
    description:
      'Projects used to build and run this website. Shared dependencies appear in both sections when they serve both.',
    projects: [
      {
        name: 'React',
        packages: ['react', 'react-dom'],
        description: 'The component and rendering foundation for this site.',
        href: 'https://react.dev/',
      },
      {
        name: 'Next.js',
        packages: ['next'],
        description: 'Routing, static generation, and site builds.',
        href: 'https://nextjs.org/',
      },
      {
        name: 'Chakra UI',
        packages: ['@chakra-ui/react'],
        description:
          "Accessible interface components and the site's theme system.",
        href: 'https://chakra-ui.com/',
      },
      {
        name: 'Emotion',
        packages: ['@emotion/react'],
        description: 'The styling runtime behind Chakra UI.',
        href: 'https://emotion.sh/',
      },
      {
        name: 'Chakra Docs',
        packages: ['@chakra-docs/chakra', '@chakra-docs/core'],
        description:
          'Documentation navigation, search, page actions, and code examples.',
        href: 'https://github.com/chakra-docs/chakra-docs',
      },
      {
        name: 'Postkit',
        packages: ['@postkit/react'],
        description: 'Markdown prose and document components for the guides.',
        href: 'https://github.com/postkit-org/postkit-js',
      },
      {
        name: 'next-themes',
        packages: ['next-themes'],
        description: 'System-aware light and dark color modes.',
        href: 'https://github.com/pacocoursey/next-themes',
      },
      {
        name: 'React Icons',
        packages: ['react-icons'],
        description: 'Consistent SVG icons across the interface.',
        href: 'https://react-icons.github.io/react-icons/',
      },
      {
        name: 'react-markdown',
        packages: ['react-markdown'],
        description: 'Safe Markdown rendering without executable MDX.',
        href: 'https://github.com/remarkjs/react-markdown',
      },
      {
        name: 'react-structured',
        packages: ['react-structured'],
        description: "The local library used to render this site's JSON-LD.",
        href: 'https://github.com/ryanhefner/react-structured',
      },
    ],
  },
] as const
