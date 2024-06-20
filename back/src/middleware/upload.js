const multer = require('multer');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/'); // Destination directory for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + '-' + file.originalname); // File naming convention
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
    fileSize: 1024 * 1024 * 10 // Limit file size to 10MB
  },
  fileFilter: fileFilter
});

module.exports = upload;
