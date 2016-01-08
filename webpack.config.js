'use strict';
const webpack = require('webpack');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';

let config = {
  entry: {
    index: './lib/index.js'
  },
  output: {
    path: path.resolve('dist'),
    filename: 'redux-combine.js',
    library: 'Redux-combine',
    libraryTarget: 'umd',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'stage-0']
        }
      }
    ]
  }
};

if (isProduction) {
  config.output.filename = 'redux-combine.min.js';
  config.plugins = [
    new webpack.optimize.UglifyJsPlugin()
  ];
}

module.exports = config;
