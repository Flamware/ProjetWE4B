const { client } = require('../config/database');

// Get courses by user ID endpoint
const getCoursesByUserId = async (req, res) => {
  const userId = req.session.userId; // Retrieve user ID from session
  try {
    const query = `
      SELECT s.*
      FROM userskills us
      JOIN skills s ON us.skill_id = s.id
      WHERE us.user_id = $1
    `;
    const result = await client.query(query, [userId]);
    const courses = result.rows;

    if (courses.length === 0) {
      return res.status(404).json({ error: 'No courses found for this user' });
    }

    res.status(200).json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Create new course endpoint
const createCourse = async (req, res) => {
  const { name, description, theme } = req.body;
  console.log('req', req.body);
  const userId = req.userId; // Retrieve user ID from session

  try {
    if (!userId) {
      return res.status(401).json({ error: 'User ID not found in session' });
    }

    // Insert new course into database
    const insertQuery = 'INSERT INTO skills (name, description, teacher_id, title) VALUES ($1, $2, $3, $4) RETURNING id';
    const insertValues = [name, description, userId, theme];
    const insertResult = await client.query(insertQuery, insertValues);
    const courseId = insertResult.rows[0].id;

    // Associate course with user
    const userSkillsQuery = 'INSERT INTO userskills (user_id, skill_id) VALUES ($1, $2)';
    const userSkillsValues = [userId, courseId];
    await client.query(userSkillsQuery, userSkillsValues);

    // Prepare response with created course details
    const course = {
      id: courseId,
      name,
      description,
      teacher_id: userId,
      theme,
    };

    // Example of setting a cookie in the response
    res.cookie('sessionID', req.sessionID, { httpOnly: true, maxAge: 3600000 });

    res.status(201).json({ course });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createCourse,
  getCoursesByUserId,
};
