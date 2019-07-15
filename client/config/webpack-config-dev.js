// process.traceDeprecation = true; // track outdated deps

const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  devtool: 'eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './client/index.js',
  ],
  target: 'web',
  output: {
    path: path.join(__dirname, '../public'),
    // we use hash and name so that the client can cash the different versions..
    filename: '[hash]-[name].js',
    publicPath: '/'
  },
  node: {
    // Prevents the `process.env` defined in server response
    // from being re-defined inside modules
    // see https://github.com/webpack/node-libs-browser
    process: false
  },

  // gzip true ? check how to
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        styles: {
          name: 'styles',
          test: /\.scss/,
          chunks: 'all',
          enforce: true
        },
      },
    },
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: path.resolve(__dirname, 'plugins/remove-comments.js'),
            options: {
              babel: {
                sourceType: 'module',
                plugins: [
                  'dynamicImport',
                  'jsx',
                ],
              },
              preserve: [
                'webpackChunkName',
              ],
            },
          },
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              localIdentName: '[path][name]__[local]--[hash:base64:5]',
            },
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [
                path.resolve('./node_modules/bootstrap/dist/css/bootstrap-grid.min.css'),
              ],
            },
          },
          {
            loader: 'sass-resources-loader',
            options: {
              sourceMap: true,
              resources: [
                './client/mixins.scss',
              ]
            }
          }
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),

    new webpack.LoaderOptionsPlugin({
      debug: true
    }),

    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify('development'),
      BROWSER: true,
    }),

    new HtmlWebpackPlugin({
      template: './client/index.html',
    }),

    // copy all assets to dist folder
    new CopyWebpackPlugin([
      // bootstrap grid
      { from: './node_modules/bootstrap/dist/css/bootstrap-grid.min.css', to: './styles' },
      { from: './node_modules/bootstrap/dist/css/bootstrap-grid.min.css.map', to: './styles' },
    ]),

    new webpack.HotModuleReplacementPlugin(),
  ],

};
