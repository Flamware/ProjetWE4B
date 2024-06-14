const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/account-info', verifyToken, userController.getAccountInfo);
router.post('/set-username', verifyToken, userController.setUsername);
router.post('/set-profile-picture', verifyToken, userController.setProfilePicture);
router.post('/update-info', verifyToken, userController.updatePassword);

module.exports = router;
