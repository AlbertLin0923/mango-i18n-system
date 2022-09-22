const { createProxyMiddleware } = require('http-proxy-middleware')

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'http://localhost:5006/',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug' // this what you want
    })
  )
}
