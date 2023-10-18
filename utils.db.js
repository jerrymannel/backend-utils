function generateMetaData(res) {
	return {
		"lastModified": new Date(),
		"version": "1.0.0",
		"modifiedBy": res.user ? res.user.username : null,
	}
}

module.exports = {
	generateMetaData
}