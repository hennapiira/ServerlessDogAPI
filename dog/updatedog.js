const { UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { doccli } = require('./ddbconn');

module.exports.handler = async (event) => {
  // Parsing the request body to JSON format
  const body = JSON.parse(event.body);
  // Initializing the parameters for the database query
  const params = {
    TableName: process.env.ddb_table,
    Key: {
      dogId: event.pathParameters.dogId,
    },
    UpdateExpression: 'set',
    ExpressionAttributeValues: {},
  };

  // Adding changes to the update statement and values for the dog's name, breed, and birthdate if provided
  if (body.dogname) {
    params.UpdateExpression += ' dogname = :n,';
    params.ExpressionAttributeValues[':n'] = body.dogname;
  }
  if (body.breed) {
    params.UpdateExpression += ' breed = :br,';
    params.ExpressionAttributeValues[':br'] = body.breed;
  }
  if (body.btd) {
    params.UpdateExpression += ' btd = :b,';
    params.ExpressionAttributeValues[':b'] = body.btd;
  }

  // Remove the last comma from the UpdateExpression
  params.UpdateExpression = params.UpdateExpression.slice(0, -1);

  try {
    const data = await doccli.send(new UpdateCommand(params));
    console.log('Success, dog updated', data);
    return {
      statusCode: 201,
      body: JSON.stringify(body),
    };
  } catch (err) {
    console.log('Error', err);
  }
};
