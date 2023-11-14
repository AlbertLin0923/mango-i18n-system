module.exports = {
  distDir: 'build',
  loader: {
    sass: {
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
}
