import { defineConfig } from '@mango-scripts/react-scripts'

export default defineConfig({
  tools: {
    sass: {
      additionalData: `@import "src/styles/mixins.scss";`,
    },
  },
  server: {
    port: process.env.PORT,
    proxy: {
      '/api': {
        target: process.env.PROXY_TARGET,
        changeOrigin: true,
        secure: false,
        logLevel: 'debug',
      },
    },
  },
})
