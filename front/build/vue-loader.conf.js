'use strict'
const utils = require('./utils')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const config = require('../config')
const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

module.exports = {
  loaders: [{
    test: /\.(sa|sc|c|le)ss$/,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
      'less-loader'
    ]
  }
  ],
  cssSourceMap: sourceMapEnabled,
  cacheBusting: config.dev.cacheBusting,
  transformToRequire: {
    video: ['src', 'poster'],
    source: 'src',
    img: 'src',
    image: 'xlink:href'
  }
}
