const path = require('path');

module.exports = {
  target: 'node',
  entry: './',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        loader: 'babel-loader',
        exclude: [path.resolve(__dirname, 'node_modules')],
      },
    ],
  },
  stats: 'errors-only',
};
