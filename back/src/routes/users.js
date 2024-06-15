const express = require('express');
const router = express.Router();
const { userExists, getAllUsers} = require('../controllers/userController');
const checkJwt = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');

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

router.get('/user-exists', checkJwt, userExists); // JWT verification applied here
router.get('/getAllUsers', getAllUsers); // No JWT verification

module.exports = router;
