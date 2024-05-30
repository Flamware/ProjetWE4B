const express = require('express');
const path = require('path');
const session = require('express-session');
const http = require('http');
const https = require('https');
const { client, connectDatabase } = require('./database.js'); // Import the database module
const app = express();
const portHTTP = 3000; // HTTP port
const portHTTPS = 8445; // HTTPS port
require('dotenv').config();
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fs = require('fs');
const ip = require('ip');
const bodyParser = require('body-parser');

// Increase the limit to handle larger payloads
app.use(bodyParser.json({ limit: '50mb' })); // Adjust the limit as needed
connectDatabase();

// Enable CORS
app.use(cors());

// import routes
const userRoutes = require('./routes/users');
app.use('/api', userRoutes);

// start server
app.listen(portHTTP, () => {
    console.log(`Server running on http://${ip.address()}:${portHTTP}`);
});
