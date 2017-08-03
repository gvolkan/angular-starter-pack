const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const path = require('path');

module.exports = {
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      'frontend',
      'node_modules'
    ],
  },
  module: {
    exprContextCritical: false,
    rules: [
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader', 'angular2-template-loader', 'angular2-router-loader']
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.scss$/,
        loaders: ['raw-loader', 'sass-loader']
      },
      {
        test: /\.html$/,
        loader: 'raw-loader'
      },
      {
        enforce: 'post',
        test: /\.(ts)$/,
        loader: 'istanbul-instrumenter-loader',
        exclude: [
          /\.(e2e|spec)\.ts$/,
          /node_modules/
        ]
      }
    ]
  },
  plugins: [
    new ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      path.resolve(__dirname, './../../src/frontend')
    )
  ],
  performance: {
    hints: false
  }
};
