const jwks = require('jwks-rsa');

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://your-auth0-domain/.well-known/jwks.json' // Replace with your Auth0 domain
  }),
  audience: 'gVbC5EINtdEgMVrHcHTzDxiDm0xHFANZ', // Replace with your API identifier (audience) defined in Auth0
  issuer: 'https://dev-o6cd4ntq3e4xav4u.eu.auth0.com/', // Replace with your Auth0 domain
  algorithms: ['RS256']
});

module.exports = jwtCheck;
