const path = require("path");

module.exports = {
    mode: "development", // Doesn't minify
    entry: {
        content: path.join(__dirname, "app", "js", "content.js"),
        background: path.join(__dirname, "app", "js", "background.js")
    },
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "[name].bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            }
        ]
    }
}