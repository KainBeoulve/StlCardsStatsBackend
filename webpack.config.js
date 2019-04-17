const path = require('path');
require("babel-polyfill");

module.exports = {
    entry: ["babel-polyfill","./src/index.js"],
    target:'node',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'build')
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
    }
};