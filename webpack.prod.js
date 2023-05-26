import path from "node:path";
import url from "node:url";

const dirName = url.fileURLToPath(new URL(".", import.meta.url));
const srcPath = path.resolve(dirName, 'src');
const distPath = path.resolve(dirName, 'dist');

const webpackConfig = () => {
  return {
    mode: "production",
    entry: `${srcPath}/index.js`,
    output: {
      path: distPath,
      filename: "main.[contenthash].js",
      clean: true
    }
  };
};

export default webpackConfig;
