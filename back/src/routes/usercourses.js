const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { createCourse, getCoursesByUserId, getAllCoursesFromUser, deleteCourse } = require("../controllers/userCoursesController");
const { upload } = require('../middleware/upload');
const multer = require("multer");

// Logged User Courses Routes
router.get('/coursesByUserId/:userId', verifyToken, getCoursesByUserId);
router.get('/allCoursesFromUser', verifyToken, getAllCoursesFromUser);

router.post('/createCourse', verifyToken, createCourse);
router.post('/uploadFile/:email', upload.single('file'), (req, res) => {
    const file = req.file;
    console.log('Uploaded File:', file);
    // Logique de traitement du fichier ici
    res.status(201).json({ message: 'File uploaded successfully', file });
});

router.delete('/deleteCourse/:courseId', verifyToken, deleteCourse);

module.exports = router;
