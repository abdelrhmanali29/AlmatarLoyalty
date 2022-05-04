const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
const { transactionExpirationPeriod } = require('../../config/config');

const transactionSchema = new Schema({
	points: {
		type: Number,
		required: [true, 'Please provide transaction points!'],
	},

	sender: {
		type: String,
		required: [true, 'Please provide transaction sender!'],
	},

	receiver: {
		type: String,
		required: [true, 'Please provide transaction receiver!'],
	},

	transactionTime: Date,
	transactionExpiresAt: Date,
	confirmationCode: { type: String },
	confirmed: { type: Boolean, default: false },
});

//plugins
transactionSchema.plugin(uniqueValidator);
transactionSchema.index(
	{ points: 1, sender: 1, receiver: 1, transactionTime: 1 },
	{ unique: true }
);

// Model middleware (query middleware)
transactionSchema.pre('save', function (next) {
	if (this.isNew) {
		this.transactionExpiresAt = Date.now() + transactionExpirationPeriod;
	}
	next();
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
