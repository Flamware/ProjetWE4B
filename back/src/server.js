const express = require('express');
const session = require("express-session");
const pgSession = require('connect-pg-simple')(session);
const cors = require('cors');
const cookieParser = require("cookie-parser");
const { createServer } = require('http');

const setupSocketIO = require('./utils/socket');

// Config imports -----------------------------------------------------------------------
const { connectDatabase, client } = require('./config/database');

// Middleware imports -----------------------------------------------------------------------
const { verifyToken } = require('./middleware/authMiddleware');

// Routes imports -----------------------------------------------------------------------
const userRoutes = require('./routes/users');
const coursesRoute = require('./routes/courses');
const userCoursesRoute = require('./routes/userCourses');

// Api imports -----------------------------------------------------------------------
const coursesApi = require('./api/api_courses');


const app = express();
const httpServer = createServer(app);
const io = require('socket.io')(httpServer);

// Middleware setup ---------------------------------------------------------------------------
app.use(session({
  store: new pgSession({
    pool: client,
  }),
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));

// CORS configuration ---------------------------------------------------------------------------
app.use(cors({
  origin: 'http://localhost:4200', // Replace with your front-end domain
  credentials: true // Allow cookies to be sent
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to the database
connectDatabase().catch(err => {
  console.error('Database connection error:', err);
  process.exit(1);
});

// Routes setup --------------------------------------------------------------------------------
app.use(userRoutes);
app.use(coursesRoute);
app.use(userCoursesRoute);

app.get('/authorized', verifyToken, (req, res) => {
  res.send('Secure resource');
});

app.get('/sessioninfo', (req, res) => {
  console.log('Current session:', req.session); // Log current session information
  res.send(req.session); // Respond with session data
});

app.get("/user", (req, res) => {
  if (req.session && req.session.userId) {
    const sessionUserId = req.session.userId;
    res.status(200).json({ userId: sessionUserId }); // Respond with user ID if authenticated
  } else {
    res.status(401).json({ error: 'User not authenticated' }); // Respond with error if not authenticated
  }
});

app.get('/session-test', (req, res) => {
  if (req.session.views) {
    req.session.views++;
    res.send(`Views: ${req.session.views}`); // Increment and respond with session views count
  } else {
    req.session.views = 1;
    res.send('Welcome for the first time!'); // Initialize session views count and respond
  }
});

setupSocketIO(io, session);

// Start the server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
