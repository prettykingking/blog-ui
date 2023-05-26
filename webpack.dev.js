import path from "node:path";
import url from "node:url";

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
    }
  };
};

export default webpackConfig;
