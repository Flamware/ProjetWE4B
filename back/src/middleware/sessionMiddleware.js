// sessionMiddleware.js

const session = require('express-session');
const PgSession = require('connect-pg-simple')(session);
const { client } = require('../config/database'); // Import database client

// Ensure the session table exists or create it if not
const createSessionTableQuery = `
CREATE TABLE IF NOT EXISTS session (
  sid VARCHAR PRIMARY KEY,
  sess JSON NOT NULL,
  expire TIMESTAMP NOT NULL
);
`;

async function setupSessionStore() {
  try {
    await client.query(createSessionTableQuery);
    console.log('Session table created successfully or already exists.');
  } catch (err) {
    console.error('Error creating session table:', err);
  }
}

setupSessionStore();

const sessionMiddleware = session({
  store: new PgSession({
    pool: client,
    tableName: 'session',
    pruneSessionInterval: 60 * 60 * 24 // Prune expired sessions daily
  }),
  secret: 'your-secret-key', // Replace with your own secret key
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days expiry
  }
});

module.exports = sessionMiddleware;
