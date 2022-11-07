const Sitemapper = require('sitemapper');

module.exports = async () => {
	let validateWith = [];
	let validate = [];

	try {
		const sitemap = new Sitemapper();

		const validateProduction = await sitemap.fetch(
			'https://rapidapi.com/courses/sitemap.xml'
		);
		const validateStaging = await sitemap.fetch(
			'https://courses-4aamdlkz2-rapidapi.vercel.app/courses/sitemap.xml'
		);

		validateWith = [...validateProduction.sites];
		validate = [...validateStaging.sites];

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
