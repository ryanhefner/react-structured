import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['./docs/lib/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    environment: 'jsdom',
  },
})
