const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/submit-comment', verifyToken, commentController.submitComment);
router.get('/load-comments', commentController.loadComments);
router.delete('/delete-comment/:commentId', verifyToken, commentController.deleteComment);

module.exports = router;
