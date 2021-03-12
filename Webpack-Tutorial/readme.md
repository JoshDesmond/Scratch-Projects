This repo was built by following freeCodeCamp.org's Webpack tutorial. See:

https://www.youtube.com/watch?v=MpGLUVbqoYQ

and https://github.com/Colt/webpack-demo-app

Notes:

    npm install --save-dev style-loader css-loader

The module { rules: { use: []}} array activates plugins in reverse order.

using [contenthash] in the filename of output is useful for cachebusting

HtmlWebpackPlugin can reference a template html file and then add in the necessary javascript