import { defineConfig } from '@mango-scripts/react-scripts'

export default defineConfig({
  distDir: 'build',
  loader: {
    sass: {
      enable: true,
      options: {
        additionalData: `@import "src/styles/mixins.scss";`,
      },
    },
  },
  optimization: {
    minimizer: {
      jsMinimizer: {
        minify: 'esbuildMinify',
      },
    },
  },
})
