const path = require('path');

module.exports = {
    entry: './src/index.js',
    target:'node',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'build'),
        libraryTarget: 'commonjs'
    },

    resolve: {
        alias: {Source: path.resolve(__dirname, 'src')}
    }
};