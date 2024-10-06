const path = require('path');

module.exports = {
    entry: './src/index.js', // Entry point
    output: {
        filename: 'router.bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: 'MyRouter',
        libraryTarget: 'umd',
        globalObject: 'this'
    },    
    mode: 'production', // Set mode to production
};
