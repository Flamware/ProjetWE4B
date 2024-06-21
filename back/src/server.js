const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const cors = require('cors');
const { createServer } = require('http');
const setupSocketIO = require('./utils/socket');
const multer = require('multer');
const path = require('path');

// Config imports -----------------------------------------------------------------------
const { connectDatabase, client } = require('./config/database');

// Middleware imports -----------------------------------------------------------------------
const { verifyToken } = require('./middleware/authMiddleware');

// Routes imports -----------------------------------------------------------------------
const userRoutes = require('./routes/users');
const coursesRoute = require('./routes/courses');
const userCoursesRoute = require('./routes/usercourses');
const messageRoute = require('./routes/messages');

// Api imports -----------------------------------------------------------------------
const coursesApi = require('./api/api_courses');

const app = express();
const httpServer = createServer(app);
const io = require('socket.io')(httpServer);

// Setup multer for file uploads
const upload = multer({ dest: 'uploads/' });

// Middleware setup
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Middleware pour servir les fichiers statiques depuis le dossier uploads
const uploadsPath = path.resolve(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));

app.use(session({
  store: new pgSession({
    pool: client,
  }),
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

// CORS configuration
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true
}));

// Connect to the database
connectDatabase().catch(err => {
  console.error('Database connection error:', err);
  process.exit(1);
});

// Use routes
app.use(userRoutes);
app.use(coursesRoute);
app.use(userCoursesRoute);
app.use(messageRoute);

// Example route to test session
app.get('/sessioninfo', (req, res) => {
  console.log('Current session:', req.session);
  res.send(req.session);
});

// Example route to get user information
app.get('/user', (req, res) => {
  if (req.session && req.session.userId) {
    const sessionUserId = req.session.userId;
    res.status(200).json({ userId: sessionUserId });
  } else {
    res.status(401).json({ error: 'User not authenticated' });
  }
});

// Example route to test session views
app.get('/session-test', (req, res) => {
  if (req.session.views) {
    req.session.views++;
    res.send(`Views: ${req.session.views}`);
  } else {
    req.session.views = 1;
    res.send('Welcome for the first time!');
  }
});

// Route for course creation (example)
app.post('/createCourse', upload.single('file'), (req, res) => {
  const courseData = req.body;
  const file = req.file;
  console.log('Course Data:', courseData);
  console.log('Uploaded File:', file);
  // Traitement des données du cours et du fichier ici
  res.status(201).json({ message: 'Course created', courseData, file });
});

// Setup socket.io
setupSocketIO(io, session);

// Start the server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Export the app for testing or other modules
module.exports = {
  app
};
