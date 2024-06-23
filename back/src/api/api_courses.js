const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/coursesController');
const {verifyToken} = require('../middleware/authMiddleware');

router.get('/getAllCourses', verifyToken, coursesController.getAllCourses);
router.get('/getCourseById/:id', verifyToken, coursesController.getCourseById);

module.exports = router;
