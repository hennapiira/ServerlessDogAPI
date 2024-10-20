/*
Login
*/
const AWS = require('@aws-sdk/client-cognito-identity-provider');
const { sendResponse, validateInput } = require('../helpers');

const cognito = new AWS.CognitoIdentityProvider();

/* {"email": "test@email.com",
"password": "secret"} */

module.exports.handler = async (event) => {
  try {
    // validateInput checks that the correct data was provided in the body
    const isValid = validateInput(event.body);
    if (!isValid) {
      return sendResponse(400, { message: 'Invalid input' });
    }

    const { email, password } = JSON.parse(event.body);
    const { user_pool_id, client_id } = process.env;

    // The params object contains the data that will be sent to Cognito
    const params = {
      AuthFlow: 'ADMIN_NO_SRP_AUTH',
      UserPoolId: user_pool_id,
      ClientId: client_id,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
      },
    };
    // Performing authentication in Cognito and receiving a response
    const response = await cognito.adminInitiateAuth(params);
    // If successful, deliver the token
    return sendResponse(200, {
      message: 'Success',
      token: response.AuthenticationResult.IdToken,
    });
  } catch (error) {
    const message = error.message ? error.message : 'Internal server error';
    return sendResponse(500, { message });
  }
};
