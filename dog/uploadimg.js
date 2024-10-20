const AWS = require('aws-sdk');
const parseMultipart = require('parse-multipart');
const { UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { doccli } = require('./ddbconn');

const BUCKET = process.env.BUCKET;

const s3 = new AWS.S3();

module.exports.handler = async (event) => {
  try {
    // Separating the file and its data from the request
    const { filename, data } = extractFile(event);
    // Saving the image to S3
    const s3Params = {
      Bucket: BUCKET,
      Key: filename,
      Body: data,
    };
    const s3Response = await s3.putObject(s3Params).promise();

    // Checking that the image has been successfully saved to S3
    if (s3Response) {
      // Updating the database only if the image has been successfully saved to S3
      const s3Url = `https://${BUCKET}.s3.amazonaws.com/${filename}`;
      const params = {
        TableName: process.env.ddb_table,
        Key: {
          dogId: event.pathParameters.dogId,
        },
        UpdateExpression: 'set img = :img',
        ExpressionAttributeValues: {
          ':img': s3Url,
        },
      };
      await doccli.send(new UpdateCommand(params));
      // Returning a response that includes the URL of the saved image
      return {
        statusCode: 200,
        body: JSON.stringify({
          link: s3Url,
        }),
      };
    } else {
      throw new Error('Error when uploading image to AWS S3');
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: err.stack }),
    };
  }
};

// Function that separates the file data from the request
function extractFile(event) {
  const boundary = parseMultipart.getBoundary(event.headers['content-type']);
  const parts = parseMultipart.Parse(
    Buffer.from(event.body, 'base64'),
    boundary
  );
  const [{ filename, data }] = parts;

  return {
    filename,
    data,
  };
}
