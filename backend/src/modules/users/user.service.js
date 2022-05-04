const repository = require('./user.repository');
const AppError = require('../../utils/appError');
const validator = require('../../utils/validation');
const config = require('../../config/config');

module.exports = {
	async list(query) {
		let err = false,
			response = {};

		const queryPages = {
			skip: parseInt(query.skip) || parseInt(config.skip),
			limit: parseInt(query.limit) || parseInt(config.limit),
		};

		if (!validator.pagination(queryPages)) {
			err = new AppError('pagination failed', 400);

			return { err, response };
		}

		const pages = {
			limit: queryPages.limit,
			skip: queryPages.skip,
		};

		Reflect.deleteProperty(query, 'limit');
		Reflect.deleteProperty(query, 'skip');

		const users = await repository.find({
			filter: {},
			limit: pages.limit,
			skip: pages.skip,
		});

		response = {
			data: users,
			status: 'success',
			statusCode: 200,
		};

		return { err, response };
	},

	async getById(id) {
		let err = false,
			response = {};

		const isMongoId = validator.isMongoId(id);

		if (!isMongoId) {
			err = new AppError('Id not valid', 400);
			return { err, response };
		}

		const user = await repository.findById({
			id,
			select: '_id name email',
			lean: true,
		});

		if (!user) {
			err = new AppError('User not found', 404);
			return { err, response };
		}

		response = {
			status: 'success',
			statusCode: 200,
			data: user || {},
		};

		return { err, response };
	},
};
