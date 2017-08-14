const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base.config.js');
const OptimizeJsPlugin = require('optimize-js-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = webpackMerge(baseConfig, {
  devtool: 'source-map',
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app.polyfills',
      filename: 'app.polyfills.js',
      chunks: ['app.polyfills']
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app.vendors',
      filename: 'app.vendors.js',
      chunks: ['app'],
      minChunks(module) {
        const context = module.context;
        return context && context.indexOf('node_modules') >= 0;
      },
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        sequences: true,
        properties: true,
        loops: true,
        cascade: true,
        dead_code: true,
        comparisons: true,
        drop_debugger: true,
        unsafe: false,
        conditionals: true,
        evaluate: true,
        booleans: true,
        unused: true,
        if_return: true,
        join_vars: true,
        side_effects: true,
        warnings: true,
        hoist_funs: true,
        hoist_vars: false,
      },
      output: {
        comments: false,
        space_colon: false
      }
    }),
    new OptimizeJsPlugin({
      sourceMap: false
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0
    })
  ]
});