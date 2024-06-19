const express = require('express');
const router = express.Router();
const userCoursesController = require('../controllers/userCoursesController');
const verifyToken = require('../middleware/jwCheck');

router.get('/mes-cours/:userId', verifyToken, userCoursesController.getCoursesByUserId);
router.post('/create-course', verifyToken, userCoursesController.createCourse);

module.exports = router;
