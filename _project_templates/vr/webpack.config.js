<<<<<<< HEAD
/* eslint comma-dangle: 0 */
const webpack           = require('webpack');
const path              = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const prod              = process.env.NODE_ENV === 'production';
const isDevelopment     = process.env.NODE_ENV === 'development';
const ip                = require('ip');
const serverIp          = ip.address();

function getOutput() {

	if(prod) {
		return path.resolve(__dirname, "dist/assets/" )  
	} else {
		return path.resolve(__dirname, "dist/assets/" )  
	}
	
}

module.exports = {
	hotPort: 8081,
	cache: isDevelopment,
	debug: isDevelopment,
	entry: {
		app: ['./src/js/app.js']
	},
	stats: {
		cached: false,
		cachedAssets: false,
		chunkModules: false,
		chunks: false,
		colors: true,
		errorDetails: true,
		hash: false,
		progress: true,
		reasons: false,
		timings: true,
		version: false
	},
	output: {
		path: getOutput(),
		filename:'js/bundle.js',
		publicPath: isDevelopment ? `http://${serverIp}:8081/assets/` : ''
	},
	module: {
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel',
				exclude: /node_modules/,
				query: {
					plugins: ['transform-runtime', 'add-module-exports'],
					presets: ['es2015', 'stage-1']
				}
			},
			{
				test: /\.css$/,
				loader: 'style!css'
			},
			{
				test: /\.scss$/,
				loader: prod ?
					ExtractTextPlugin.extract("style-loader", `css-loader!autoprefixer-loader?browsers=last 3 version!sass-loader?includePaths[]=dist`) :
					`style!css!autoprefixer?browsers=last 3 version!sass?includePaths[]=dist` 
			},
			{ test: /\.(glsl|frag|vert)$/, loader: 'raw', exclude: /node_modules/ },
			{ test: /\.(glsl|frag|vert)$/, loader: 'glslify', exclude: /node_modules/ },
			{ test: /\.png$/, loader: "url-loader?limit=100000", exclude: /node_modules/  },
			{ test: /\.jpg$/, loader: "file-loader", exclude: /node_modules/  }
		]
	},
	resolve: {
		root:__dirname + "/js",
		fallback: path.join(__dirname, "node_modules"),
		alias: {
			'shaders' : __dirname + "/src/shaders",
			'sono'    : __dirname + "/src/js/lib/sono.js"
		}
	},
	plugins: prod ? [
		new webpack.optimize.DedupePlugin(),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				drop_console: true,
				screw_ie8: true,
				warnings: false
			}
		}),
		new ExtractTextPlugin('css/main.css')
	] : [new webpack.optimize.OccurenceOrderPlugin()]
};
=======
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
		sourceMap:false,
		compress: {
			drop_debugger: true,
			drop_console: true,
			screw_ie8: true
		},
		comments:false,
		mangle:false
	}));
	plugins.push(new ExtractTextPlugin('assets/css/main.css'));
}

const entry = isProd ? {app:'./src/js/app.js'}
				: {app:'./src/js/app.js', debug:'./src/js/debug.js'};
const output = isProd ? {
		filename:'assets/js/app.js',
		path: pathOutput
	} : {
		filename:'assets/js/[name].js',
		path: pathOutput
	};

const devtool = isProd ? 'source-map' : 'inline-source-map';



const config = {
	entry,
	devtool,
	devServer: {
		host:'0.0.0.0',
		contentBase: './dist',
		hot:true,
		disableHostCheck:true
	},
	plugins,
	output,
	module: {
		rules: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				query: {
					presets: ['env']
				},
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
>>>>>>> feature/webpack2
