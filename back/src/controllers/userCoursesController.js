const { client } = require('../config/database');
const { validationResult } = require('express-validator');
const path = require('path');

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

async function getAllCoursesFromUser(req, res) {
  if (req.body.username){
    console.log("User", req.body.username, "is requesting all courses")
    // fetch user id
    const query = 'SELECT id FROM users WHERE username = $1';
    const result = await client.query(query, [req.body.username]);

    //fetch all course from user
    const query2 = 'SELECT * FROM course WHERE teacher_id = $1';
    const result2 = await client.query(query2, [result.rows[0].id]);
    const courses = result2.rows.map(course => ({
      ...course,
      mediaUrls: course.media_urls || [], // Ajoutez les URLs des médias
      imageUrl: course.image || '' // Ajoutez l'URL de l'image principale
    }));

    res.status(200).json({ courses });
  }
  else{
    console.log("Fetching course of logged user")
    const userId = req.userId;
    // Obtenir tous les cours de l'utilisateur connecté
    try {
      const query = 'SELECT * FROM course WHERE teacher_id = $1';
      const result = await
      client.query(query, [userId]);
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
}

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

// TODO: à modifier
async function uploadCourseMedia(req, res) {
  const { email } = req.params;
  const file = req.file;
  const courseId = req.params.courseId; // Course ID envoyé depuis le frontend

  if (!file) {
    return res.status(400).json({ error: 'File not provided' });
  }

  try {
    const imageUrl = `/uploads/${email}/${file.filename}`; // URL où l'image est téléchargée

    // Vérifier si le courseId est valide
    if (!courseId) {
      return res.status(400).json({ error: 'Course ID is required' });
    }

    // Vérifier si le cours existe
    const fetchQuery = 'SELECT * FROM course WHERE id = $1';
    const fetchResult = await client.query(fetchQuery, [courseId]);

    if (fetchResult.rowCount === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Mettre à jour la base de données avec l'URL de l'image
    const updateQuery = 'UPDATE course SET image = $1 WHERE id = $2';
    await client.query(updateQuery, [imageUrl, courseId]);

    // Réponse JSON avec l'URL de l'image et un message de confirmation
    res.status(200).json({
      message: 'Image uploaded and set successfully',
      url: imageUrl
    });

  } catch (error) {
    console.error('Error uploading course media:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function updateCourseMedia(req, res) {
  const courseId = req.params.courseId;
  const { mediaUrls, imageUrl } = req.body; // Assurez-vous que mediaUrls est bien un tableau d'URLs

  try {
    // Vérifier que courseId est valide
    if (!courseId) {
      return res.status(400).json({ error: 'Course ID is required' });
    }

    // Vérifier que mediaUrls est un tableau
    if (!Array.isArray(mediaUrls)) {
      return res.status(400).json({ error: 'mediaUrls must be an array' });
    }

    // Vérifier que imageUrl est une chaîne
    if (typeof imageUrl !== 'string' || !imageUrl.trim()) {
      return res.status(400).json({ error: 'imageUrl must be a valid string' });
    }

    // Récupérer les médias_urls actuels du cours
    const fetchQuery = 'SELECT media_urls FROM course WHERE id = $1';
    const fetchResult = await client.query(fetchQuery, [courseId]);

    if (fetchResult.rowCount === 0) {
      return res.status(404).json({ error: 'Course not found' });
    }

    const currentMediasUrls = fetchResult.rows[0].media_urls || [];

    // Ajouter les nouveaux mediaUrls à la liste des medias_urls actuels
    const updatedMediasUrls = [...new Set([...currentMediasUrls, ...mediaUrls])];

    // Mettre à jour la base de données avec les nouveaux medias_urls et l'imageUrl
    const updateQuery = 'UPDATE course SET media_urls = $1, image = $2 WHERE id = $3';
    await client.query(updateQuery, [updatedMediasUrls, imageUrl, courseId]);

    const updatedCourse = {
      id: courseId,
      mediaUrls: updatedMediasUrls,
      imageUrl: imageUrl
    };

    res.status(200).json({ message: 'Course media and image updated successfully', course: updatedCourse });
  } catch (error) {
    console.error('Error updating course media and image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


// TODO: à modifier
// Fonction de contrôleur pour mettre à jour les ressources (fichiers)
async function updateRessourcesFiles(req, res) {
  const { email } = req.params; // Récupération de l'email de l'utilisateur depuis les paramètres d'URL
  const file = req.file; // Récupération du fichier téléchargé depuis Multer
  console.log(file);

  try {
    // Vérifiez s'il y a des erreurs de validation dans la requête
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!email) {
      return res.status(400).json({ message: 'User email not provided' });
    }

    if (!file) {
      return res.status(400).json({ message: 'File not uploaded' });
    }

    const { originalname, mimetype } = file;

    // Créez un chemin de fichier relatif
    const relativeFilePath = `uploads/${email}/${file.filename}`;
    const absoluteFilePath = path.resolve(relativeFilePath);

    // Insérez les informations dans la base de données
    const insertQuery = `
      INSERT INTO resources (title, description, file_path, created_at, user_email)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;

    const values = [originalname, '', relativeFilePath, new Date(), email];

    // Exécutez la requête d'insertion dans la base de données PostgreSQL
    const result = await client.query(insertQuery, values);

    // Si l'insertion est réussie, renvoyez la ressource insérée
    const insertedRessource = result.rows[0];
    res.status(201).json(insertedRessource);
  } catch (error) {
    console.error('Error uploading resource:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getRessourcesFiles(req, res) {
  const { email } = req.params;

  try {
    if (!email) {
      return res.status(400).json({ message: 'User email not provided' });
    }

    // Requête pour récupérer les ressources
    const selectQuery = `
      SELECT * FROM resources
      WHERE user_email = $1
      ORDER BY created_at DESC;
    `;

    const result = await client.query(selectQuery, [email]);

    // Vérifiez si des ressources ont été trouvées
    if (result.rows.length === 0) {
      return res.status(204).json({ message: 'No resources found for this user' });
    }

    // Renvoyez les ressources récupérées
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function deleteCourse(req, res) {
  const courseId = req.params.courseId;
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

module.exports = {
  createCourse,
  deleteCourse,
  getCoursesByUserId,
  getAllCoursesFromUser,
  uploadCourseMedia,
  updateRessourcesFiles,
  getRessourcesFiles,
  updateCourseMedia
};
