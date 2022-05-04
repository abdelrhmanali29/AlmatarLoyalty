// put your .env file in config folder
const dotenv = require('dotenv');
dotenv.config({ path: __dirname + `/../../.env.${process.env.NODE_ENV}` });

const config = {
	transactionExpirationPeriod:
		process.env.TRANSACTIONEXPIRATIONPERIOD || 1000 * 60 * 10,

	transactionConfirmationCodeMin:
		process.env.TRANSACTIONCONFIRMATIONCODEMIN || 1000,
	transactionConfirmationCodeMax:
		process.env.TRANSACTIONCONFIRMATIONCODEMAX || 10000,

	env: process.env.NODE_ENV || 'development',
	port: process.env.NODE_PORT || 3000,
	token: process.env.TOKEN || 'token',
	user: process.env.LOGINUSER || 'user',
	password: process.env.LOGINPASSWORD || 'password',

	limit: process.env.LIMIT || 20,
	skip: process.env.SKIP || 0,
	jwtSecret: process.env.JWT_SECRET,
	jwtEpiresIn: process.env.JWT_EXPIRES_IN,
	jwtCookieEpiresIn: process.env.JWT_COOKIE_EXPIRES_IN,

	redisHost: process.env.REDIS_HOST,
	redisPort: process.env.REDIS_PORT,
	redisPassword: process.env.REDIS_PASSWORD || '',

	emailUserName: process.env.EMAIL_USERNAME,
	emailPassword: process.env.EMAIL_PASSWOERD,
	emailHost: process.env.EMAIL_HOST,
	emailPort: process.env.EMAIL_PORT,

	sendGridApiKey: process.env.SENDGRID_API_KEY,
	mailSender: process.env.MAIL_SENDER,

	dbURI: process.env.DB_URI,
	testDBURI: process.env.TEST_DB_URI,
	// 'mongodb://localhost:27017/ecommerce',
};

module.exports = config;
