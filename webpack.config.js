// webpack.config.js
const path = require('path');

module.exports = {
    entry: './src/index.js', // Your main file
    output: {
        filename: 'router.bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            name: 'MyRouter', // The name of your library
            type: 'umd',      // Universal Module Definition
        },
        globalObject: 'this' // Ensures compatibility in different environments
    },
    mode: 'production', // Set mode to production
};
