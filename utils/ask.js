const { Input } = require('enquirer');

module.exports = async ({ name, message, hint }) => {
	return new Input({
		name,
		message,
		hint,
		validate(value) {
			if (value === '') return 'Please enter a valid link';
			if (!value.includes('http')) return 'Please enter a valid link';

			return true;
		}
	});
};
