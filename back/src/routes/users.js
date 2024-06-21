const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');
const {
  getAllUsers, createUser, userLogged, setUserRole, login, register, getAccountInfo,
  updateAccount, testToken, uploadProfilePicture  // Add uploadProfilePicture to imports
} = require('../controllers/userController');
const { getUserProfilePictureUrl } = require('../controllers/userController');

router.post('/user-logged-in', verifyToken, userLogged);
router.get('/getAllUsers', verifyToken, getAllUsers);
router.post('/create-user', verifyToken, createUser);
router.put('/set-role', verifyToken, setUserRole);
router.post('/login', login);
router.post('/register',  register); // Handle file upload in register route
router.get('/getAccountInfo', verifyToken, getAccountInfo);
router.put('/updateAccount', verifyToken, updateAccount);
router.get('/test', verifyToken, testToken);

// Route for uploading profile picture
router.post('/upload/:email', upload.single('profilePicture'), uploadProfilePicture);

router.get('/users/profile-picture', verifyToken, getUserProfilePictureUrl);

module.exports = router;
