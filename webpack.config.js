var path = require('path');

module.exports = {
	entry: __dirname + '/src/client/client.ts',
	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'client.bundle.js'
	},
	devtool: "source-map",
	module: {
		rules: [
			{
				test: /\.ts?$/,
				loader: "ts-loader"
			},{
				test: /\.js$/, 
				enforce: "pre", 
				loader: "source-map-loader" 
			}
		],
	},
	resolve: {
		extensions: [".ts", ".js", ".json"]
	},
	devServer: {
		contentBase: __dirname + '/public',
		inline: true
	}
};