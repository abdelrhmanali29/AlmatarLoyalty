const schema = {
	type: 'object',
	required: ['points', 'email'],
	properties: {
		points: {
			type: 'integer',
			minimum: 0,
		},
		email: {
			type: 'string',
			format: 'email',
		},
	},
};

module.exports = schema;
