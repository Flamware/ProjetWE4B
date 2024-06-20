const { client } = require('../config/database'); // Importer 'client' depuis database.js

// Obtenir tous les cours
async function getAllCourses(req, res) {
  try {
    let query;
    let queryParams = [];

    // Check if username is provided in the request body
    if (req.body.username) {
      // Fetch userId from username
      const userQuery = 'SELECT id FROM users WHERE username = $1';
      const userResult = await client.query(userQuery, [req.body.username]);
      const userId = userResult.rows[0]?.id;

      if (!userId) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Fetch all courses associated with the user from the course table
      query = `
        SELECT c.*
        FROM course c
        INNER JOIN usercourse uc ON c.id = uc.skill_id
        WHERE uc.user_id = $1`;
      queryParams = [userId];
    } else {
      // Fetch all courses from the course table
      query = 'SELECT * FROM course';
      queryParams = [];
    }

    const result = await client.query(query, queryParams);
    const courses = result.rows;

    res.status(200).json({ courses });
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


async function getCourseById(req, res) {
  const courseId = req.params.id;
  try {
    console.log("Course number", courseId, "is requested")
    const query = 'SELECT * FROM course WHERE id = $1';
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
  const {date, description, image, name, theme} = req.body;
  const userId = req.userId;
  //insere un nouveau cours dans la base de données
  try {
    if (!userId) {
      return res.status(401).json({error: 'User ID not found in session'});
    }

    const insertQuery = 'INSERT INTO course (type, description , title , date , image, teacher_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id';
    const insertValues = [theme, description, name, date, image, userId];
    const insertResult = await client.query(insertQuery, insertValues);
    const courseId = insertResult.rows[0].id;
    // if ok return the new course
    const course = {
      id: courseId,
      type: theme,
      description,
      title: name,
      date,
      image,
      teacher_id: userId
    };
    res.status(201).json({course});
  }
  catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({error: 'Internal server error'});
  }
}

async function deleteCourse(req, res) {
  const courseId = req.params.id;
  const userId = req.userId;
  console.log("User number", userId, "tries to delete course number", courseId);
  // Vérifier si l'utilisateur est autorisé à supprimer le cours et le supprimer depuis usercourse
  try {
    const query = 'DELETE FROM course WHERE id = $1 AND teacher_id = $2';
    const result = await client.query(query, [courseId, userId]);
    res.status(200).json({message: 'Course deleted successfully'});
  }
  catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({error: 'Internal server error'});
  }
}

async function rateCourse(req, res) {
  const userId = req.userId;
  const {courseId, rating} = req.body;
  // Vérifier si l'utilisateur a déjà noté le cours et mettre à jour la note
  try {
    const query = 'INSERT INTO course_reviews (user_id, course_id, value) VALUES ($1, $2, $3) ON CONFLICT (user_id, course_id) DO UPDATE SET value = $3';
    const result = await client.query(query, [userId, courseId, rating]);
    const query2 = 'UPDATE course SET rate = (SELECT AVG(value) FROM course_reviews WHERE course_id = $1) WHERE id = $2';
    const result2 = await client.query(query2, [courseId, courseId]);
    res.status(200).json({message: 'Course rated successfully'});
  }
  catch (error) {
    console.error('Error rating course:', error);
    res.status(500).json({error: 'Internal server error'});
  }
}

// Exporter les fonctions
module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  deleteCourse,
  rateCourse
};
