const Sitemapper = require('sitemapper');
const { Input } = require('enquirer');
const handleError = require('node-cli-handle-error');

const getLinks = async () => {
	const sitemapProdLink = new Input({
		name: 'Production Sitemap link',
		message: 'What is the prod sitemap link?'
	});

	const sitemapStagingLink = new Input({
		name: 'Staging Sitemap link',
		message: 'What is the staging sitemap link?'
	});

	try {
		const sitemapProd = await sitemapProdLink.run();
		const sitemapStaging = await sitemapStagingLink.run();

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

	try {
		const sitemap = new Sitemapper();

		const validateProduction = await sitemap.fetch(sitemapProd);
		const validateStaging = await sitemap.fetch(sitemapStaging);

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
		handleError(err);
	}
};
