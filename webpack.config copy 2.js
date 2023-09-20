const path = require('path');



const webpackConfig = {
  mode: "development",
  entry: "./src/index.js",

  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },

  module: {
    rules: [/* 
      {
        // Transpile sources
        test: /\.es6$|\.js$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        use: [babelLoader()]
      },
      {
        // Transpile required packages
        test: new RegExp(`(?:${TRANSPILE_PACKAGES.map(packageRegex).join(')|(?:')})`),
        include: [path.resolve(__dirname, 'node_modules')],
        use: [babelLoader()]
      }, */{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },{
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              limit: 8192, // in bytes
              name: "images/[name].[hash].[ext]", // file name and location after build
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }]
      },
      {
        test: /\.scss$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }, { loader: 'sass-loader' }]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true }
          }
        ]
      }
    ]
  },
  plugins: [],
  resolve: {
    extensions: [".js", ".jsx"],
  },
  devtool: "source-map",

};

// -------------------------------------------------------------------------------
// Sourcemaps
/* if (conf.sourcemaps) {
  webpackConfig.devtool = conf.devtool;
} */

module.exports = webpackConfig;
