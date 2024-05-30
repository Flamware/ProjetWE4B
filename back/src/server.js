const express = require('express');
const path = require('path');
const session = require('express-session');
const http = require('http');
const cors = require('cors');
const app = express();

const { connectDatabase } = require('./database');
const userRoutes = require('./routes/users');
const storyRoutes = require('./routes/stories');
const commentRoutes = require('./routes/comments');

// Server configuration
const portHTTP = 3000;

// Middleware setup
app.use(cors({ origin: 'http://localhost:8080', credentials: true }));
app.use(express.json());
app.use(session({
    secret: 'YOUR_SECRET_KEY',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }, // 1-hour expiration
}));

// Database connection
connectDatabase();

// Register routes
app.use('/api/users', userRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/comments', commentRoutes);
//when route /api/stories is used, console.log('loadStories') will be printed in the console});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Start HTTP server
const httpServer = http.createServer(app);
httpServer.listen(portHTTP, () => {
    console.log(`HTTP Server running on port ${portHTTP}`);
});

