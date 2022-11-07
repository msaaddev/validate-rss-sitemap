const Sitemapper = require('sitemapper');
const { Input } = require('enquirer');
const handleError = require('node-cli-handle-error');
const ora = require('ora');
const cliTable = require('cli-table');
const chalk = require('chalk');
const ask = require('../ask');

const getLinks = async () => {
	const sitemapStagingLink = await ask({
		name: 'Staging Sitemap link',
		message: 'Site map link to validate?',
		hint: 'e.g. Staging Sitemap link'
	});

	const sitemapProdLink = await ask({
		name: 'Staging Sitemap link',
		message: 'Sitemap link to validate with?',
		hint: 'e.g. Production sitemap link'
	});

	try {
		const sitemapStaging = await sitemapStagingLink.run();
		const sitemapProd = await sitemapProdLink.run();

		return {
			sitemapProd,
			sitemapStaging
		};
	} catch (err) {
		handleError(err);
	}
};

module.exports = async () => {
	const { sitemapProd, sitemapStaging } = await getLinks();

	let validateWith = [];
	let validate = [];

	const spinner = ora();
	const table = new cliTable({
		head: [chalk.green('Status'), chalk.green('URL')]
	});

	try {
		console.log();
		spinner.start('Fetching sitemaps...');
		const sitemap = new Sitemapper();

		const validateProduction = await sitemap.fetch(sitemapProd);
		const validateStaging = await sitemap.fetch(sitemapStaging);

		spinner.succeed('Sitemaps fetched successfully');

		spinner.start('Validating sitemaps...');

		validateWith = [...validateProduction.sites];
		validate = [...validateStaging.sites];

		validateWith.forEach(item => {
			if (validate.includes(item)) {
				table.push([
					chalk.bgGreen.hex(`#000000`).bold(` EXISTS `),
					item
				]);
			} else {
				table.push([
					chalk.bgRed.hex(`#000000`).bold(` MISSING `),
					item
				]);
			}
		});

		spinner.succeed('Find the results below ↓');

		// display table
		console.log('');
		console.log(table.toString());
	} catch (err) {
		spinner.fail('Something went wrong');
		handleError(err);
	}
};
