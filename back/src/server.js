// server.js
const express = require('express');
const jwtCheck = require('./middleware/authMiddleware');
const userRoutes = require('./routes/users'); // Import user routes
const cors = require('cors');
const {connect} = require("rxjs"); // Import cors module
const database = require('./database'); // Import database module

const app = express();
const port = process.env.PORT || 3000;

// Connect to the database
database.connectDatabase().catch(console.error);

app.use(cors()); // Use cors middleware
app.use(userRoutes); // Use user routes

// Example endpoint that requires authentication
app.get('/authorized', jwtCheck, (req, res) => {
  res.status(200).send('You are authorized');
});

app.get('', (req, res) => {
  res.status(200).send('Hello World');
});

app.listen(port, () => {
  console.log('Running at http://localhost:' + port);
});
