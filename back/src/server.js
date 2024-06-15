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

// Start the HTTP server
app.listen(portHTTP, () => {
  console.log(`HTTP Server running on http://localhost:${portHTTP}`);
});

