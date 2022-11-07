const axios = require('axios');
const htmlparser2 = require('htmlparser2');
const handleError = require('node-cli-handle-error');
const { Input } = require('enquirer');

const getLinks = async () => {
	const feedProdLink = new Input({
		name: 'Production RSS Feed link',
		message: 'What is the prod feed link?'
	});

	const feedStagingLink = new Input({
		name: 'Staging RSS Feed link',
		message: 'What is the staging feed link?'
	});

	try {
		const feedProdURL = await feedProdLink.run();
		const feedStagingURL = await feedStagingLink.run();

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

	try {
		const validateProduction = await axios.get(feedProdURL);
		const validateStaging = await axios.get(feedStagingURL);

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
				console.log(`✅ ${item}`);
			} else {
				console.log(`❌ ${item}`);
			}
		});
	} catch (err) {
		console.log(err);
	}
};
