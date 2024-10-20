/*
Helper functions used by lambda functions in the user directory
*/

// Sending the response to the client
const sendResponse = (statusCode, body) => {
  const response = {
    statusCode: statusCode,
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
  return response;
};

// Input validation
const validateInput = (data) => {
  const body = JSON.parse(data);
  const { email, password } = body;
  if (!email || !password || password.length < 6) {
    return false;
  } else {
    return true;
  }
};

module.exports = {
  sendResponse,
  validateInput,
};
