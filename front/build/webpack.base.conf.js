/* eslint-disable */
var HtmlWebpackPluginHelper= require("./utils/webpack_html_plugin_helper");

var path = require('path');
var utils = require('./utils');

const vuxLoader = require('vux-loader');

var config = require('../config');

var vueLoaderConfig = require('./vue-loader.conf');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HappyPack = require('happypack');
const webpack = require('webpack');
function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const HtmlConfig = {
  htmls: [
    {template: './front/src/error/404.html',filename:'404.html', chunks: ['error']},
    {template: './front/src/error/error.html',filename:'error.html', chunks: ['error']},
  ],
  global_chunks: [],
  vue_chunks:['manifest','vendor']
};

let webpackConfig = {
  entry: {
    error: './front/src/error/error.js',
  },
  output: {
    path: process.env.NODE_ENV === 'production'
      ? config.build.assetsRoot : config.build.assetsRootDev,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
      vue$: 'vue/dist/vue.esm.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'),resolve('front')]
      },
      {
        test: /\.less$/,
        // loader: ExtractTextPlugin.extract("style-loader", "css-loader!less-loader")
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: { minimize: true }
          }, 'less-loader']
        })
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            options: { minimize: true },
          }],
        })
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name][hash:4].[ext]')
        }
      },
      {
        test: /(\.html$|\.mustache$|\.ejs$)/,
        use: {
          loader: 'html-loader',
          options: {
            minimize: false,
            removeAttributeQuotes: false,
            attrs: false
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[ext]?[hash:7]')
        }
      }
    ]
  },
  plugins: [
    new HappyPack({
      id: 'babel',
      threads: 6,
      tempDir: 'node_modules/.temp/.happypack/',
      loaders: [ 'babel-loader' ]
    }),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery',//'jQuery',
      'windows.jQuery': 'jquery'
    }),
  ]
};

new HtmlWebpackPluginHelper().run(webpackConfig, HtmlConfig);


module.exports = vuxLoader.merge(webpackConfig, {
  plugins: ['vux-ui', 'progress-bar', 'duplicate-style']
})
