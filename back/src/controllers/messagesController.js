const { client } = require("../config/database");

// Créer un nouveau message
exports.sendMessage = async (req, res) => {
  const {receiver_id, content } = req.body;

  sender_id = req.userId;

  if (!receiver_id || !content) {
    return res.status(400).json({ error: "Sender ID, Receiver ID and Content are required" });
  }

  try {
    const query = `
      INSERT INTO messages (sender_id, receiver_id, content, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *
    `;

    const params = [sender_id, receiver_id, content];
    const result = await client.query(query, params);

    res.status(201).json({ message: "Message created successfully", data: result.rows[0] });
  } catch (error) {
    console.error("Error creating message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Récupérer tous les messages d'un expéditeur vers un destinataire
exports.getMessages = async (req, res) => {
  const { receiverId } = req.params;
  const senderId = req.userId;

  try {
    const query = `
      SELECT * FROM messages
      WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)
      ORDER BY created_at ASC
    `;
    const result = await client.query(query, [senderId, receiverId]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Récupérer tous les messages d'un expéditeur
exports.getMessagesBySender = async (req, res) => {

  const senderId = req.userId;

  try {
    const query = `
      SELECT * FROM messages
      WHERE sender_id = $1
      ORDER BY created_at ASC
    `;
    const result = await client.query(query, [senderId]);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Supprimer un message par son ID
exports.deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  try {
    const query = "DELETE FROM messages WHERE id = $1";
    const result = await client.query(query, [messageId]);

    if (result.rowCount === 1) {
      res.status(200).json({ message: "Message deleted successfully" });
    } else {
      res.status(404).json({ error: "Message not found" });
    }
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Rechercher des utilisateurs
exports.searchUsers = async (req, res) => {
    const query = req.query.q;
  
    try {
      const searchQuery = `
        SELECT * FROM users
        WHERE 
        LOWER(first_name) LIKE LOWER($1) OR
        LOWER(last_name) LIKE LOWER($1)
      `;
      const result = await client.query(searchQuery, [`%${query}%`]);
  
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  // Ajouter un contact
  exports.addContact = async (req, res) => {
    const userId = req.userId;
    const { contactId } = req.body;
  
    try {
      const query = `
        INSERT INTO contacts (user_id, contact_id)
        VALUES ($1, $2)
        RETURNING *
      `;
      const params = [userId, contactId];
      const result = await client.query(query, params);
  
      res.status(201).json({ message: "Contact added successfully", data: result.rows[0] });
    } catch (error) {
      console.error("Error adding contact:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };

  // Récupérer les contacts d'un utilisateur
exports.getContacts = async (req, res) => {
    const userId = req.userId;
  
    try {
      const query = `
        SELECT users.id, users.first_name, users.last_name
        FROM contacts
        INNER JOIN users ON contacts.contact_id = users.id
        WHERE contacts.user_id = $1
      `;
      const result = await client.query(query, [userId]);
  
      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };