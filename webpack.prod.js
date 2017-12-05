const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

// 规制目录入口
const glob = require('glob');

// 获取指定路径下的入口文件
function getEntries(globPath) {
  var files = glob.sync(globPath),
   entries = {};

  files.forEach(function(filepath) {
    // src/views/laws/index.jsx
    // src/views/laws/bigtype/index.jsx

    // 取 src/views/(文件结构)/index.jsx
    var pathArr = filepath.split('/'),
        pathLen = pathArr.length,
        name = '', // 入口key

    name = pathArr.slice(2, pathLen - 1).join('_');

    entries[name] = './' + filepath;
  });

  return entries;
}

const entries = getEntries('src/views/**/index.jsx');

const htmlPlugins = Object.keys(entries).map(function (name) {
  // laws         ==> laws.html
  // laws_bigtype ==> laws/bigtype.html
  let namepath = name.replace(/_/g, '/');
  
  return new HtmlWebpackPlugin({
      // 生成出来的html文件名
      filename: name + '.html',
      // 每个html的模版，这里多个页面使用同一个模版
      template: './src/template.html',
      // 自动将引用插入html
      inject: true, // 'body'
      // 每个html引用的js模块，也可以在这里加上vendor等公用模块
      chunks: ['vendors', name],

      // minify: {
      //   removeComments: true,
      //   collapseWhitespace: true,
      //   removeRedundantAttributes: true,
      //   useShortDoctype: true,
      //   removeEmptyAttributes: true,
      //   removeStyleLinkTypeAttributes: true,
      //   keepClosingSlash: true,
      //   minifyJS: true,
      //   minifyCSS: true,
      //   minifyURLs: true,
      // },
  });
});

const webpackConfig = {
  entry: Object.assign({}, entries, {
    vendors: ['react', 'react-dom']
  }),
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'assets/js/[name].js',
    publicPath: '/' // fetch resource base on localhost
  },
  module: {
    rules: [
      // Process JS with Babel.
      {
        test: /\.jsx?$/,
        include: path.resolve(__dirname, 'src'),
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true,
          }
        }
      },

      // for antd-mobile
      {
        test: /\.css$/,
        use: [
          'style-loader', 'css-loader'
        ]
      },

      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            }, 
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  require('postcss-flexbugs-fixes'),
                  require('autoprefixer')({
                    browsers: [
                      '>1%',
                      'last 6 versions',
                      'Firefox ESR',
                      'not ie < 9', // React doesn't support IE8 anyway
                    ],
                    flexbox: 'no-2009',
                  })
                ]
              }
            },
            'less-loader'
          ]
        })
      },
      // "url" loader works like "file" loader except that it embeds assets
      // smaller than specified limit in bytes as data URLs to avoid requests.
      // A missing `test` is equivalent to a match.
      {
        test: /\.(png|jpe?g|gif|bmp)$/,
        include: path.resolve(__dirname, 'src'),
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'assets/media/[name].[ext]',
          }
        }
      }
    ]
  },
  plugins: [
    // [fix issue](https://github.com/facebook/react/issues/6479)
    new webpack.DefinePlugin({
      "process.env": { 
         NODE_ENV: JSON.stringify("production") 
       }
    }),

    new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
    }),

    // 分离entry.vendors
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      filename: 'assets/js/vendors.bundle.js'
    }),

    // Minify the code.
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        // Disabled because of an issue with Uglify breaking seemingly valid code:
        // https://github.com/facebookincubator/create-react-app/issues/2376
        // Pending further investigation:
        // https://github.com/mishoo/UglifyJS2/issues/2011
        comparisons: false,
      },
      output: {
        comments: false,
      },
      sourceMap: true,
    }),

    // 分离css
    new ExtractTextPlugin({
      filename: 'assets/css/[name].css'
    }),

    // copy file
    // new CopyWebpackPlugin([{from: '', to: ''}])
  ],

  // 自动解析后缀，比如 import App from './app'
  resolve: {
    extensions: ['.web.js', '.js', '.jsx', '.json']
  }
};

webpackConfig.plugins = webpackConfig.plugins.concat(htmlPlugins);

module.exports = webpackConfig;