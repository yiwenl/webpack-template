// webpack.config.js
const path = require('path');
const webpack = require('webpack');

const pathOutput = path.resolve(__dirname, 'dist');
const pathNodeModules = path.resolve(__dirname, 'node_modules');
const env = process.env.NODE_ENV;
const isProd = env === 'production';

console.log('Environment isProd :', isProd);

const plugins = [
	new webpack.HotModuleReplacementPlugin()
];

if(isProd) {
	const pluginUglify = new webpack.optimize.UglifyJsPlugin({
		sourceMap:true,
		compress: {
			drop_debugger: true,
			drop_console: true,
			screw_ie8: true
		},
		comments:false
		
	});
	plugins.push(pluginUglify);
}


console.log('Plugins :', plugins);

const config = {
	entry: {
		app:'./src/js/index.js'
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
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
				exclude: pathNodeModules
			},
			{
				test: /\.scss$/,
				use: ["style-loader", "css-loader", "sass-loader"],
				exclude: pathNodeModules
			},
			{
				test: /\.(glsl|vert|frag)$/,
				use: ["raw-loader", "glslify-loader"],
				exclude: pathNodeModules
			}
		]
	}
}

module.exports = config;