const { createProxyMiddleware } = require('http-proxy-middleware')
module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: process.env.PROXY_TARGET,
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
    }),
  )
}
