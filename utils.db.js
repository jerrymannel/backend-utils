function generateMetaData(req) {
	return {
		"lastModified": new Date(),
		"version": "1.0.0",
		"modifiedBy": req.headers["user"] ? req.headers["user"] : null,
	}
}

module.exports = {
	generateMetaData
}