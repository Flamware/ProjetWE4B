const multer = require('multer');
const path = require('path');
const { mkdirSync } = require('fs');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userEmail = req.params.email;  // Exemple : Récupération de l'ID de l'utilisateur depuis les paramètres d'URL
    console.log(userEmail);

    if (!userEmail) {
      return cb(new Error('User id not provided'));
    }

    const uploadPath = `./uploads/${userEmail}/`;
    mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);  // Répertoire de destination pour les fichiers téléchargés
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, uniqueSuffix + fileExtension);  // Convention de nommage des fichiers
  }
});

const fileFilter = (req, file, cb) => {
  // Accepter uniquement certains types de fichiers (par exemple, images)
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG and PNG files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10  // Limiter la taille des fichiers à 10 Mo
  },
  fileFilter: fileFilter
});

module.exports = { upload };  // Exporter l'objet upload configuré avec Multer
