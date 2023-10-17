const mongo = require('mongodb').MongoClient

async function generateId(collection, counterName, prefix, logger) {
	try {
		let data = await collection.updateOne({ "_id": counterName }, { "$inc": { "counter": 1 } });
		if (data.modifiedCount == 0) {
			logger.error('Failed to increment counter');
			throw new Error('Failed to increment counter');
		}
		data = await collection.findOne({ "_id": counterName }, { "next": 1 });
		return `${prefix}${data.next}`;
	} catch (err) {
		logger.error(err);
		throw err;
	}
}

module.exports = {
	generateId
}