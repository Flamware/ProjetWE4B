// jwtCheck.js
const { auth } = require('express-oauth2-jwt-bearer');

const jwtCheck = auth({
  audience: 'http://localhost:3000/',
  issuerBaseURL: `https://dev-o6cd4ntq3e4xav4u.eu.auth0.com/`,
});

module.exports = jwtCheck;
