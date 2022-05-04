const Transaction = require('./transaction.model');

module.exports = {
	async find(query) {
		return await Transaction.find(query.filter)
			.sort(query.sort)
			.limit(query.limit)
			.skip(query.skip)
			.populate(query.populate)
			.select(query.select)
			.lean(query.lean);
	},

	async findOne(query) {
		return await Transaction.findOne(query.filter)
			.sort(query.sort)
			.limit(query.limit)
			.skip(query.skip)
			.populate(query.populate)
			.select(query.select)
			.lean(query.lean);
	},

	async findById(query) {
		return await Transaction.findById(query.id)
			.populate(query.populate)
			.select(query.select)
			.lean(query.lean);
	},

	async bulkWrite(updateOperations) {
		return await Transaction.bulkWrite(updateOperations);
	},

	async count(filter) {
		return await Transaction.countDocuments(filter);
	},

	async save(transaction) {
		const transactionSaved = new Transaction(transaction);
		await transactionSaved.save();
		return transactionSaved;
	},

	async saveMany(Transactions) {
		return await Transaction.insertMany(Transactions);
	},

	async findOneAndUpdate(filter, updatedTransaction, session) {
		return await Transaction.findOneAndUpdate(filter, updatedTransaction, {
			new: true,
			session,
		});
	},

	async delete(id) {
		const transaction = await Transaction.findByIdAndDelete({ _id: id });

		if (!transaction) return false;
	},
};
