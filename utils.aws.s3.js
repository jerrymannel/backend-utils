const { PutObjectCommand, DeleteObjectCommand, HeadObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const { fromEnv } = require("@aws-sdk/credential-providers");
const { readFileSync } = require("fs");


async function uploadFile(fileName, filePath, tags) {
	let command = new PutObjectCommand({
		Bucket: this.bucketName,
		Key: fileName,
		Body: readFileSync(filePath),
		Tagging: tags
	});
	try {
		const response = await this.client.send(command);
		this.logger.trace(response);
		this.logger.debug(`Uploaded file : ${fileName}`);
	} catch (err) {
		this.logger.debug(`Error uploading file : ${fileName}`);
		this.logger.error(err);
	}
}

async function checkFileExists(fileName) {
	let command = new HeadObjectCommand({
		Bucket: this.bucketName,
		Key: fileName
	});

	try {
		const response = await this.client.send(command);
		this.logger.trace(response);
		this.logger.debug(`File exists : ${fileName}`);
		return true;
	} catch (err) {
		this.logger.debug(`File does not exists : ${fileName}`);
		this.logger.trace(err);
		return false;
	}
}

async function deleteFile(fileName) {
	let command = new DeleteObjectCommand({
		Bucket: this.bucketName,
		Key: fileName
	});

	try {
		const response = await this.client.send(command);
		this.logger.trace(response);
		this.logger.debug(`Deleted file : ${fileName}`);;
	} catch (err) {
		this.logger.debug(`File delete error : ${fileName}`);;
		this.logger.error(err);
	}
}

function s3FileHandler(region, bucketName, logger) {
	try {
		this.client = new S3Client({
			region: region,
			credentials: fromEnv()
		});
		this.logger = logger.child({
			"module": "s3FileHandler",
			"bucketName": bucketName,
			"region": region
		});
		this.bucketName = bucketName;

		this.uploadFile = uploadFile.bind(this);
		this.checkFileExists = checkFileExists.bind(this);
		this.deleteFile = deleteFile.bind(this);
	} catch (err) {
		logger.error(err);
		throw err;
	}
}

s3FileHandler.prototype = {
	constructor: s3FileHandler,
	client: null,
	bucketName: null,
	logger: null
};

module.exports = s3FileHandler;