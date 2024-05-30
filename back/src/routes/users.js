const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/account-info', verifyToken, userController.getAccountInfo);
router.post('/login', userController.login);
router.get('/get-all-users', userController.getAllUsers);
module.exports = router;
