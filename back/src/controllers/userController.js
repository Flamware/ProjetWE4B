const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const { client } = require('../database'); // Importing the 'client' property from database.js

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Request body:', req.body);

  try {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await client.query(query, [email]);

    const user = result.rows[0];
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Check if the password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Store the user's email, username and user ID in the session
    req.session.email = email;
    req.session.username = user.username; // Assuming the user object has a username property
    req.session.userId = user.id; // Assuming the user object has an id property

    res.status(200).json({ message: 'Logged in successfully' });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.register = async (req, res) => {
  console.log('Registering user', req.body);
  const { username, email, password, nom, prenom, role } = req.body;
  try {
    // Check if a user with the same username or email already exists
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await client.query(query, [ email]);

    if (result.rows.length > 0) {
      return res.status(409).json({ error: 'User with this username or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store the new user's data in the database
    const insertQuery = 'INSERT INTO users (username, first_name, last_name, email, password, role) VALUES ($1, $2, $3, $4, $5, $6)';
    await client.query(insertQuery, [username, prenom, nom, email,  hashedPassword, role]);

    res.status(200).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

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

  console.log('ID :', authId);
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
    // Extract user information from req.user
    const authId = req.user.sub; // Assuming sub contains the Auth0 user ID
    const email = req.user.email;
    console.log('User ID:', authId);
    console.log('User email:', email);
    // Extract role from request body
    const role = req.body.role;
    console.log('Role:', role);


    // Example of updating user role in database
    const updateQuery = 'UPDATE users SET role = $1 WHERE id = $2;';
    const values = [role, authId];

    await client.query(updateQuery, values);

    res.status(200).json({ message: 'User role updated successfully' });
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
