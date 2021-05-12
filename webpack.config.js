const { resolve } = require('path');

module.exports = {
	entry: '/index.js',
	output: {
		filename: 'bundle.js',
		path: resolve(__dirname, 'dist'),
	},
};
