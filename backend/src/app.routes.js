const app = require('./app.middlewares');
const requestIp = require('request-ip');
const AppError = require('./utils/appError');
const timeFormat = require('./utils/timeFormat');
const errorHandler = require('./middlewares/errorHandler');
const userRouter = require('./modules/users/user.routes');
const transactionRouter = require('./modules/transactions/transaction.routes');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../almatarLoyalty-swagger-api.json');
const basicAuth = require('express-basic-auth');
const config = require('./config/config');

// Docs auth
const user = config.user;
const password = config.password;
const users = {};
users[user] = password;
app.get(
	'/api/v1/docs',
	basicAuth({
		users: users,
		challenge: true,
	}),
	swaggerUi.setup(swaggerDocument)
);
app.use('/api/v1/', swaggerUi.serve);
app.get('/api/v1/health', (req, res) => {
	const uptime = timeFormat(process.uptime().toString());
	const { ip, url, hostname: host, headers } = req;

	const memory = process.memoryUsage();
	const memoryGB = (memory.heapUsed / 1024 / 1024 / 1024).toFixed(4) + ' GB';
	const clientIp = requestIp.getClientIp(req); // on localhost > 127.0.0.1

	const healthCheck = {
		ip,
		url,
		host,
		uptime,
		clientIp,
		memoryGB,
		message: 'OK',
		time: new Date(),
		forwardedHost: headers['x-forwarded-host'],
	};

	res.status(200).json(healthCheck);
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/transactions', transactionRouter);

app.all('*', (req, res, next) => {
	next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(errorHandler);

module.exports = app;
