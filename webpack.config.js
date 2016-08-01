module.exports = {
  entry: "./react-app/App.js",
  output: {
    path: './public',
    filename: "bundle.js",
    publicPath: '/'
  },
  devtool: 'sourcemap',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  }
};
