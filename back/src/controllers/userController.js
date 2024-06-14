const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { client } = require('../database'); // Importing the 'client' property from database.js
const path = require('path');
const { client } = require('../database'); // Assuming your database client is correctly configured

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

}
