const { PutObjectCommand, DeleteObjectCommand, S3Client } = require("@aws-sdk/client-s3");
const { fromEnv } = require("@aws-sdk/credential-providers");
const { readFileSync } = require("fs");


async function uploadFile(fileName, filePath, tags) {
	this.logger.debug(`Uploading file to S3 : ${filePath}`);

	let command = new PutObjectCommand({
		Bucket: this.bucketName,
		Key: fileName,
		Body: readFileSync(filePath),
		Tagging: tags
	});

	try {
		const response = await client.send(command);
		this.logger.trace(response);
		this.logger.debug(`Uploaded file to S3 : ${filePath}`);
	} catch (err) {
		this.logger.error(err);
	}
}

async function deleteFile(client, fileName) {
	this.logger.debug(`Deleting file from S3 : ${fileName}`);;

	let command = new DeleteObjectCommand({
		Bucket: this.bucketName,
		Key: fileName
	});

	try {
		const response = await client.send(command);
		this.logger.trace(response);
		this.logger.debug(`Deleted file from S3 : ${fileName}`);;
	} catch (err) {
		this.logger.error(err);
	}
}

function s3FileHandler(region, bucketName, logger) {
	this.logger = logger.child({
		"module": "s3FileHandler"
	});
	try {
		this.client = new S3Client({
			region: region,
			credentials: fromEnv()
		});
		this.bucketName = bucketName;

		this.uploadFile = uploadFile.bind(this);
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