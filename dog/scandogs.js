const { ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { doccli } = require('./ddbconn');

module.exports.handler = async () => {
  // Fetching the entire database
  const params = {
    TableName: process.env.ddb_table,
  };

  try {
    const data = await doccli.send(new ScanCommand(params));
    // palautetaan tietokannan itemit
    console.log(data.Items);
    return {
      statusCode: 201,
      body: JSON.stringify(data.Items),
    };
  } catch (err) {
    console.error(err);
  }
};
