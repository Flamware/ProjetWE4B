const { client } = require('../config/database');


const deleteContact = async (req, res) => {
    const userId = req.userId; // Assuming req.userId is the ID of the user making the request
    const contactId = req.params.contactId;
  
    try {
      const query = `
        DELETE FROM contacts
        WHERE user_id = $1 AND contact_id = $2
      `;
      const params = [userId, contactId];
      await client.query(query, params);
  
      res.status(200).json({ message: 'Contact deleted successfully' });
    } catch (error) {
      console.error("Error deleting contact:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
};
  
const deleteConversation = async (req, res) => {
    const userId = req.userId; // Assuming req.userId is the ID of the user making the request
    const contactId = req.params.contactId;
  
    try {
      const query = `
        DELETE FROM messages
        WHERE (sender_id = $1 AND receiver_id = $2) 
        OR (sender_id = $2 AND receiver_id = $1)
      `;
      const params = [userId, contactId];
      await client.query(query, params);
  
      res.status(200).json({ message: 'Conversation marked as deleted successfully' });
    } catch (error) {
      console.error("Error marking conversation as deleted:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  module.exports = {
    deleteContact,
    deleteConversation,
  };
  