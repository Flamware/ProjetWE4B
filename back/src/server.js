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
  origin: 'http://localhost:8080', // Adjust the origin as per your frontend setup
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

// Auth0 callback route
app.get('/callback', async (req, res) => {
  // Handle Auth0 callback to store user information
  try {
    const { email, given_name, family_name } = req.query; // Assuming Auth0 callback includes user information

    // Example SQL query to insert user into PostgreSQL database
    const insertQuery = `
      INSERT INTO users (email, first_name, last_name, role, created_at, updated_at)
      VALUES ($1, $2, $3, 'mentee', current_timestamp, current_timestamp)
      ON CONFLICT (email) DO NOTHING;`;

    await client.query(insertQuery, [email, given_name, family_name]);

    // Optionally, generate a JWT token for the user
    const token = jwt.sign({ email }, 'your-jwt-secret', { expiresIn: '1h' });

    // Redirect or respond as needed
    res.redirect('http://localhost:8080/dashboard'); // Example redirect to dashboard
  } catch (error) {
    console.error('Error handling Auth0 callback:', error);
    res.status(500).json({ error: 'Internal server error' });
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
// Start the HTTP server
app.listen(portHTTP, () => {
  console.log(`HTTP Server running on http://localhost:${portHTTP}`);
});

