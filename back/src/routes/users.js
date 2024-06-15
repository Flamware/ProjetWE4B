// users.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const jwtCheck = require('../jwCheck'); // Import jwtCheck
const { userExists, getAllUsers, createUser} = require('../controllers/userController');

router.get('/user-exists', jwtCheck, userExists); // JWT verification applied here
router.get('/getAllUsers', getAllUsers); // JWT verification applied here
router.post('/create-user', jwtCheck, createUser); // JWT verification applied here

module.exports = router;
