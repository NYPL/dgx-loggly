const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const path = require('path');
const fs = require('fs');
const TerserWebpackPlugin = require('terser-webpack-plugin');

// Keep Node out of the build. See:
// http://jlongster.com/Backend-Apps-with-Webpack--Part-I
// https://github.com/webpack/webpack/issues/839
const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    filename: 'index.min.js',
    path: path.join(__dirname, '/dist'),
    libraryTarget: "umd",
    // name of the global var
    library: "dgxLoggly"
  },
  target: "node",
  externals: nodeModules,
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  // Minification (Utilized in Production)
  optimization: {
    minimizer: [
      new TerserWebpackPlugin({
        terserOptions: {
          warnings: false,
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.json$/,
        loaders: ['json-loader']
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel-loader']
      }
    ]
  },
  plugins: [
    // Cleans the Dist folder after every build.
    new CleanWebpackPlugin()
  ]
};
