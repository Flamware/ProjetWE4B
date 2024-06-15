// server.js
const express = require('express');
const jwtCheck = require('./middleware/authMiddleware');

const app = express();
const port = process.env.PORT || 8080;



// Example endpoint that requires authentication
app.get('/authorized', function (req, res) {
  res.send('Secured Resource');
});

app.listen(port, () => {
  console.log('Running on port ', port);
});
