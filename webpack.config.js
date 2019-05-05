const path = require('path');
require("babel-polyfill");

module.exports = {
    entry: ["babel-polyfill", "./src/index.js"],
    target: "node",
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "build")
    },

    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"],
                    plugins: ["@babel/plugin-proposal-class-properties"]
                }
            }
        }]
    },

    resolve: {
        modules: [
            "node_modules",
            "src"
        ]
    },

    stats: {
        warningsFilter: warning => {
            // Critical dependency
            return RegExp("node_modules/express/lib/view.js").test(warning);
        }
    },

    optimization: {
        runtimeChunk: "single",
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all"
                }
            }
        }
    }
};