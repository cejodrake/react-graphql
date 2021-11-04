module: {
  // eslint-disable-next-line no-labels
  rules: [
    {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      include: path.resolve(
        __dirname,
        "./node_modules/bootstrap-icons/font/fonts"
      ),
      use: {
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "webfonts",
          publicPath: "../webfonts"
        }
      }
    }
  ];
}
