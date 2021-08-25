var path = require('path')
var webpack = require('webpack')
const ESLintPlugin = require('eslint-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const HtmlWebpackPlugin = require('html-webpack-plugin');

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
    main:'./ts-src/demoPage/panel.ts',

    // main: { import:  './build/main.js', dependOn: 'app' },
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: `[name].js`,
  },
  plugins: [
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery',
    // }),
    new ESLintPlugin(),
  ],
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
          // 'style-loader',
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
  // {
  //   test: /\.scss$/,
  //   exclude: /node_modules/,
  //   use: [
  //       {
  //           loader: 'file-loader',
  //           options: { outputPath: 'css/', name: '[name].min.css'}
  //       },
  //       'sass-loader']
  //   },
  {
    test: /\.css$/,
    use: [
      // 'style-loader',
      MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: { sourceMap: true },
      },
      // {
      //   loader: 'postcss-loader',
      //   options: {
      //     sourceMap: true,
      //     config: { path: `./postcss.config.js` },
      //   },
      // },
    ],
  }
  
]},
  plugins:[
    new MiniCssExtractPlugin(
    ),
  ],
  resolve: {
    extensions: ['.ts','.js','.webpack.js', '.web.js',  ],
  },
}

