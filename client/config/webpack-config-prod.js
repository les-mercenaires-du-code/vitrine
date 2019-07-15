// process.traceDeprecation = true; // track outdated deps

const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');


const webpackConfig = {
  mode: 'production',
  devtool: 'source-map',
  entry: [
    './client/index.js',
  ],
  target: 'web',
  output: {
    path: path.join(__dirname, '../../dist/public/build'),
    // we use hash and name so that the client can cash the different versions..
    filename: '[hash]-[name].js',
    publicPath: '/build/',
  },
  node: {
    // Prevents the `process.env` defined in server response
    // from being re-defined inside modules
    // see https://github.com/webpack/node-libs-browser
    process: false
  },

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
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
          output: {
            comments: false,
          },
        },
      }),
      new OptimizeCSSAssetsPlugin({})
    ],
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
          MiniCssExtractPlugin.loader,
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
                path.resolve('./client/components/app.scss'),
              ],
            },
          },
          {
            loader: 'sass-resources-loader',
            options: {
              sourceMap: true,
              resources: [
                'client/mixins.scss',
              ]
            }
          },
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].[hash].css',
      chunkFilename: '[id].[hash].css',
    }),

    new webpack.LoaderOptionsPlugin({
      debug: false
    }),

    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify('production'),
      BROWSER: true,
    }),

    new HtmlWebpackPlugin({
      template: './client/index.html',
      filename: '../index.html',
    }),

    // copy all assets to dist folder
    new CopyWebpackPlugin([
      // bootstrap grid
      { from: './node_modules/bootstrap/dist/css/bootstrap-grid.min.css', to: '../styles' },
      { from: './node_modules/bootstrap/dist/css/bootstrap-grid.min.css.map', to: '../styles' },
    ]),

    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$|\.eot?.+$|\.ttf?.+$|\.woff?.+$|\.svg?.+$/,
      threshold: 8192,
      minRatio: 0.8
    }),

  ],

};

if (process.env.NODE_ENV === 'analyse') {
  webpackConfig.plugins.push(
    new BundleAnalyzerPlugin({
      generateStatsFile: true,
    })
  );
}

module.exports = webpackConfig;
