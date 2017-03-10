const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/mosca.js',
  target: 'node',
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
        },
      },
      {
        test: /mosca\.html/,
        loader: 'file-loader',
        query: {
          name: '[name].[ext]',
        },
      },
      {
        test: /mosca\.png/,
        loader: 'file-loader',
        query: {
          name: '[path][name].[ext]',
        },
      },
      {
        test: /mosca\.json/,
        loader: 'file-loader',
        query: {
          name: '[path][name].[ext]',
        },
      },
    ],
  },
  output: {
    path: './dist',
    filename: 'mosca.js',
    libraryTarget: 'umd',
  },
  externals: [nodeExternals()],
};
