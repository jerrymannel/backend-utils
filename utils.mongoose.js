const mongoose = global.mongoose;

async function generateId() {
	try {
		let data = await this.model.updateOne({ "_id": this.counterName }, { "$inc": { "counter": 1 } }, null).exec();
		if (data.modifiedCount == 0) {
			logger.error('Failed to increment counter');
			throw new Error('Failed to increment counter');
		}
		data = await this.model.findOne({ "_id": this.counterName });
		return `${this.prefix}${data.counter}`;
	} catch (err) {
		logger.error(err);
		throw err;
	}
}

function mongooseUtils(counterName, prefix, logger) {
	this.schema = mongoose.Schema({
		_id: String,
		counter: Number
	});
	this.model = mongoose.model('counter', this.schema, null);
	this.counterName = counterName;
	this.prefix = prefix;
	this.logger = logger;

	this.generateId = generateId.bind(this);
}

mongooseUtils.prototype = {
	constructor: mongooseUtils,
	schema: null,
	model: null,
	counterName: null,
	prefix: null,
	logger: null
};

module.exports = mongooseUtils