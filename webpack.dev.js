import path from "node:path";
import url from "node:url";
import autoprefixer from "autoprefixer";

const dirName = url.fileURLToPath(new URL(".", import.meta.url));
const srcPath = path.resolve(dirName, 'src');
const distPath = path.resolve(dirName, 'dist');

const webpackConfig = () => {
  return {
    mode: "development",
    entry: `${srcPath}/index.js`,
    devServer: {
      port: 8081
    },
    output: {
      path: distPath,
      filename: "main.js",
    },
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
            filename: 'static/fonts/[hash][ext]',
          }
        },
        {
          test: /\.(png|jpg|gif)$/,
          type: 'asset/resource',
          generator: {
            filename: 'static/images/[hash][ext]',
          }
        },
        {
          test: /\.(scss)$/,
          use: [
            {
              // Adds CSS to the DOM by injecting a `<style>` tag
              loader: 'style-loader'
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
