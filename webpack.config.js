// webpack.config.js
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const pathOutput = path.resolve(__dirname, 'dist');
const pathNodeModules = path.resolve(__dirname, 'node_modules');
const env = process.env.NODE_ENV;
const isProd = env === 'production';

console.log('Environment isProd :', isProd);

const plugins = [
	new webpack.HotModuleReplacementPlugin()
];

if(isProd) {
	plugins.push(new webpack.optimize.UglifyJsPlugin({
		sourceMap:true,
		compress: {
			drop_debugger: true,
			drop_console: true,
			screw_ie8: true
		},
		comments:false
	}));
	plugins.push(new ExtractTextPlugin('css/main.css'));
}


const config = {
	entry: {
		app:'./src/js/app.js'
	},
	devtool: 'inline-source-map',
	devServer: {
		host:'0.0.0.0',
		contentBase: './dist',
		hot:true,
		disableHostCheck:true
	},
	plugins,
	output: {
		filename:'bundle.js',
		path: pathOutput
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: ['babel-loader', 'eslint-loader'],
				exclude: pathNodeModules
			},
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
				exclude: pathNodeModules
			},
			{
				test: /\.scss$/,
				use: isProd ?
				ExtractTextPlugin.extract({
					fallback:"style-loader",
					use: ["css-loader", "sass-loader"]
				}) : 
				["style-loader", "css-loader", "sass-loader"]
				,
				exclude: pathNodeModules
			},
			{
				test: /\.(glsl|vert|frag)$/,
				use: ["raw-loader", "glslify-loader"],
				exclude: pathNodeModules
			}
		]
	},
	resolve: {
		alias: {
			'libs':path.resolve(__dirname, 'src/js/libs'),
			'shaders':path.resolve(__dirname, 'src/shaders')
		}
	}
}

module.exports = config;