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
    fileExtension = path.extname(file.originalname);
    if(fileExtension == '') {
      fileExtension = '.' + file.mimetype.split('/')[1]
    }
    cb(null, uniqueSuffix + fileExtension);  // Convention de nommage des fichiers
  }
});

// Liste des types MIME acceptés
const acceptedMimeTypes = [
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/bmp',
  'image/webp',

  // Vidéos
  'video/mp4',
  'video/quicktime',
  'video/x-msvideo',
  'video/x-matroska',
  'video/x-flv',
  'video/webm',

  // Audios
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'audio/mp3',

  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',

  // Archives
  'application/zip',
  'application/x-tar',
  'application/x-gzip',
  'application/x-7z-compressed',

  // Autres types de fichiers
  'application/json',
  'application/xml',
  'application/octet-stream'  // Pour les fichiers binaires génériques
];

const fileFilter = (req, file, cb) => {
  if (acceptedMimeTypes.includes(file.mimetype)) {
    cb(null, true); // Accepte le fichier
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Allowed types are: ${acceptedMimeTypes.join(', ')}`), false); // Rejette le fichier
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
