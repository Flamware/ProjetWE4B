const express = require("express");
const router = express.Router();
const messagesController = require("../controllers/messagesController");
const { verifyToken } = require('../middleware/authMiddleware');

// Créer un nouveau message
router.post("/send", verifyToken, messagesController.sendMessage);

// Récupérer tous les messages d'un expéditeur vers un destinataire
router.get("/messages/:receiverId", verifyToken, messagesController.getMessages);

// Récupérer tous les messages d'un expéditeur
router.get("/messagesP", verifyToken, messagesController.getMessagesBySender);

// Récupérer tous les messages d'un expéditeur
router.get("/messagesG/:receiverId", verifyToken, messagesController.getMessagesByReceiver);

// Supprimer un message par son ID
router.delete("/delete/:messageId", messagesController.deleteMessage);

// Rechercher des utilisateurs
router.get("/searchUsers", messagesController.searchUsers);

// Ajouter un contact
router.post("/addContact/:contactId", verifyToken, messagesController.addContact);

// Fetch les contacts
router.get("/contacts", verifyToken, messagesController.getContacts);

router.get("/getUser/:id", messagesController.getContactById);

module.exports = router;
