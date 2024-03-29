const webpack = require('webpack');
const path = require('path');
// React v.16 uses some newer JS functionality, so to ensure everything
// works across all browsers, we're adding babel-polyfill here.
require('babel-polyfill');

module.exports = {
  entry: [
  //'babel-polyfill' is used for async and await
  'babel-polyfill',
  './src/index.js'
  ],
  module: {
    loaders: [
    { test: /\.(jsx|js)?$/, loader: 'babel-loader', exclude: /node_modules/ },
    { test: /\.s?css$/, loader: 'style-loader!css-loader!sass-loader' },
    { test: /\.json$/, loader: 'json-loader' },
    {
     test: /.(ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
     use: [{
       loader: 'file-loader',
       options: {
         outputPath: 'fonts/', 
         publicPath: '../'      
       }
     }]
   },
   {
    test: /\.(gif|png|jpe?g)$/i,
    use: [
    'file-loader',
    {
      loader: 'image-webpack-loader',
      options: {
        bypassOnDebug: true,
        outputPath: 'fonts/', 
        publicPath: '../'     
      },
    },
    ],
  }
  ]
},
resolve: {
  modules: [
  path.resolve('./'),
  path.resolve('./node_modules'),
  ],
  extensions: ['.js','.scss','.jsx','.json'],
},
output: {
  path: path.join(__dirname, '/dist'),
  publicPath: '/',
  filename: 'bundle.js'
},
devtool: 'source-map',
devServer: {
  contentBase: './dist',
  hot: true
},
plugins: [
new webpack.optimize.OccurrenceOrderPlugin(),
new webpack.HotModuleReplacementPlugin(),
new webpack.NoEmitOnErrorsPlugin(),
//The plugin replacement function is used to solve the iconv-loader issue
new webpack.NormalModuleReplacementPlugin(
       /\/iconv-loader$/, 'node-fetch'
   )
]
};
