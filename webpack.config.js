module.exports = {
	entry: './js/index.js',
	target: 'electron',
	output: {
		filename: 'static/build.js',
		libraryTarget: 'commonjs2'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				include: [
					`${__dirname}/node_modules/react-level-list`,
					`${__dirname}/node_modules/react-level-count`,
					`${__dirname}/js`
				],
				loader: 'babel-loader',
				query: {
					presets: ['react']
				}
			}
		]
	},
	externals: {
		leveldown: true
	}
};
