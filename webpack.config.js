var path = require('path');
module.exports = {
    entry: './public/js/main.js',
    output: {
        path: __dirname,
        filename: './public/dist/bundle.js'
    },
    module: {
        loaders: [{ 
            test: /\.js$/,
            loader: "babel-loader",
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
    }
};