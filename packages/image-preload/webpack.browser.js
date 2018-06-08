const { resolve } = require("path");
const config = require("./webpack.config");

module.exports = {
  ...config,
  output: {
    filename: "main.js",
    path: resolve(__dirname, "browser"),
    library: "Preload",
    libraryTarget: "var"
  }
};
