const express = require('express');
const { createServer } = require('http');
const cors = require('cors');
const { connectDatabase, client } = require('./config/database'); // Ensure client is imported
const cookieParser = require("cookie-parser");
const userRoutes = require('./routes/users'); // Import user routes
const coursesRoute = require('./api/courses'); // Import courses routes
const userCoursesRoute = require('./routes/usercourses'); // Import user courses routes (commented out)
const { verifyToken } = require('./middleware/authMiddleware'); // Middleware for JWT verification
const setupSocketIO = require('./utils/socket');
const session = require("express-session");
const pgSession = require('connect-pg-simple')(session); // Import pgSession for session storage

const app = express();
const httpServer = createServer(app);

// Middleware setup
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
  origin: 'http://localhost:4200', // Replace with your front-end domain
  credentials: true // Allow cookies to be sent
}));


// Body parsing middleware
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Connect to the database
connectDatabase().catch(err => {
  console.error('Database connection error:', err);
  process.exit(1);
});

// Routes setup
app.use(userRoutes); // Mount user routes
app.use(coursesRoute); // Mount courses routes
app.use(userCoursesRoute); // Mount user courses routes

// Example protected route using JWT middleware
app.get('/authorized', verifyToken, (req, res) => {
  res.send('Secure resource');
});

// Example route to display user information from session
app.get('/sessioninfo', (req, res) => {
  console.log('Current session:', req.session); // Log current session information
  res.send(req.session); // Respond with session data
});

// Example route to get user ID from session
app.get("/user", (req, res) => {
  if (req.session && req.session.userId) {
    const sessionUserId = req.session.userId;
    res.status(200).json({ userId: sessionUserId }); // Respond with user ID if authenticated
  } else {
    res.status(401).json({ error: 'User not authenticated' }); // Respond with error if not authenticated
  }
});

// Example session test route
app.get('/session-test', (req, res) => {
  if (req.session.views) {
    req.session.views++;
    res.send(`Views: ${req.session.views}`); // Increment and respond with session views count
  } else {
    req.session.views = 1;
    res.send('Welcome for the first time!'); // Initialize session views count and respond
  }
});

// Initialize Socket.IO (commented out)
const io = require('socket.io')(httpServer); // Import and initialize Socket.IO

// Share session with Socket.IO (uncomment if needed)
setupSocketIO(io, session);

// Start the server
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
