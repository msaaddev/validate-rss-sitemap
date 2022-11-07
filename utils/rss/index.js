const axios = require('axios');
const htmlparser2 = require('htmlparser2');
const handleError = require('node-cli-handle-error');
const { Input } = require('enquirer');
const ora = require('ora');
const cliTable = require('cli-table');
const chalk = require('chalk');

const getLinks = async () => {
	const feedStagingLink = new Input({
		name: 'Staging RSS Feed link',
		message: 'RSS feed link to validate?',
		hint: 'e.g. Staging RSS feed link'
	});

	const feedProdLink = new Input({
		name: 'Production RSS Feed link',
		message: 'RSS feed link to validate with?',
		hint: 'e.g.Production RSS feed link'
	});

	try {
		const feedStagingURL = await feedStagingLink.run();
		const feedProdURL = await feedProdLink.run();

		return {
			feedProdURL,
			feedStagingURL
		};
	} catch (err) {
		handleError(err);
	}
};

module.exports = async () => {
	const { feedProdURL, feedStagingURL } = await getLinks();

	const validateWith = [];
	const validate = [];

	const spinner = ora();
	const table = new cliTable({
		head: [chalk.green('Status'), chalk.green('URL')]
	});

	try {
		console.log();
		spinner.start('Fetching RSS feed...');

		const validateProduction = await axios.get(feedProdURL);
		const validateStaging = await axios.get(feedStagingURL);

		spinner.succeed('RSS feed fetched successfully');

		spinner.start('Validating RSS feed...');
		const xmlProduction = validateProduction.data;
		const feedProduction = htmlparser2.parseFeed(xmlProduction);

		feedProduction.items.forEach(item => {
			validateWith.push(item.id);
		});

		const xmlStaging = validateStaging.data;
		const feedStaging = htmlparser2.parseFeed(xmlStaging);

		feedStaging.items.forEach(item => {
			validate.push(item.id);
		});

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
		console.log(err);
	}
};
