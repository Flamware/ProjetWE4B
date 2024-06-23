const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { getAllCourses, getCourseById, rateCourse } = require("../controllers/coursesController");

// General Courses Routes

router.get('/getAllCourses', getAllCourses);
router.get('/getCourseById/:id', getCourseById);
router.post('/rateCourse', rateCourse);

module.exports = router;
