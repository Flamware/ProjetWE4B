const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { createCourse, getCoursesByUserId, getAllCoursesFromUser, deleteCourse } = require("../controllers/userCoursesController");
const { upload } = require('../middleware/upload');
const multer = require("multer");

// Logged User Courses Routes
router.get('/coursesByUserId/:userId', verifyToken, getCoursesByUserId);
router.get('/allCoursesFromUser', verifyToken, getAllCoursesFromUser);

// Example of using multer in a route
router.post('/createCourse', verifyToken, multer, createCourse);

router.delete('/deleteCourse/:courseId', verifyToken, deleteCourse);

module.exports = router;
