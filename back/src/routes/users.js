// users.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const jwtCheck = require('../jwCheck'); // Import jwtCheck
const { userExists, getAllUsers} = require('../controllers/userController');

router.use((req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log('Authorization Header:', authHeader);

  if (authHeader) {
    const token = authHeader.split(' ')[1];  // Extract the token from the header
    const decodedToken = jwt.decode(token, { complete: true });
    console.log('Decoded JWT Token:', decodedToken);
  }

  next();
});

router.get('/user-exists', jwtCheck, userExists); // JWT verification applied here
router.get('/getAllUsers', getAllUsers); // JWT verification applied here

module.exports = router;
