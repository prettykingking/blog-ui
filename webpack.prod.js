import path from "node:path";
import url from "node:url";
import autoprefixer from "autoprefixer";
import MiniCssExtractPlugin from "mini-css-extract-plugin";

const dirName = url.fileURLToPath(new URL(".", import.meta.url));
const srcPath = path.resolve(dirName, 'src');
const distPath = path.resolve(dirName, 'dist');

const webpackConfig = () => {
  return {
    mode: "production",
    entry: `${srcPath}/index.js`,
    output: {
      path: distPath,
      filename: path.join("static/js", "main.[contenthash].js"),
      clean: true
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: path.join("static/css", "[name].[contenthash].css"),
        chunkFilename: path.join("static/css", "[id].[contenthash].css")
      })
    ],
    module: {
      rules: [
        {
          // see https://github.com/webpack/webpack/issues/11467
          // resolve.fullySpecified: false
          test: /\.m?js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ['@babel/preset-env']
            }
          }
        },
        {
          // see https://webpack.js.org/guides/asset-modules/
          test: /\.(woff|woff2)$/,
          type: 'asset/resource',
          generator: {
            filename: 'static/fonts/[hash][ext][query]',
          }
        },
        {
          test: /\.(scss)$/,
          use: [
            {
              // Extracts CSS for each JS file that includes CSS
              loader: MiniCssExtractPlugin.loader
            },
            {
              // Interprets `@import` and `url()` like `import/require()` and will resolve them
              loader: 'css-loader'
            },
            {
              // Loader for webpack to process CSS with PostCSS
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    autoprefixer()
                  ]
                }
              }
            },
            {
              // Loads a SASS/SCSS file and compiles it to CSS
              loader: 'sass-loader'
            }
          ]
        }
      ]
    }
  };
};

export default webpackConfig;
