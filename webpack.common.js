const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');


const entryPoints = ['index', 'game']

const entry = Object.fromEntries(entryPoints.map((m) => [m, '/src/' + m + '.ts']))
const htmlPlugins = entryPoints.map((m) =>
	new HtmlWebpackPlugin({
		filename: m + '.html',
		template: './src/' + m + '.html',
		chunks: [m],
		scriptLoading: 'blocking'
	}))

module.exports = {
	entry,
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
		library: {
			type: 'window',
			name: ['marbleMaze', '[name]']
		}
	},
	module: {
		rules: [
			{
				test: /\.(t|m?j)s$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			}
		]
	},

	resolve: {
		extensions: ['.ts', '.tsx', '.js']
	},

	plugins: [
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, 'assets'),
					to: path.resolve(__dirname, 'dist/assets')
				},
				{
					from: path.resolve(__dirname, 'LICENSE.txt'),
					to:  path.resolve(__dirname, 'dist/LICENSE.txt')
				}
			]
		}),
		new ForkTsCheckerWebpackPlugin()
	].concat(htmlPlugins)
}

