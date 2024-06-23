// server/routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');
const { verifyToken } = require('../middleware/authMiddleware');

// Route pour supprimer un contact
router.delete('/:contactId', verifyToken, contactController.deleteContact);

// Route pour supprimer une conversation
router.delete('/:contactId/conversations', verifyToken, contactController.deleteConversation);

module.exports = router;
