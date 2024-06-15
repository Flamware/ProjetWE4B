const { client } = require('../database'); // Importing the 'client' property from database.js
const path = require('path');

exports.getAllCourses = async (req, res) => {
  // fetch user id from session
  const userId = req.session.userId;
  try {
    const query = 'SELECT * FROM courses';
    const result = await client.query(query);
    const courses = result.rows;

    res.status(200).json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
