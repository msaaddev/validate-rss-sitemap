const welcome = require('cli-welcome');
const pkg = require('./../package.json');
const unhandled = require('cli-handle-unhandled');

module.exports = ({ clear = true }) => {
	unhandled();
	welcome({
		title: `validate-rss-sitemap`,
		tagLine: `by Saad Irfan`,
		description: pkg.description,
		version: pkg.version,
		bgColor: '#00FFFF',
		color: '#000000',
		bold: true,
		clear
	});
};
