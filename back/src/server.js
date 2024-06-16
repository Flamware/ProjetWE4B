// server.js
const express = require('express');
const app = express();
const jwtCheck = require('./jwCheck'); // Import jwtCheck
const userRoutes = require('./routes/users'); // Import user routes
const client = require('./database');
const port = process.env.PORT || 3000;
const session = require('express-session');

// cors
const cors = require('cors');
app.use(cors());
app.use(express.json());

app.use(session({
  secret: 'your-secret-key', // Replace with your own secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure to true if you are using https
}));

client.connectDatabase().catch(err => {
  console.error('Error connecting to the database:', err);
  process.exit(1);
})

app.use(userRoutes); // Use user routes

app.get('/authorized', jwtCheck, function (req, res) {
  res.send('Secured Resource');
});

app.listen(port);

console.log('Running on http://localhost:' + port);
