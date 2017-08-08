// webpack.config.js
const path = require('path');
const webpack = require('webpack');

const pathOutput = path.resolve(__dirname, 'dist');
const pathNodeModules = path.resolve(__dirname, 'node_modules');


const config = {
	entry: {
		app:'./src/js/index.js'
	},
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './dist',
		hot:true
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
	],
	output: {
		filename:'bundle.js',
		path: pathOutput
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
				exclude: pathNodeModules
			}
		]
	}
}


module.exports = config;