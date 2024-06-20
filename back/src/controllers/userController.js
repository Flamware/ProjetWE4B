const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { client } = require('../config/database');
const fs = require('fs');

// Login endpoint
exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Request body:', req.body);

  try {
    // Check if user with given email exists
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await client.query(query, [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Verify password
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Store user data in session
    req.session.email = email;
    req.session.username = user.username;
    req.session.userId = user.id;
    req.session.save();

    console.log('Session:', req.session);

    res.status(200).json({ message: 'Logged in successfully' });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Register new user endpoint
exports.register = async (req, res) => {
  console.log('Registering user', req.body);
  const { username, email, password, nom, prenom, role } = req.body;

  try {
    // Check if user with same email exists
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await client.query(query, [email]);

    if (result.rows.length > 0) {
      return res.status(409).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store new user data
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

// Get user account information endpoint
exports.getAccountInfo = async (req, res) => {
  const username = req.body.params.username;

  try {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await client.query(query, [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.profile_picture) {
      user.profile_picture = `/img/profile/${user.profile_picture}`;
    }

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

// Update user account information endpoint
exports.updateAccount = async (req, res) => {
  const data = req.body.params;
  const { email, firstname, lastname, username, bio, role } = data;

  try {
    const query = `
      UPDATE users
      SET first_name = $1, last_name = $2, username = $3, bio = $4, role = $5, updated_at = current_timestamp
      WHERE email = $6`;
    await client.query(query, [firstname, lastname, username, bio, role, email]);

    res.status(200).json(data);
  } catch (error) {
    console.error('Error updating user information:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update user profile picture endpoint
exports.updateProfilePicture = async (req, res) => {
  const { profile_picture } = req.body;
  const username = req.session.username;

  try {
    // Retrieve current profile picture URL from DB
    const query = 'SELECT profile_picture FROM users WHERE username = $1';
    const result = await client.query(query, [username]);

    // Delete old profile picture if exists
    if (result.rows[0].profile_picture) {
      const oldProfilePicture = path.join(__dirname, `../public/img/profile/${result.rows[0].profile_picture}`);
      fs.unlink(oldProfilePicture, (err) => {
        if (err) {
          console.error('Error deleting profile picture:', err);
        }
      });
    }

    // Save new profile picture in filesystem
    const profilePictureFilename = `${username}-${Date.now()}.png`;
    const newProfilePicture = path.join(__dirname, `../public/img/profile/${profilePictureFilename}`);
    const base64Data = profile_picture.replace(/^data:image\/png;base64,/, '');
    fs.writeFile(newProfilePicture, base64Data, 'base64', async (err) => {
      if (err) {
        console.error('Error saving profile picture:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      // Update profile picture filename in DB
      const updateQuery = 'UPDATE users SET profile_picture = $1 WHERE username = $2';
      await client.query(updateQuery, [profilePictureFilename, username]);

      res.status(200).json({ success: 'Profile picture updated successfully' });
    });
  } catch (error) {
    console.error('Error updating profile picture:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create user endpoint
exports.createUser = async (req, res) => {
  console.log('Creating user', req.body);
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

// Check if user is logged in (Auth0) endpoint
exports.userLogged = async (req, res) => {
  const token = req.body.sub;
  const payload = jwt.decode(token);
  const authId = payload.sub;
  const email = payload.email;

  console.log('Auth0 ID:', authId);

  try {
    // Check if user exists in database
    const query = 'SELECT * FROM users WHERE auth0_user_id = $1';
    const result = await client.query(query, [authId]);

    // If user doesn't exist, create new user
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

// Update user information endpoint
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

// Get all users endpoint
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

// Set user role endpoint
exports.setUserRole = async (req, res) => {
  try {
    const authId = req.user.sub;
    const email = req.user.email;
    const role = req.body.role;

    console.log('User ID:', authId);
    console.log('User email:', email);
    console.log('Role:', role);

    // Update user role in database
    const updateQuery = 'UPDATE users SET role = $1 WHERE id = $2';
    const values = [role, authId];

    await client.query(updateQuery, values);

    res.status(200).json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};