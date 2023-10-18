const mongoose = global.mongoose;

async function generateId(counterName, prefix) {
	try {
		let data = await this.model.updateOne({ "_id": counterName }, { "$inc": { "counter": 1 } }, null).exec();
		if (data.modifiedCount == 0) {
			logger.error('Failed to increment counter');
			throw new Error('Failed to increment counter');
		}
		data = await this.model.findOne({ "_id": counterName });
		return `${prefix}${data.counter}`;
	} catch (err) {
		logger.error(err);
		throw err;
	}
}

function mongooseUtils(logger) {
	this.schema = mongoose.Schema({
		_id: String,
		counter: Number
	});
	this.model = mongoose.model('counter', this.schema, null);
	this.logger = logger;

	this.generateId = generateId.bind(this);
}

mongooseUtils.prototype = {
	constructor: mongooseUtils,
	schema: null,
	model: null,
	logger: null
};

module.exports = mongooseUtils