// users.js
const express = require('express');
const router = express.Router();
const jwtCheck = require('../middleware/jwCheck'); // Import jwtCheck
const { getAllUsers, createUser, userLogged, setUserRole, login, register} = require('../controllers/userController');

router.post('/user-logged-in', jwtCheck, userLogged); // JWT verification applied here
router.get('/getAllUsers', getAllUsers); // JWT verification applied here
router.post('/create-user', jwtCheck, createUser); // JWT verification applied here
router.put('/set-role', jwtCheck, setUserRole); // JWT verification applied here
router.post('/login', login);
router.post('/register', register);
module.exports = router;
