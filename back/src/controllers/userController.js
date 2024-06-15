const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const { client } = require('../database'); // Importing the 'client' property from database.js

// ... rest of your code
exports.getAccountInfo = async (req, res) => {
  const username = req.session.username; // Assuming username is stored in the session
  try {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await client.query(query, [username]);
    const user = result.rows[0];
    if (user && user.profile_picture) {
      user.profile_picture = `/img/profile/${user.profile_picture}`;
    }

    console.log('User:', user);
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user information:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.updateAccount = async (req, res) => {
  const { email, first_name, last_name } = req.body;
  const username = req.session.username; // Assuming username is stored in the session

  try {
    const query = 'UPDATE users SET email = $1, first_name = $2, last_name = $3, updated_at = current_timestamp WHERE email = $4';
    await client.query(query, [email, first_name, last_name, username]);

    res.status(200).json({ success: 'User information updated successfully' });
  } catch (error) {
    console.error('Error updating user information:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateProfilePicture = async (req, res) => {
  const { profile_picture } = req.body;
  const username = req.session.username; // Assuming username is stored in the session

  // retreive the profile picture url from db
  const query = 'SELECT profile_picture FROM users WHERE username = $1';
  const result = await client.query(query, [username]);
  // if the user has a profile picture, delete it from img/profile
  if (result.rows[0].profile_picture) {
    const oldProfilePicture = path.join(__dirname, `../public/img/profile/${result.rows[0].profile_picture}`);
    fs.unlink(oldProfilePicture, (err) => {
      if (err) {
        console.error('Error deleting profile picture:', err);
      }
    });
  }

  // save the new profile picture in img/profile and update the db with only the filename
  const profilePictureFilename = `${username}-${Date.now()}.png`;
  const newProfilePicture = path.join(__dirname, `../public/img/profile/${profilePictureFilename}`);
  const base64Data = profile_picture.replace(/^data:image\/png;base64,/, '');
  fs.writeFile(newProfilePicture, base64Data, 'base64', async (err) => {
    if (err) {
      console.error('Error saving profile picture:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const updateQuery = 'UPDATE users SET profile_picture = $1 WHERE username = $2';
    await client.query(updateQuery, [profilePictureFilename, username]);
    res.status(200).json({ success: 'Profile picture updated successfully' });
  });
};
// Auth0 configuration (assuming you resolve the Angular issue)
  const auth0Config = {
    domain: process.env.AUTH0_DOMAIN,
    clientId: process.env.AUTH0_CLIENT_ID,
    redirectUri: 'http://localhost:3000/callback', // Adjust callback URL as per your setup
  };


// route user-exists
  exports.userExists = async (req, res) => {
    console.log('Checking if user exists');
  const { email } = req.query; // Access email from query parameter

    try {
      const query = `
      SELECT * FROM users WHERE email = $1;`;

      const result = await client.query(query, [email]);
      res.status(200).json({ exists: result.rows.length > 0 }); // Check if rows exist
    } catch (error) {
      console.error('Error checking user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

exports.createUser = async (req, res) => {
    const { email, first_name, last_name } = req.body;
    console.log('Request body:', req.body);

    try {
      const insertQuery = `
      INSERT INTO users (email, first_name, last_name, created_at, updated_at)
      VALUES ($1, $2, $3, current_timestamp, current_timestamp);`;

      await client.query(insertQuery, [email, first_name, last_name || '']); // Set last_name to empty string if missing

      res.status(200).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error creating user:', error);

      // Handle specific errors (optional)
      if (error.code === '23502') { // Handle potential unique constraint violation (e.g., duplicate email)
        res.status(409).json({ error: 'Email already exists' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  };

// Example route to handle updating user information
exports.updateUser = async (req, res) => {
  const { email, first_name, last_name } = req.body;
    console.log('Request body:', req.body);
    try {
      const updateQuery = `
      UPDATE users
      SET first_name = $2, last_name = $3, updated_at = current_timestamp
      WHERE email = $1;`;

      await client.query(updateQuery, [email, first_name, last_name]);

      res.status(200).json({ message: 'User information updated successfully' });
    } catch (error) {
      console.error('Error updating user information:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

exports.getAllUsers = async (req, res) => {
    try {
      const query = `
      SELECT * FROM users;`;

      const result = await client.query
      (query);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error getting all users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
};


