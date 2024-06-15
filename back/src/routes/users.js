const express = require('express');
const router = express.Router();
const { userExists, getAllUsers} = require('../controllers/userController');
const checkJwt = require('../middleware/authMiddleware');

console.log(checkJwt);
console.log(userExists);
console.log(getAllUsers);

router.get('/user-exist', checkJwt, userExists);
router.get('/getAllUsers', getAllUsers);

module.exports = router;
