const { client } = require('../database'); // Importer 'client' depuis database.js

// Obtenir tous les cours
async function getAllCourses(req, res) {
  try {
    const query = 'SELECT * FROM skills';
    const result = await client.query(query);
    const courses = result.rows;

    res.status(200).json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Obtenir un cours par son ID
async function getCourseById(req, res) {
  const courseId = req.params.id;
  try {
    const query = 'SELECT * FROM skills WHERE id = $1';
    const result = await client.query(query, [courseId]);
    const course = result.rows[0];

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.status(200).json({ course });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Créer un nouveau cours
async function createCourse(req, res) {
  const { name, description, teacher, title } = req.body;
  try {
    const query = 'INSERT INTO skills (name, description, teacher, title) VALUES ($1, $2, $3, $4) RETURNING *';
    const result = await client.query(query, [name, description, teacher, title]);
    const course = result.rows[0];

    res.status(201).json({ course });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Exporter les fonctions
module.exports = {
  getAllCourses,
  getCourseById,
  createCourse
};
