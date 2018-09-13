
const path = require('path')
const FriendLyErrorPlugin = require('friendly-errors-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpackHtmlPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const webpack = require('webpack')

const { VueLoaderPlugin } = require('vue-loader')


const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'

let plugins = [
  new CleanWebpackPlugin(["./dist"], {
    root: __dirname
  }),
  new FriendLyErrorPlugin(),
  new VueLoaderPlugin(),
  new webpackHtmlPlugin({
    template: './index.html'
  }),
  new webpack.ProvidePlugin({
    $: 'jquery',
    jQuery: 'jquery',
    'window.jQuery': 'jquery',
    'window.$': 'jquery'
  })
]

if(!isDev){
  plugins.push(
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
      chunkFilename: "css/chunks/[id].css"
    })
  )
}/* else{
  plugins.push(
    new webpack.HotModuleReplacementPlugin()
  )
} */
module.exports = {
  mode: isDev ? 'development' : 'production',
  entry: {
    'index': './src/index.js'
  },
  output: {
    filename: '[name].js',
    publicPath: '/',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: './dist',
    // hot: true
  },
  plugins: plugins,
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
      '~~': path.resolve(__dirname, './src'),
      '@': path.resolve(__dirname, './src'),
      '@@': path.resolve(__dirname, './src'),
      'static': path.resolve(__dirname, './src/static/'),
      'assets': path.resolve(__dirname, './src/assets/'),
      'vue$': 'vue/dist/vue.esm.js'
    },
    extensions: ['.vue', '.js', '.json', '.css', '.less']
  },
  // optimization: {
  //   runtimeChunk: {
  //     name: entry => `runtime~${entry.name}`
  //   }
  // },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: [{
          loader: 'vue-loader'
        }]
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.tsx?$/,
        use: [{
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/]
          }
        }],
        exclude: /node_modules/
      },
      {
        test: /.(css|postcss|pcss)$/,
        use: [
          isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.less$/,
        use: [
          isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
          'css-loader', 
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        loader: 'url-loader',
        options: {
          limit: 10000, // 1 KO
          name: 'img/[name].[hash:5].[ext]'
        }
      },
    ]
  }
}