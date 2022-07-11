const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const sveltePreprocess = require('svelte-preprocess');

module.exports = env => {
	let production = env.production ? true : false;
	return {
		optimization: {
			minimize: production,
			minimizer: [new TerserPlugin({
				terserOptions: {
				ecma: undefined,
				parse: {},
				compress: {},
				mangle: true, // Note `mangle.properties` is `false` by default.
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
		watch: !production,
		watchOptions: {

		},
		mode: production ? 'production' : 'development',
		entry: {
			home: './src/index.tsx'
		},
		output: {
			path: path.resolve(__dirname, './public/build'),
			filename: 'index.js'
		},
		module: {
			rules: [
				{
					test: /\.svelte$/,
					use: {
						loader: 'svelte-loader',
						options: {
							emitCss: true,
              hotReload: true,
							preprocess: sveltePreprocess({ sourceMap: !production })
						}
					}
				},
				{ test: /\.txt$/, use: 'raw-loader' },
				{ test: /\.tsx?$/, loader: "ts-loader" },
				{ enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
				{ test: /\.css$/, use: ['style-loader', 'css-loader'] },
				{ test: /\.exec\/calc.js/, use: ['script-loader'] }
			]
		},
		resolve: {
			modules: [
				path.resolve(__dirname + '/src'),
				path.resolve(__dirname + '/node_modules')
			],
			extensions: ['.ts', '.tsx', ".js", ".jsx", ".svelte"],
			mainFields: ['svelte', 'browser', 'module', 'main']
		},
		plugins: [
			new webpack.DefinePlugin({
				"process.env.NODE_ENV": JSON.stringify(production ? 'production' : 'development'),
				"process.env.server": env.server ? true : false
			})
		]
	};
};