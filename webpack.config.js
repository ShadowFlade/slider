var path = require('path')
var webpack = require('webpack')
const ESLintPlugin = require('eslint-webpack-plugin')
module.exports = {
  mode: 'development',
  devServer: {
    contentBase: 'build/app.js',
    overlay: true,
    open: true,
  },
  devtool: 'source-map',

  entry: {
    app:'./ts-src/jquery.slider.ts',
    main:'./ts-src/demoPage/panel.ts'},
  output: {
    path: path.resolve(__dirname, './build'),
    filename: `[name].js`,
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
    }),
    new ESLintPlugin(),
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
    extensions: ['.js','.ts','.webpack.js', '.web.js',  ],
  },
}
