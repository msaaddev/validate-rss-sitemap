const axios = require('axios');
const htmlparser2 = require('htmlparser2');

module.exports = async () => {
	const validateWith = [];
	const validate = [];

	try {
		const validateProduction = await axios.get(
			'https://rapidapi.com/courses/feed'
		);
		const validateStaging = await axios.get(
			'https://courses-4aamdlkz2-rapidapi.vercel.app/courses/feed'
		);

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
