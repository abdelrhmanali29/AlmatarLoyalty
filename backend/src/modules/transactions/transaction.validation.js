const schema = require('./transaction.schema');
const validator = require('validator');
const Ajv = require('ajv').default;
const AjvFormats = require('ajv-formats');
const ajv = new Ajv({ allErrors: true });
AjvFormats(ajv, ['date', 'time', 'date-time', 'email', 'url']);

const usersRepo = require('../users/user.repository');

const validation = async (transfer) => {
	let validate = ajv.compile(schema);

	let valid = validate(transfer);

	let errors = validate.errors;
	if (!errors) errors = [];

	if (!validator.isEmail(transfer.email)) {
		valid = false;
		errors.push({
			keyword: 'type',
			dataPath: '/email',
			message: 'should be valid',
		});
	}

	const user = await usersRepo.findOne({
		filter: { email: transfer.email },
		lean: true,
	});

	if (!user) {
		valid = false;
		errors.push({
			dataPath: '/email',
			message: 'This user email not exists!',
		});
	}

	if (user && user.points < transfer.points) {
		valid = false;
		errors.push({
			dataPath: '/points',
			message: "You haven't points enough!",
		});
	}

	errors.forEach((error) => {
		error.dataPath = error.dataPath.split('/')[1];
	});

	return { valid, errors };
};

module.exports = { validation };
