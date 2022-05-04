const catchAsync = require('../../utils/catchAsync');
const service = require('./user.service');
const authService = require('./auth.service');
const AppError = require('../../utils/appError');
const User = require('./user.model');
const sendEmail = require('../../utils/email');
const config = require('../../config/config');

const getCookieOptions = () => {
	const cookieOptions = {
		expires: new Date(Date.now() + config.jwtCookieEpiresIn * 60 * 1000),
		httpOnly: true,
	};
	if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

	return cookieOptions;
};

module.exports = {
	signup() {
		return catchAsync(async (req, res, next) => {
			const { err, response } = await authService.create(req.body);

			res.cookie('jwt', response.token, getCookieOptions());
			response.token = undefined;
			if (err) return next(err);
			res.status(response.statusCode).json(response);
		});
	},

	login() {
		return catchAsync(async (req, res, next) => {
			const { err, response } = await authService.login(req.body);

			if (err) return next(err);
			res.cookie('jwt', response.token, getCookieOptions());

			res.status(response.statusCode).json(response);
		});
	},

	protect() {
		return catchAsync(async (req, res, next) => {
			const { err, response } = await authService.protect(req.headers);

			if (err) return next(err);

			// GRANT ACCESS TO PROTECTED ROUTE
			req.user = response.data;
			next();
		});
	},

	logout() {
		return (req, res) => {
			res.cookie('jwt', 'logged out', {
				expires: new Date(Date.now() + 10 * 1000),
				httpOnly: true,
			});

			res.status(200).json({ status: 'success' });
		};
	},
};
