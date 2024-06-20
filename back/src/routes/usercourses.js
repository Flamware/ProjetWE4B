const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {createCourse, getCourseById, rateCourse} = require("../controllers/coursesController");
const {getCoursesByUserId} = require("../controllers/userCoursesController");

router.get('/mes-cours/:userId', verifyToken, getCoursesByUserId)
router.post('/create-course', verifyToken, createCourse)
router.get('/getCourseById', verifyToken, getCourseById);
router.post('/rateCourse', verifyToken, rateCourse);

module.exports = router;
