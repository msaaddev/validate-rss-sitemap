const { Input } = require('enquirer');

module.exports = async ({ name, message, hint }) => {
	return new Input({
		name,
		message,
		hint,
		validate(value) {
			const regex =
				/[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/i;
			if (!regex.test(value)) return 'Please enter a valid link';

			return true;
		}
	});
};
