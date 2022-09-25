const proxy = [
    {
    context: '/api',
    target: 'https://api-dev.dev.heytelecom.be/api/log-events/v1/log',
    secure: true,
    changeOrigin: true,
    pathRewrite: { '^/home': '' }
    }
    ];
    module.exports = proxy;