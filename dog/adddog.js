// Lisäys käyttäen documentclientia
const { PutCommand } = require('@aws-sdk/lib-dynamodb');
const { doccli } = require('./ddbconn');
const { v4: uuidv4 } = require('uuid');

/* Adding a dog on the database

{
  "dogname": "Oreo",
  "breed": "Welsh corgi cardigan",
  "btd": "24-06-2024" 
}
*/

module.exports.handler = async (event) => {
  // Parsing the request body to JSON format
  const body = JSON.parse(event.body);
  // Defining the used database and the item to be created in it
  const params = {
    TableName: process.env.ddb_table,
    Item: {
      dogId: uuidv4(),
      dogname: body.dogname,
      breed: body.breed,
      btd: body.btd,
      img: 'No image',
    },
  };

  try {
    const data = await doccli.send(new PutCommand(params));
    console.log('Success, dog created', data);
    return {
      statusCode: 201,
      body: JSON.stringify(body),
    };
  } catch (err) {
    console.error(err);
  }
};
