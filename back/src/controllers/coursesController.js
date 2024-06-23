const { client } = require('../config/database'); // Importer 'client' depuis database.js

async function getAllCourses(req, res) {
  try {
    // Obtenir tous les cours
    const query = 'SELECT * FROM course';
    const result =
    await client.query(query);

    const courses = result.rows.map(course => ({
      ...course,
      mediaUrls: course.media_urls || [], // Ajoutez les URLs des médias
      imageUrl: course.image || '' // Ajoutez l'URL de l'image principale
    }));

    res.status(200).json({ courses });
  }
  catch (error) {
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
    // fetch usernam of techer_id
    const query2 = 'SELECT username FROM users WHERE id = $1';
    const result2 = await client.query(query2, [course.teacher_id]);
    course.teacher = result2.rows[0].username;

    res.status(200).json({ course });
  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({ error: 'Internal server error' });
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
  rateCourse
};
