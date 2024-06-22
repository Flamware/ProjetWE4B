const multer = require('multer');
const path = require('path');
const { mkdirSync } = require('fs');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userEmail = req.params.email;  // Retrieve user ID from URL params
    console.log(userEmail);

    if (!userEmail) {
      return cb(new Error('User id not provided'));
    }

    const uploadPath = `./uploads/${userEmail}/`;
    mkdirSync(uploadPath, { recursive: true });

    cb(null, uploadPath);  // Destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExtension = path.extname(file.originalname);
    cb(null, uniqueSuffix + fileExtension);  // File naming convention
  }
});

const fileFilter = (req, file, cb) => {
  // Accept only specific file types (e.g., images)
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG and PNG files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10  // Limit file size to 10MB
  },
  fileFilter: fileFilter
});

module.exports = upload;