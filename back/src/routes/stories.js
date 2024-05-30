const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/load-stories', storyController.loadStories);
router.delete('/delete-story/:storyId', verifyToken, storyController.deleteStory);

module.exports = router;
