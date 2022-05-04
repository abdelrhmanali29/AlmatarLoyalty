const AppError = require('../../utils/appError');
const { validation } = require('./transaction.validation');
const config = require('../../config/config');
const {
	transactionConfirmationCodeMax,
	transactionConfirmationCodeMin,
} = require('../../config/config');
const sendEmail = require('../../utils/email');
const repository = require('./transaction.repository');
const mongoose = require('mongoose');
const userRepo = require('../users/user.repository');

module.exports = {
	async transfer(req, user, body) {
		let err = false,
			response = {};

		const { valid, errors } = await validation(body);

		if (!valid) {
			err = new AppError('validation failed', 400, errors);
			return { err, response };
		}

		let confirmationCode =
			Math.floor(
				Math.random() *
					(transactionConfirmationCodeMax - transactionConfirmationCodeMin)
			) + transactionConfirmationCodeMin;

		let newTransaction = {
			transactionTime: new Date(Date.now() - 1000),
			points: body.points,
			sender: user.email,
			receiver: body.email,
			confirmationCode,
		};

		let savedTransaction = await repository.save(newTransaction);

		const confirmURL = `${req.protocol}://${req.get(
			'host'
		)}/api/v1/transactions/confirm`;

		const massage = `Hello ${user.email}, 
		please confirm your transaction. 
    click here:  ${confirmURL}
		\\n  
		transaction info: ${JSON.stringify(newTransaction)}
		`;

		try {
			await sendEmail({ massage, email: user.email });
			response = {
				status: 'success',
				statusCode: 200,
				message: 'Transaction success, confirmation sent!',
			};

			return { err, response };
		} catch (err) {
			console.log(err);

			await repository.delete(savedTransaction._id);

			err = new AppError(
				'There was an error sending the email. Try again later!',
				500
			);

			return { err, response };
		}
	},

	async confirm(body) {
		let err = false,
			response = {};

		let transaction = await repository.findOne({
			filter: {
				sender: body.sender.toString(),
				receiver: body.receiver.toString(),
				transactionTime: new Date(body.transactionTime),
				points: parseInt(body.points),
			},
		});

		if (!transaction) {
			err = new AppError('Transaction info not correct.', 400);
			return { err, response };
		}

		if (new Date(transaction.transactionExpiresAt) < new Date()) {
			err = new AppError('Transaction confirmation timed out.', 422);
			return { err, response };
		}

		if (transaction.confirmed) {
			err = new AppError('Transaction already confirmed.', 422);
			return { err, response };
		}

		const session = await mongoose.startSession();
		session.startTransaction();

		try {
			// subtract points from sender
			// add points for receiver
			// confirm transaction

			const sender = await userRepo.findOneAndUpdate(
				{ email: body.sender },

				[{ $set: { points: { $subtract: ['$points', body.points] } } }],
				session
			);

			const recv = await userRepo.findOneAndUpdate(
				{ email: body.receiver },

				[{ $set: { points: { $add: ['$points', body.points] } } }],
				session
			);

			await repository.findOneAndUpdate(
				{
					sender: body.sender.toString(),
					receiver: body.receiver.toString(),
					transactionTime: new Date(body.transactionTime),
					points: parseInt(body.points),
				},
				[{ $set: { confirmed: true } }],
				session
			);

			await session.commitTransaction();
			await session.endSession();

			response = {
				status: 'success',
				statusCode: 200,
				message: 'Transaction confirmed successfully.',
			};

			return { err, response };
		} catch (error) {
			await session.abortTransaction();
			await session.endSession();

			err = new AppError(
				'There was an error confirming transaction. Try again later!',
				500
			);

			return { err, response };
		}
	},

	async listByUser(user) {
		let err = false,
			response = {};

		let transactions = await repository.find({
			filter: {
				$or: [{ sender: user.email }, { receiver: user.email }],
				confirmed: true,
			},
			select: '-transactionExpiresAt -confirmationCode',
			lean: true,
		});

		response = {
			statusCode: 200,
			status: 'success',
			data: transactions,
		};

		return { err, response };
	},
};
