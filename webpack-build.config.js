/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2015-08-06
 */
var path = require('path');
var webpack = require('webpack');
var CleanPlugin = require('clean-webpack-plugin');

module.exports = {
	devtool: 'cheap-source-map',
	entry: {
		'ccms-sdk': './src/index.js',
		'ccms-sdk.min': './src/index.js'
	},
	output: {
		path: path.join(__dirname, 'es5'),
		filename: '[name].js'
	},
	externals: {
		'angular': 'angular',
		'angular-resource': '\'ngResource\'',
		'angular-ui-router': '\'ui.router\''
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: JSON.stringify('production')
			}
		}),
		new CleanPlugin(['es5']),
		new webpack.optimize.UglifyJsPlugin({
			include: /\.min\.js$/,
			minimize: true
		}),
		new webpack.optimize.DedupePlugin(),
		new webpack.NoErrorsPlugin()
	],
	resolve: {
		extensions: ['', '.js']
	},
	eslint: {
		configFile: '.eslintrc',
		emitWarning: true,
		emitError: true,
		formatter: require('eslint-friendly-formatter')
	},
	module: {
		preLoaders: [
			{
				test: /\.js?$/,
				loader: 'eslint-loader',
				exclude: /node_modules/,
				include: path.join(__dirname, 'src')
			}
		],
		loaders: [
			{
				test: /\.js$/,
				loaders: ['babel'],
				exclude: /(node_modules|bower_components)/,
				include: path.join(__dirname, 'src')
			},
			{
				test: /\.json$/,
				loaders: ['json'],
				exclude: /(node_modules|bower_components)/
			}
		]
	}
};
