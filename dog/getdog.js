const { GetCommand } = require('@aws-sdk/lib-dynamodb');
const { doccli } = require('./ddbconn');

module.exports.handler = async (event) => {
  // Fetching a dog by the dogId provided in the route
  const params = {
    TableName: process.env.ddb_table,
    Key: {
      dogId: event.pathParameters.dogId,
    },
  };

  try {
    const data = await doccli.send(new GetCommand(params));
    console.log(data.Item);
    return {
      statusCode: 201,
      body: JSON.stringify(data.Item),
    };
  } catch (err) {
    console.error(err);
  }
};
