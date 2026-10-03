/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  reactStrictMode: true,
  poweredByHeader: false,
  devIndicators: false,
  allowedDevOrigins: ['react-structured.test'],
  experimental: { optimizePackageImports: ['@chakra-ui/react'] },
}

export default config
