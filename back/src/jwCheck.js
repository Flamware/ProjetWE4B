// jwtCheck.js
const { auth } = require('express-oauth2-jwt-bearer');

const jwtCheck = auth({
  audience: 'gVbC5EINtdEgMVrHcHTzDxiDm0xHFANZ',
  issuerBaseURL: 'https://dev-o6cd4ntq3e4xav4u.eu.auth0.com/',
  tokenSigningAlg: 'RS256'
});

module.exports = jwtCheck;
