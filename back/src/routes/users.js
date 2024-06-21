const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
// Middleware multer pour gérer les fichiers
const upload = require('../middleware/upload');
const {
  getAllUsers, createUser, userLogged, setUserRole, login, register, getAccountInfo,
  updateAccount, testToken
} = require('../controllers/userController');


router.post('/user-logged-in', verifyToken, userLogged);
router.get('/getAllUsers', verifyToken, getAllUsers); // Added verifyToken for consistency
router.post('/create-user', verifyToken, createUser);
router.put('/set-role', verifyToken, setUserRole);
router.post('/login', login);
router.post('/register', upload.single('profilePicture'), register);
router.get('/getAccountInfo', verifyToken, getAccountInfo); // Assuming session-based for profile
router.put('/updateAccount', verifyToken, updateAccount); // Assuming session-based for profile
router.get('/test', verifyToken, testToken);

module.exports = router;
