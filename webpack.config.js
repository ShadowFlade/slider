var path = require('path')
var webpack = require('webpack')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev
module.exports = {
  devServer: {
    contentBase: 'build/plugin.js',
    overlay: true,
    open: true,
  },
  devtool:  isDev ?'source-map' : false,

  entry: {
    plugin:'./ts-src/slider/composed/jquery.slider.ts',
    index:'./ts-src/demoPage/demo.ts'

  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: `[name].js`,
    clean:true
  },
  optimization: {
    minimize: isProd,
    minimizer: [new TerserPlugin(
      {
        parallel: true,
      }
    )],
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        include: path.resolve(__dirname, 'ts-src'),
        loader: 'ts-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [],
    }, 
    {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          {
            loader:MiniCssExtractPlugin.loader,
            options:{
              esModule:false,
            }
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
          },
    ],
  },
  {
    test: /\.css$/,
    use: [

      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: { sourceMap: true },
      },

    ],
  }
  
]},
  plugins:[
    new MiniCssExtractPlugin({
      filename: `[name].min.css`
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'ts-src/demoPage/demo.html'
    }),

  ],
  resolve: {
    extensions: ['.ts','.js','.webpack.js', '.web.js',  ],
  },
}

