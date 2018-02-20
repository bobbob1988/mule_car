module.exports = {
  entry: "./app/main.js",
  output: {
    path: "/home/oliver.su/work/mule/app",
    filename: "bundle.js",
    publicPath: "/"
  },
  devServer: {
    inline: true,
    hot: true,
    historyApiFallback: true,
    https: true,
    contentBase: "./app",
    host: "0.0.0.0",
    port: 8443
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"]
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        use: [
          {loader: "babel-loader"}
        ]
      },
      { 
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ]
      }
     ]
  }
}
