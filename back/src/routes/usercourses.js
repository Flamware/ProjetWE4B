const express = require('express');
const router = express.Router();
const userCoursesController = require('../controllers/userCoursesController');

router.get('/mes-cours/:userId', userCoursesController.getCoursesByUserId);
router.post('/create-course', userCoursesController.createCourse);

module.exports = router;
