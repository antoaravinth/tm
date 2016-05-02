var path = require('path');
var PROD = JSON.parse(process.env.PROD_ENV || '0');
module.exports = {
    entry: './public/js/app.jsx',
    // devtool: 'source-map',
    output: {
        path: __dirname,
        filename: PROD ? './public/dist/bundle.min.js' : './public/dist/bundle.js' 
    },
    module: {
        loaders: [{
            // test: /\.jsx?$/,
            loaders: ['babel?presets[]=es2015,presets[]=react'],
            include: [
                path.resolve(__dirname, "./public/js"),
            ],
            exclude: [
                path.resolve(__dirname, "node_modules"),
            ]
        }],
        resolve: {
            extensions: ['', '.js', '.jsx']
        }
    },
    plugins: PROD ? [
        new webpack.optimize.UglifyJsPlugin({
          compress: { warnings: false }
        })
    ] : []
};