'use strict';

var HtmlWebpackPlugin = require('html-webpack-plugin');

var HtmlWebpackPluginHelper = function () {
  // just declare an object, do nothing in constructor
};

HtmlWebpackPluginHelper.prototype = {
  webpackConfig: null,
  templateBaseDir: '',
  filenameBaseDir: '/'
};

HtmlWebpackPluginHelper.prototype.run = function (webpackConfig, config) {
  if (config == null || webpackConfig == null) {
    return;
  }
  if (!webpackConfig) {
    this.webpackConfig = webpackConfig;
    if (this.webpackConfig.template_base_dir) {
      this.templateBaseDir = this.webpackConfig.template_base_dir;
    }
    if (this.webpackConfig.filename_base_dir) {
      this.filenameBaseDir = this.webpackConfig.filename_base_dir;
    }
  }

  let isArray = (typeof config === 'object' && Array.isArray(config.htmls));
  if (!isArray) {
    return;
  }

  let counter = 0;
  let globalChunks = config.global_chunks;
  let htmls = config.htmls;
  for (let item of htmls) {
    counter++;
    let templatePath = item.template;
    let fileName = item.filename;
    let chunks = !item.no_global ? item.chunks.concat(globalChunks) : config.vue_chunks.concat(item.chunks);
    if (item.excludes) {
      for (let excludeItem of item.excludes) {
        let foundPos = chunks.indexOf(excludeItem);
        if (foundPos > -1) {
          chunks.splice(foundPos, 1);
        }
      }
    }

    if (templatePath == null || typeof templatePath !== 'string') { // Haaaaa, very useful
      let err = 'templatePath must be string, please check HtmlConfig. nth-item: ' + counter;
      throw err;
    }

    let plugin = this.createHtmlWebpackPlugin(templatePath, chunks, fileName);
    if (plugin) {
      webpackConfig.plugins.push(plugin);
    }
  }
};

HtmlWebpackPluginHelper.prototype.createHtmlWebpackPlugin = function(templatePath, chunks, fileName) {
  if (templatePath == null || typeof templatePath !== 'string') {
    return null;
  }
  const templateBaseDir = this.templateBaseDir;
  const filenameBaseDir = this.filenameBaseDir;
  let _templatePath = '';
  let _chunks = [];
  let _fileNamePath = '';

  let finalTemplatePath = templatePath;
  if (!templatePath.endsWith('.html') && !templatePath.endsWith('.ejs')) {
    finalTemplatePath = templatePath + '.html';
  }
  _templatePath = templateBaseDir + finalTemplatePath;

  _fileNamePath = process.env.NODE_ENV === 'development' ? finalTemplatePath : (filenameBaseDir + (fileName ? fileName : finalTemplatePath));
  if (typeof chunks === 'string') {
    _chunks.push(chunks);
  }
  if (typeof chunks === 'object' && Array.isArray(chunks)) {
    _chunks = chunks;
  }

  return new HtmlWebpackPlugin({
    template: _templatePath,
    filename: _fileNamePath,
    chunksSortMode: 'manual',
    chunks: _chunks
  });
};

module.exports = HtmlWebpackPluginHelper;
