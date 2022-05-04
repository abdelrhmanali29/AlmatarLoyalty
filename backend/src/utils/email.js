const config = require('../config/config');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(config.sendGridApiKey);

const sendEmail = async (options) => {
	const massage = {
		from: config.mailSender,
		to: options.email,
		subject: 'Hello from Almatar loyalty ',
		html: `<p>${options.massage}</p>`,
	};

	sgMail.send(massage);
};

module.exports = sendEmail;
