// users.js
const express = require('express');
const router = express.Router();
const jwtCheck = require('../jwCheck'); // Import jwtCheck
const { getAllUsers, createUser, userLogged} = require('../controllers/userController');

router.post('/user-logged-in', jwtCheck, userLogged); // JWT verification applied here
router.get('/getAllUsers', getAllUsers); // JWT verification applied here
router.post('/create-user', jwtCheck, createUser); // JWT verification applied here

module.exports = router;
