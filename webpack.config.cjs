
const path = require('path'),
  nodeExternals = require('webpack-node-externals'),
  PROD = process.env.NODE_ENV === 'production';

module.exports = {
  target: 'node18',
  mode: process.env.NODE_ENV || 'development',
  entry: './build.js',
  devtool: false,
  externals: [nodeExternals()],
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: {
      type: "module",
    },
  },
  experiments: {
    outputModule: true,
  },
};
