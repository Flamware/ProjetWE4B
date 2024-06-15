const express = require('express');
const router = express.Router();
const coursesController = require('../controllers/coursesController');
const verifyToken = require('../jwCheck');

router.get('/getAllCourses', verifyToken, coursesController.getAllCourses);

module.exports = router;
