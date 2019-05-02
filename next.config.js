const withCSS = require('@zeit/next-css')
const { resolve } = require('path')

module.exports = withCSS({
  target: 'serverless',
  webpack(config) {
    config.resolve.alias['@components'] = resolve(__dirname, 'components')

    return config
  }
})
