var pkg = require('./package.json')
    , webpack = require('webpack')
    , HtmlWebpackPlugin = require('html-webpack-plugin')
    , ExtractTextPlugin = require("extract-text-webpack-plugin")
    , NODE_ENV = process.env.NODE_ENV || 'development'
    , src = __dirname + '/src'
    , isDev = NODE_ENV === 'development'
;

module.exports = {
    context: src,
    devtool: isDev ? 'cheap-source-map' : null,
    watch:  isDev,
    entry: {
        app: '../index',
        vendor: './vendor'
    },
    output: isDev
        ? { path: __dirname + '/build', filename: '[name].js', publickPath: '/' }
        : { path: __dirname + '/dist', filename: '[name].[hash].js' },
    resolve: {
        root: src,
        extensions: [ '', '.js', '.jsx' ],
        modulesDirectories: [ 'node_modules' ]
    },
    module: {
        preLoaders: [
            { test: /\.jsx?$/, include: src, loader: 'eslint' }
        ],
        loaders: [
            { test: /\.jsx$/, include: src, loader: 'react-hot!babel?cacheDirectory' },
            { test: /\.s?css$/i, loader: ExtractTextPlugin.extract('style', 'css!sass!postcss') },
            { test: /\.(?:jpe?g|png|gif|svg|eot|ttf|woff\d?|otf)$/, loader: 'url?limit=1&name=[name].[ext]?[hash]' }
        ]
    },
    postcss: [
        autoprefixer({ browsers: [ 'last 2 versions' ] })
    ],
    devServer: {
        host: '0.0.0.0',
        port: 3000
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(NODE_ENV)
        }),
        new webpack.ProvidePlugin({
            React: 'react',
            ReactDOM: 'react-dom'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: [ 'vendor' ],
            filename: '[name]' + (isDev ? '' : '.[hash]') + '.js'
        }),
        new HtmlWebpackPlugin({
            name: pkg.name,
            template: 'index.tmpl',
            inject: 'body'
        }),
        new ExtractTextPlugin('[name]' + (isDev ? '' : '.[contenthash]') + '.css', { allChunks: true })
    ].concat(isDev ? new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false }}) : [])
};
