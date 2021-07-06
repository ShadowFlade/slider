var path = require('path')
var webpack = require('webpack')
module.exports = {
  mode: 'development',
  devServer: {
    contentBase: 'build/app.js',
    overlay: true,
    open: true,
  },
  devtool: 'source-map',

  entry: ['./ts-src/jquery.slider.ts'],
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'app.js',
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: path.resolve(__dirname, 'ts-src'),
        loader: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.js'],
  },
}
