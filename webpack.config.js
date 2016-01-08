const webpack = require('webpack');
const path = require('path');

module.exports = {
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
