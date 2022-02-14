const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = env => {
	return {
		optimization: {
			minimize: true,
			minimizer: [new TerserPlugin({
				terserOptions: {
				ecma: undefined,
				parse: {},
				compress: {},
				mangle: true, // Note `mangle.properties` is `false` by default.
				properties: true,
				module: false,
				// Deprecated
				output: null,
				format: null,
				toplevel: false,
				nameCache: null,
				ie8: false,
				keep_classnames: undefined,
				keep_fnames: false,
				safari10: false,
				
			}})],
		},
		watch: false,
		mode: "production",
		entry: {
			home: './public/build/index.js'
		},
		output: {
			path: path.resolve(__dirname, './public/build2/'),
			filename: 'index.js'
		},
		module: {
			rules: [
				{ enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
			]
		},
		resolve: {
			extensions: [".js"]
		},
		plugins: [
		]
	};
};