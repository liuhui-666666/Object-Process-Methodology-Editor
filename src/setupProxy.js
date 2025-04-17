const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');
const rawConfig = fs.readFileSync('public/config.json');
const config = JSON.parse(rawConfig);
module.exports = function(app) {
    app.use(
      '/dev-api',
      createProxyMiddleware({
        // target: 'http://192.168.1.171:8080', //代理的地址
        // target: 'http://124.221.14.105:8080',
        target:config.apiBaseUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/dev-api': ''  // 将请求路径中的 "/api" 替换为 ""
        }
      })
    )
  };
