var path = require('path');
var webpack = require('webpack');

// Third party plugins.
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestRevisionPlugin = require('manifest-revision-webpack-plugin');

// Development asset host, asset location and build output path.
var publicHost = '/assets/';
var rootAssetPath = './src/assets';
var buildOutputPath = './src/static';

module.exports = {
    entry: {
        // Chunks (files) that will get written out for JS and CSS files.
        app_js: [
            'webpack/hot/dev-server',
            rootAssetPath + '/scripts/app.jsx'
        ],
        app_css: [
            rootAssetPath + '/styles/main.scss',
            rootAssetPath + '/styles/css-loader.css',
            rootAssetPath + '/styles/normalize.css',
            rootAssetPath + '/styles/skeleton.css',
        ]
    },
    output: {
        // Where and how will the files be formatted when they are output.
        path: buildOutputPath,
        publicPath: publicHost,
        filename: '[name].[hash].js',
        chunkFilename: '[id].[hash].js'
    },
    resolve: {
        // Avoid having to require files with an extension if they are here.
        extensions: ['', '.js', '.jsx', '.css'],
        alias: {
            // bind version of jquery-ui
            'jquery-ui': 'jquery-ui/jquery-ui.js',
            // bind to modules;
            modules: path.join(__dirname, '..', 'node_modules'),
        }
    },
    module: {
        // Various loaders to pre-process files of specific types.
        // If you wanted to SASS for example, you'd want to install this:
        //   https://github.com/jtangelder/sass-loader
        loaders: [
            {
                test: /\.jsx$/i,
                loaders: [
                'react-hot-loader',
                'babel?presets[]=react'                                    +
                     ',presets[]=es2015'                                   +
                     ',presets[]=stage-1'                                  +
                     ',plugins[]=transform-es3-member-expression-literals' +
                     ',plugins[]=transform-es3-property-literals'          +
                     ',plugins[]=transform-object-rest-spread'
                ],
                exclude: /node_modules/
            },
            {
                test: /\.scss$/i,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader', 'sass-loader')
            },
            {
                test: /\.css$/i,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader')
            },
            {
                test: /\.(jpe?g|png|gif|svg([\?]?.*))$/i,
                loaders: [
                    'file?context=' + rootAssetPath + '&name=[path][name].[hash].[ext]',
                    'image?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        // Stop modules with syntax errors from being emitted.
        new webpack.NoErrorsPlugin(),
        // Automatically loaded modules
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
        // Ensure CSS chunks get written to their own file.
        new ExtractTextPlugin('[name].[hash].css'),
        // Create the manifest file that Flask and other frameworks use.
        new ManifestRevisionPlugin(path.join('src', 'manifest.json'), {
            rootAssetPath: rootAssetPath,
            ignorePaths: ['/styles', '/scripts']
        })
    ]
};
