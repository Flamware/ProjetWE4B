const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { client } = require('../config/database');
const fs = require('fs');
const path = require('path');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await client.query(query, [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    req.session.userId = user.id;

    req.session.save(err => {
      if (err) {
        return res.status(500).json({ error: 'Internal server error' });
      }

      const token = jwt.sign({ userId: user.id }, "your_secret_key", { expiresIn: '30d' });
      res.status(200).json({ message: 'Logged in successfully', token });
    });

  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.testToken = async (req, res) => {
  console.log('session', req.session);
  console.log('Testing token', req.body);
  res.status(200).json({ message: 'Token is valid' });
};

exports.register = async (req, res) => {
  const { username, email, password, nom, prenom, role } = req.body;

  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await client.query(query, [email]);

    if (result.rows.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertQuery = `
      INSERT INTO users (username, first_name, last_name, email, password, role)
      VALUES ($1, $2, $3, $4, $5, $6)`;
    await client.query(insertQuery, [username, prenom, nom, email, hashedPassword, role]);

    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAccountInfo = async (req, res) => {
  let username;

  // Check if username is provided in request body, otherwise fallback to req.id
  if (req.body.username) {
    username = req.body.username;
  } else if (req.userId) {
    username = req.userId; // Assuming req.id holds the user's ID
  } else {
    return res.status(400).json({ error: 'Username or user ID not provided' });
  }

  try {
    // Query to fetch user information based on username or id
    let query;
    let queryParams;

    // Check if username is a number (assuming it's an id)
    if (!isNaN(username)) {
      query = 'SELECT * FROM users WHERE id = $1';
      queryParams = [username];
    } else {
      //Attention si il y a plusierus utilisateurs avec le même nom
      query = 'SELECT * FROM users WHERE username = $1';
      queryParams = [username];
    }

    const result = await client.query(query, queryParams);
    const user = result.rows[0];

    // If user not found, return 404 error
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Modify profile_picture path if present
    if (user.profile_picture) {
      user.profile_picture = `/img/profile/${user.profile_picture}`;
    }

    // Return formatted user information in the response
    res.status(200).json({
      username: user.username,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      created_at: user.created_at,
      profile_picture: user.profile_picture,
    });

  } catch (error) {
    console.error('Error fetching user information:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.updateAccount = async (req, res) => {
  const data = req.body; // Remove .params here

  const { email, firstname, lastname, username, bio, role } = data;

  try {
    const query = `
      UPDATE users
      SET first_name = $1, last_name = $2, username = $3, bio = $4, role = $5, updated_at = current_timestamp
      WHERE id = $6`; // Corrected to $6 for the ID placeholder

    await client.query(query, [firstname, lastname, username, bio, role, req.userId]);

    res.status(200).json(data);
  } catch (error) {
    console.error('Error updating user information:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateProfilePicture = async (req, res) => {
  const { profile_picture } = req.body;
  const username = req.session.username;

  try {
    const query = 'SELECT profile_picture FROM users WHERE username = $1';
    const result = await client.query(query, [username]);

    if (result.rows[0].profile_picture) {
      const oldProfilePicture = path.join(__dirname, `../public/img/profile/${result.rows[0].profile_picture}`);
      fs.unlink(oldProfilePicture, (err) => {
        if (err) {
          console.error('Error deleting profile picture:', err);
        }
      });
    }

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
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.createUser = async (req, res) => {
  const { email, first_name, last_name, auth0_user_id } = req.body;

  try {
    const insertQuery = `
      INSERT INTO users (auth0_user_id, email, first_name, last_name, created_at, updated_at)
      VALUES ($1, $2, $3, $4, current_timestamp, current_timestamp)`;

    await client.query(insertQuery, [auth0_user_id, email, first_name, last_name || '']);

    res.status(200).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);

    if (error.code === '23505') {
      res.status(409).json({ error: 'User already exists' });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
};

exports.userLogged = async (req, res) => {
  const token = req.body.sub;
  const payload = jwt.decode(token);
  const authId = payload.sub;
  const email = payload.email;

  try {
    const query = 'SELECT * FROM users WHERE auth0_user_id = $1';
    const result = await client.query(query, [authId]);

    if (result.rows.length === 0) {
      const insertQuery = 'INSERT INTO users (auth0_user_id, email) VALUES ($1, $2)';
      await client.query(insertQuery, [authId, email]);
      res.status(200).json({ existing: false });
    } else {
      res.status(200).json({ existing: true });
    }
  } catch (error) {
    console.error('Error checking user login:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateUser = async (req, res) => {
  const { email, first_name, last_name } = req.body;

  try {
    const updateQuery = `
      UPDATE users
      SET first_name = $2,
          last_name  = $3,
          updated_at = current_timestamp
      WHERE email = $1`;

    await client.query(updateQuery, [email, first_name, last_name]);

    res.status(200).json({ message: 'User information updated successfully' });
  } catch (error) {
    console.error('Error updating user information:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const query = 'SELECT * FROM users';
    const result = await client.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error getting all users:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.setUserRole = async (req, res) => {
  try {
    const authId = req.user.sub;
    const email = req.user.email;
    const role = req.body.role;

    const updateQuery = 'UPDATE users SET role = $1 WHERE id = $2';
    const values = [role, authId];

    await client.query(updateQuery, values);

    res.status(200).json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
