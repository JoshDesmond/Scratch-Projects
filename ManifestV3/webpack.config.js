const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

var fileExtensions = ["jpg", "jpeg", "png", "gif", "eot", "otf", "svg", "ttf", "woff", "woff2"];

module.exports = {
    mode: "development", // Doesn't minify
    devtool: false,
    entry: {
        content: path.join(__dirname, "app", "js", "content.js"),
        background: path.join(__dirname, "app", "js", "background.js"),
        options: path.join(__dirname, "app", "js", "options.js")
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "[name].bundle.js"
    },
    module: {
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "app/img", to: "img" },
                { from: path.resolve(__dirname, "app/manifest.json") },
                { from: path.resolve(__dirname, "app/options.html") },
                { from: "app/_locales", to: "_locales" }
            ]
        })
    ]
}