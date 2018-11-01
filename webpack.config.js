const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isProd = env === 'production';

  const config = {
    mode: isProd ? 'production' : 'development',
    entry: {
      main: './src/app.js'
    },
    output: {
      filename: 'scripts/name.bundle.js',
      chunkFilename: 'scripts/[id].chunk.js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: '/'
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { 'targets': { 'browsers': ['> 1%', 'not ie <= 11'] }, 'modules': false }]
              ],
              plugins: ['@babel/plugin-syntax-dynamic-import']
            }
          }
        },
        {
          test: /\.scss$/,
          use: [
            'vue-style-loader',
            'css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader'
          ]
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac|woff2?|eot|ttf|otf|png|jpe?g|gif|svg)(\?.*)?$/,
          use: {
            loader: 'url-loader',
            options: {
              limit: 8192,
              name: 'media/[name].[hash:7].[ext]'
            }
          }
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new VueLoaderPlugin(),
      new CopyWebpackPlugin(['src/static']),
      new HtmlWebpackPlugin({ template: 'src/index.html' })
    ],
    optimization: {}
  };

  if (isProd) {
    config.optimization = {
      minimize: true,
      minimizer: [
        new TerserWebpackPlugin({
          cache: true,
          parallel: true
        })
      ]
    }
  }

  if (!isProd) {
    config.devServer = {
      contentBase: './dist',
      historyApiFallback: true,
      proxy: {
        '/api': {
          target: 'http://localhost:3322'
        },
        '/ws': {
          target: 'http://localhost:3322',
          ws: true
        }
      }
    };
  }

  return config;
};
