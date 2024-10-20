/*
Signup
*/
const AWS = require('@aws-sdk/client-cognito-identity-provider');
const { sendResponse, validateInput } = require('../helpers');

const cognito = new AWS.CognitoIdentityProvider();

module.exports.handler = async (event) => {
  try {
    // validateInput checks that the correct data was provided in the body
    const isValid = validateInput(event.body);
    if (!isValid) {
      return sendResponse(400, { message: 'Invalid input' });
    }

    const { email, password } = JSON.parse(event.body);
    const { user_pool_id } = process.env;
    // User object is created in Cognito from the params object data
    const params = {
      UserPoolId: user_pool_id,
      Username: email,
      UserAttributes: [
        {
          Name: 'email',
          Value: email,
        },
        {
          Name: 'email_verified',
          Value: 'true',
        },
      ],
      MessageAction: 'SUPPRESS',
    };
    // Creating a user in Cognito
    const response = await cognito.adminCreateUser(params);

    // Creating a password for the user in Cognito
    if (response.User) {
      const paramsForSetPass = {
        Password: password,
        UserPoolId: user_pool_id,
        Username: email,
        Permanent: true,
      };
      await cognito.adminSetUserPassword(paramsForSetPass);
    }
    return sendResponse(200, { message: 'User registration successful' });
  } catch (error) {
    const message = error.message ? error.message : 'Internal server error';
    return sendResponse(500, { message });
  }
};
