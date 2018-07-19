const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const {AngularCompilerPlugin} = require('@ngtools/webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const devMode = process.env.NODE_ENV === 'development';

let entry = {
//  'polyfills': path.join(PATHS.src, 'polyfills.browser.ts'),
 main: './src/main.ts'
//  'extform': path.join(PATHS.apps, 'extform/main.ts'),
//  'style': path.join(PATHS.assets, 'sass', 'app.sass')
};

module.exports = {
 context: __dirname,
 target: 'web',
 entry,
 output: {
  path: __dirname + '/dist',
  filename: 'app.js'
},
 resolve: {
   extensions: ['.ts', '.js', '.json'],
   modules: ['src', 'node_modules'],
 },
 mode: process.env.NODE_ENV,
 stats: 'errors-only',
 module: {
   rules: [{
       test: /\.ts$/,
       loader: '@ngtools/webpack',
       exclude: [/\.(spec|e2e)\.ts$/, /node_modules/],
     },
     {
       test: /\.ts$/,
       loader: 'null-loader',
       include: [/\.(spec|e2e)\.ts$/],
     },
     {
       test: /\.json$/,
       use: 'json-loader'
     },
     {
       test: /\.html$/,
       use: [{
         loader: 'html-loader',
       }],
     },
     {
       test: /\.(eot|woff|woff2|ttf|png|jpg|gif|svg|ico)(\?v=\d+\.\d+\.\d+)?$/,
       loader: 'file-loader',
       options: {
         context: '/src/assets',
         name: '[path][name].[ext]'
       },
     },
     {
       test: /\.css$/,
       use: [
         MiniCssExtractPlugin.loader,
         "css-loader"
       ],
       exclude: ['./src'],
     },
     {
       test: /\.css$/,
       include: ['./src'],
       use: [{
         loader: "raw-loader" // creates style nodes from JS strings
       }],
     },
     {
       test: /\.(scss|sass)$/,
       use: [
         devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
         'css-loader',
         'sass-loader',
       ],
       exclude: ['./src'],
     },
     {
       test: /\.(scss|sass)$/,
       use: [{
           loader: "raw-loader" // creates style nodes from JS strings
         },
         {
           loader: "sass-loader", // compiles Sass to CSS
           options: {
             sourceMap: true
           }
         }
       ],
       include: ['./src'],
     }
   ]
 },
 optimization: {
   splitChunks: {
     cacheGroups: {
       commons: {
         test: /[\\/]node_modules[\\/]/,
         name: "vendors",
         chunks: "all"
       }
     }
   }
 },
 plugins: [
  new CopyWebpackPlugin([
      { from: 'src/assets', to: 'assets'}
  ]),
  new HtmlWebpackPlugin({
      template: __dirname + '/src/index.html',
      output: __dirname + '/dist',
      inject: 'head'
  }),
   new MiniCssExtractPlugin({
     filename: '[name].[hash].css',
   }),
   new webpack.IgnorePlugin(/vertx/),
   new ProgressPlugin(),
   new AngularCompilerPlugin({
     platform: 0,
     entryModule: __dirname + '/src/app/app.module#AppModule',
     sourceMap: true,
     tsConfigPath: __dirname + '/tsconfig.json',
     skipCodeGeneration: true,
   })
 ]
};
