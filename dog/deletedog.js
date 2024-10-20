const { DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { doccli } = require('./ddbconn');

module.exports.handler = async (event) => {
  // Removing a dog by the dogId provided in the route
  const params = {
    TableName: process.env.ddb_table,
    Key: {
      dogId: event.pathParameters.dogId,
    },
  };

  try {
    const data = await doccli.send(new DeleteCommand(params));
    console.log('Success, dog deleted', data);
    return {
      statusCode: 201,
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.log('Error', err);
  }
};
