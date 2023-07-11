// this is only used to compile demosrc into demo
// the library does not need to be bundled, therefore to be compiled by tsc

var path = require("path");
var CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");
var MiniCssExtractPlugin = require("mini-css-extract-plugin");
var TerserPlugin = require("terser-webpack-plugin");

module.exports = (env, argv) => {
  var isDevelopment = argv.mode === "development";

  var demoConfig = {
    name: "demo",
    entry: "./demosrc/index.ts",
    output: {
      filename: "index.js",
      path: path.resolve(__dirname, "demo"),
    },
    devtool: "source-map",
    devServer: {
      allowedHosts: "all", // Ref: https://github.com/webpack/webpack-dev-server/issues/1604
      hot: true, // Enable Hot Module Replacement.
      static: {
        directory: path.join(__dirname, "demo"), // Serve static files from 'demo' directory.
        publicPath: "/", // All the served static files will be available under root path.
      },
      compress: false, // Do not compress files.
      port: 8080, // Set the server port number.
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: "ts-loader",
          exclude: /node_modules/, // exclude node_modules directory from transpilation
        },
        {
          test: /\.css$/,
          use: [
            "style-loader",
            { loader: "css-loader", options: { sourceMap: true } },
            {
              loader: "postcss-loader",
              options: {
                sourceMap: true,
                postcssOptions: {
                  plugins: [["postcss-preset-env", {}]],
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "demosrc/index.ejs",
        inject: "body",
        hash: true, // Append a unique webpack compilation hash to all included scripts and CSS files. Useful for cache```javascript
      }),
    ],
    resolve: {
      modules: [path.resolve("./node_modules")],
      extensions: [".ts", ".js"],
    },
  };

  if (!isDevelopment) {
    demoConfig.devtool = false; // No source map for production mode.

    demoConfig.devServer = undefined; // No dev server for production mode.

    // Minimize JavaScript and CSS in production mode.
    demoConfig.optimization = {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            keep_fnames: true, // eslint-disable-line
            // keep_fnames keeps function names. Useful for code relying on Function.prototype.name.
            format: {
              comments: false, // Do not preserve comments in output.
            },
          },
          extractComments: false, // Do not extract comments in a separate file.
          parallel: true, // Enable parallelization. Highly recommended.
        }),
        new CssMinimizerPlugin({})
      ],
    };

    // Replace 'style-loader' with MiniCssExtractPlugin.loader to extract CSS into separate files in production mode.
    demoConfig.module.rules[1].use[0] = { loader: MiniCssExtractPlugin.loader };
    demoConfig.plugins.push(
      new MiniCssExtractPlugin({
        filename: "index.css", // The extracted CSS will be put into 'index.css'.
      })
    );
  }

  return demoConfig;
};
