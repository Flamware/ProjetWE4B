const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { client } = require('../database'); // Importing the 'client' property from database.js
const path = require('path');
exports.register = async (req, res) => {
    const { username, password, email, confirmPassword } = req.body; // Added 'email'
    if (!username) {
        res.status(400).json({ error: 'Username is required' });
        console.log("Username is required");
        return;
    }
    if (!password) {
        res.status(400).json({ error: 'Password is required' });
        console.log("Password is required");
        return;
    }
    if (password !== confirmPassword) {
        res.status(400).json({ error: 'Passwords do not match' });
        return;
    }
    try {
        const { rows } = await client.query('SELECT * FROM users WHERE username = $1', [username]);
        if (rows.length > 0) {
            res.status(200).json({ redirect: '' });
        } else {
            await client.query('INSERT INTO users (username, password, email) VALUES ($1, $2, $3)', [username, password, email]);
            res.status(201).json({ redirect: '/login' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error inserting the user into the database');
    }
}

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const { rows } = await client.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
        if (rows.length > 0) {
            req.session.username = username; // Set the username in the session
            const token = jwt.sign({ userId: rows[0].id, username }, '246887855145@Clundi', { expiresIn: '1h' });
            console.log('Generated JWT token:', token);
            console.log('username: ' + req.session.username);
            res.status(200).json({ token });
        } else {
            res.status(400).json({ error: 'Invalid username or password' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error during login');
    }
};

exports.getAccountInfo = async (req, res) => {
    const username = req.session.username;
    //return user from database
    const query = 'SELECT * FROM users WHERE username = $1';
    client.query(query, [username], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error fetching user information');
            return;
        }
        const user = results.rows[0];
        //change url to the profile picture
        if (user.profile_picture) {
            user.profile_picture = `/img/profile/${user.profile_picture}`;
        }
        console.log('User:', user);
        res.status(200).json({ user });
    });
}

exports.updateAccount = async (req, res) => {
    const { email, first_name, last_name } = req.body;
    const username = req.session.username;

    try {
        await client.query('UPDATE users SET email = $1, first_name = $2, last_name = $3 WHERE username = $4', [email, first_name, last_name, username]);
        res.status(200).json({ success: 'User information updated successfully' });
    } catch (error) {
        console.error('Error updating user information:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
