const { AutoComplete } = require('enquirer');
const handleError = require('node-cli-handle-error');

module.exports = async () => {
	const prompt = new AutoComplete({
		name: 'command',
		message: 'What do you want to do?',
		choices: ['rss', 'sitemap']
	});

	try {
		return await prompt.run();
	} catch (error) {
		handleError(error);
	}
	return response;
};
