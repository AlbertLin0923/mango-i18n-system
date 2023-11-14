import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: ['**/node_modules/**', '**/dist/**', '**/build/**'],
    testTimeout: 20000,
  },
  esbuild: {
    target: 'node14',
  },
})
