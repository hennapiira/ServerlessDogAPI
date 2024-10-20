const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');

const ddbcli = new DynamoDBClient({ region: 'eu-north-1' });

const marshallOptions = {
  convertEmptyValues: false,
  removeUndefinedValues: true,
  convertClassInstanceToMap: false,
};

const unmarshallOptions = {
  wrapNumbers: false,
};

const doccli = DynamoDBDocumentClient.from(ddbcli, {
  marshallOptions,
  unmarshallOptions,
});

module.exports = { ddbcli, doccli };
