const { client } = require('../database');

// Récupérer les cours par ID utilisateur
const getCoursesByUserId = async (req, res) => {
  const userId = req.params.userId; // Supposons que l'ID utilisateur est passé en paramètre d'URL
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

// Créer un nouveau cours et associer l'utilisateur
const createCourse = async (req, res) => {
  console.log('Request body:', req.body);
  const { name, description, teacher, title } = req.body; // Assurez-vous que ces champs sont envoyés dans le corps de la requête
  const userId = req.session.userId; // Récupérer l'ID de l'utilisateur à partir de la session

  try {
    // Insérer d'abord dans la table 'skills' pour obtenir l'ID du cours créé
    const insertQuery = 'INSERT INTO skills (name, description, teacher, title) VALUES ($1, $2, $3, $4) RETURNING id';
    const insertValues = [name, description, teacher, title];
    const insertResult = await client.query(insertQuery, insertValues);
    const courseId = insertResult.rows[0].id;

    // Ensuite, insérer dans la table 'userskills' pour associer l'utilisateur au cours
    const userSkillsQuery = 'INSERT INTO userskills (user_id, skill_id) VALUES ($1, $2)';
    const userSkillsValues = [userId, courseId];
    await client.query(userSkillsQuery, userSkillsValues);

    // Répondre avec le cours créé
    const course = {
      id: courseId,
      name,
      description,
      teacher,
      title
    };

    res.status(201).json({ course });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Exporter les méthodes de contrôleur
module.exports = {
  getCoursesByUserId,
  createCourse
};
