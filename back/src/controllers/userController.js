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


  exports.createUser = async (req, res) => {
    console.log('Creating user')
    const {email, first_name, last_name, auth0_user_id} = req.body;  // Include the Auth0 user ID
    console.log('Request body:', req.body);

    try {
      const insertQuery = `
        INSERT INTO users (auth0_user_id, email, first_name, last_name, created_at, updated_at)
        VALUES ($1, $2, $3, $4, current_timestamp, current_timestamp);`;

      await client.query(insertQuery, [auth0_user_id, email, first_name, last_name || '']); // Set last_name to empty string if missing

      res.status(200).json({message: 'User created successfully'});
    } catch (error) {
      console.error('Error creating user:', error);

      // Handle specific errors (optional)
      if (error.code === '23505') { // Handle potential unique constraint violation (e.g., duplicate email or id)
        res.status(409).json({error: 'User already exists'});
      } else {
        res.status(500).json({error: 'Internal server error'});
      }
    }
  };

exports.userLogged = async (req, res) => {
  // check the sub property in the request body to get the Auth0 user ID
  const token = req.body.sub;
  const payload = jwt.decode(token);
  const authId = payload.sub;
  const email = payload.email;

  console.log('Request body:', authId);
  // check if the user exists in the database
  const query = 'SELECT * FROM users WHERE auth0_user_id = $1';
  const result = await client.query(query, [authId]); // Pass authId as an array

  // if the user does not exist, create a new user
  if (result.rows.length === 0) {
    const insertQuery = 'INSERT INTO users (auth0_user_id, email) VALUES ($1, $2)';
    await client.query(insertQuery, [authId, email]); // Pass authId and email as a single array
    res.status(200).json({ existing: false }); // Respond with a UserResponse object
  } else {
    res.status(200).json({ existing: true }); // Respond with a UserResponse object
  }
};
// Example route to handle updating user information
  exports.updateUser = async (req, res) => {
    const {email, first_name, last_name} = req.body;
    console.log('Request body:', req.body);
    try {
      const updateQuery = `
        UPDATE users
        SET first_name = $2,
            last_name  = $3,
            updated_at = current_timestamp
        WHERE email = $1;`;

      await client.query(updateQuery, [email, first_name, last_name]);

      res.status(200).json({message: 'User information updated successfully'});
    } catch (error) {
      console.error('Error updating user information:', error);
      res.status(500).json({error: 'Internal server error'});
    }
  };

  exports.getAllUsers = async (req, res) => {
    try {
      const query = `
        SELECT *
        FROM users;`;

      const result = await client.query
      (query);
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error getting all users:', error);
      res.status(500).json({error: 'Internal server error'});
    }
  };

  exports.setUserRole = async (req, res) => {
    try {
      const payload = jwt.decode(token);
      const authId = payload.sub;
      console.log('authId:', authId);
      console.log('role to update:', req.body.role);

      // Prepared statement with parameterized queries
      const updateQuery = 'UPDATE users SET role = $1 WHERE id = $2;';
      const values = [req.body.role, authId];

      await client.query(updateQuery, values);

      res.status(200).json({ message: 'User role updated successfully' });
    } catch (error) {
      console.error('Error updating user role:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
