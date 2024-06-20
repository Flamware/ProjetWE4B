const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {createCourse} = require("../controllers/coursesController");
const {getCoursesByUserId} = require("../controllers/userCoursesController");

router.get('/mes-cours/:userId', verifyToken, getCoursesByUserId)
router.post('/create-course', verifyToken, createCourse)

module.exports = router;
