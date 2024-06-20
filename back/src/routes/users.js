const express = require('express');
const router = express.Router();
const { verifyToken, verifySession } = require('../middleware/authMiddleware');
const {
  getAllUsers, createUser, userLogged, setUserRole, login, register, getAccountInfo,
  updateAccount, testToken
} = require('../controllers/userController');

router.post('/user-logged-in', verifyToken, userLogged);
router.get('/getAllUsers', verifyToken, getAllUsers); // Added verifyToken for consistency
router.post('/create-user', verifyToken, createUser);
router.put('/set-role', verifyToken, setUserRole);
router.post('/login', login);
router.post('/register', register);
router.post('/getAccountInfo', verifySession, getAccountInfo); // Assuming session-based for profile
router.post('/updateAccount', verifySession, updateAccount); // Assuming session-based for profile
router.get('/test', verifyToken, testToken);

module.exports = router;
