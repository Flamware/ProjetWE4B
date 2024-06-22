const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { createCourse, updateCourseMedia, getCoursesByUserId, getAllCoursesFromUser, deleteCourse, uploadCourseMedia } = require("../controllers/userCoursesController");
const { upload } = require('../middleware/upload');

// Logged User Courses Routes
router.get('/coursesByUserId/:userId', verifyToken, getCoursesByUserId);
router.get('/allCoursesFromUser', verifyToken, getAllCoursesFromUser);

router.post('/createCourse', verifyToken, createCourse);
router.post('/uploadFile/:email/:courseId', upload.single('file'), uploadCourseMedia);
router.put('/updateCourse/:courseId', verifyToken, updateCourseMedia); // Route for updating course media

router.delete('/deleteCourse/:courseId', verifyToken, deleteCourse);

module.exports = router;
