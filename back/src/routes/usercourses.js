const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {createCourse, getCoursesByUserId, getAllCoursesFromUser, deleteCourse} = require("../controllers/userCoursesController");

// Logged User Courses Routes
router.get('/coursesByUserId/:userId', verifyToken, getCoursesByUserId);
router.get('/allCoursesFromUser', verifyToken, getAllCoursesFromUser)
router.post('/createCourse', verifyToken, createCourse);
router.delete('/deleteCourse/:courseId', verifyToken, deleteCourse);

module.exports = router;
