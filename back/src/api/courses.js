const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/coursesController');
const {verifyToken} = require('../middleware/authMiddleware');

router.get('/getAllCourses', verifyToken, coursesController.getAllCourses);
router.get('/getCourseById/:id', verifyToken, coursesController.getCourseById);
router.post('/createCourse', verifyToken, coursesController.createCourse);
router.delete('/delete-course/:id', verifyToken, coursesController.deleteCourse);
router.post('/rateCourse', verifyToken, coursesController.rateCourse);
router.get('/getAllCourseForHome', coursesController.getAllCourseForHome);
module.exports = router;
