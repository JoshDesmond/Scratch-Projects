const path = require("path");

module.exports = {
    mode: "development", // Doesn't minify
    devtool: "none", // Removes the eval wrapping for more legible code in build
    entry: "./src/index.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "build")
    }
}