const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    'app.polyfills': './frontend/app/app.polyfills.ts',
    'app': './frontend/app/app.ts',
  },

  output: {
    publicPath: '/assets/webpack',
    path: path.resolve(__dirname, './../../deploy/frontend/assets/webpack'),
    pathinfo: true,
    filename: '[name].js',
    sourceMapFilename: '[name].map',
    chunkFilename: '[id].chunk.js'
  },

  plugins: [
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      path.resolve(__dirname, './../app')
    ),
    new webpack.ProvidePlugin({})
  ],

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loaders: [
          'awesome-typescript-loader',
          'angular2-template-loader',
          'angular2-router-loader'
        ]
      },
      {
        test: /\.html$/,
        loader: 'raw-loader'
      }
    ]
  },

  resolve: {
    extensions: ['.ts', '.js'],
    modules: [path.resolve(__dirname, './../../node_modules')]
  },

  node: {
    global: true,
    __dirname: true,
    __filename: true,
    process: true,
    Buffer: false
  }
};