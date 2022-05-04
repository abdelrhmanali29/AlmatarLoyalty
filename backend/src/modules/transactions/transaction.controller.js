const catchAsync = require('../../utils/catchAsync');
const service = require('./transaction.service');

module.exports = {
	list() {
		return catchAsync(async (req, res, next) => {
			const { err, response } = await service.listByUser(req.user);

			if (err) return next(err);
			res.status(response.statusCode).json(response);
		});
	},

	transfer() {
		return catchAsync(async (req, res, next) => {
			const { err, response } = await service.transfer(req, req.user, req.body);

			if (err) return next(err);
			res.status(response.statusCode).json(response);
		});
	},

	confirm() {
		return catchAsync(async (req, res, next) => {
			const { err, response } = await service.confirm(req.user, req.body);

			if (err) return next(err);
			res.status(response.statusCode).json(response);
		});
	},
};
