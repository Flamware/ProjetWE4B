// Example adjustments in your Node.js server setup
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');
const { client, connectDatabase } = require('./database.js'); // Assuming this is your database connection setup
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const portHTTP = 3000;
const portHTTPS = 8445;

// Middleware
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors({
  origin: 'http://localhost:4200', // Adjust the origin as per your frontend setup
  credentials: true,
}));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 3600000 } // 1 hour expiration time
}));

// Database connection
connectDatabase();

// Auth0 configuration (assuming you resolve the Angular issue)
const auth0Config = {
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENT_ID,
  redirectUri: 'http://localhost:3000/callback', // Adjust callback URL as per your setup
};
//route to check if user exists
app.post('/api/checkUser', async (req, res) => {
  const { email } = req.body;
  try {
    const query = `
      SELECT * FROM users WHERE email = $1;`;

    const result = await client.query(query, [email]);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// route user-exists
app.get('/api/user-exists', async (req, res) => {
  const { email } = req.query; // Access email from query parameter

  try {
    const query = `
      SELECT * FROM users WHERE email = $1;`;

    const result = await client.query(query, [email]);
    res.status(200).json({ exists: result.rows.length > 0 }); // Check if rows exist
  } catch (error) {
    console.error('Error checking user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/create-user', async (req, res) => {
  const { email, first_name, last_name } = req.body;
  console.log('Request body:', req.body);

  try {
    const insertQuery = `
      INSERT INTO users (email, first_name, last_name, created_at, updated_at)
      VALUES ($1, $2, $3, current_timestamp, current_timestamp);`;

    await client.query(insertQuery, [email, first_name, last_name || '']); // Set last_name to empty string if missing

    res.status(200).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);

    // Handle specific errors (optional)
    if (error.code === '23502') { // Handle potential unique constraint violation (e.g., duplicate email)
      res.status(409).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Example route to handle updating user information
app.post('/api/update-user-info', async (req, res) => {
  const { email, first_name, last_name } = req.body;
  console.log('Request body:', req.body);
  try {
    const updateQuery = `
      UPDATE users
      SET first_name = $2, last_name = $3, updated_at = current_timestamp
      WHERE email = $1;`;

    await client.query(updateQuery, [email, first_name, last_name]);

    res.status(200).json({ message: 'User information updated successfully' });
  } catch (error) {
    console.error('Error updating user information:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/api/getAllUsers', async (req, res) => {
  try {
    const query = `
      SELECT * FROM users;`;

    const result = await client.query
    (query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }}
);

// Start the HTTP server
app.listen(portHTTP, () => {
  console.log(`HTTP Server running on http://localhost:${portHTTP}`);
});

