var webpack = require('webpack');
var cleanBuild = require('clean-webpack-plugin');

module.exports = {
  context: __dirname + '/src',
  entry: './index.js',
  output: {
    filename: 'index.min.js',
    path: __dirname + '/dist'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  module: {
    loaders: [
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
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty",
  },
  plugins: [
    // Cleans the Dist folder after every build.
    new cleanBuild(['dist']),
    // Minification (Utilized in Production)
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    })
  ]
}
