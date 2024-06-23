// Importations des modules principaux ---------------------------------------------------
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const cors = require('cors');
const { createServer } = require('http');
const multer = require('multer');
const path = require('path');
const setupSocketIO = require('./utils/socket');

// Importations des configurations -------------------------------------------------------
const { connectDatabase, client } = require('./config/database');

// Importations des middlewares ----------------------------------------------------------
const { verifyToken } = require('./middleware/authMiddleware');

// Importations des routes ---------------------------------------------------------------
const userRoutes = require('./routes/users');
const coursesRoute = require('./routes/courses');
const userCoursesRoute = require('./routes/usercourses');
const messageRoute = require('./routes/messages');
const contactRoutes = require('./routes/contact');

// Importations des API ------------------------------------------------------------------
const coursesApi = require('./api/api_courses');

// Création de l'application Express -----------------------------------------------------
const app = express();
const httpServer = createServer(app);
const io = require('socket.io')(httpServer);

// Configuration de multer pour les uploads de fichiers ----------------------------------
const upload = multer({ dest: 'uploads/' });

// Configuration des middlewares ---------------------------------------------------------
app.use(express.json({ limit: '10mb' })); // Pour gérer les requêtes JSON avec une limite de 10MB
app.use(express.urlencoded({ limit: '10mb', extended: true })); // Pour gérer les requêtes URL-encoded

// Configuration pour servir les fichiers statiques du dossier uploads -------------------
const uploadsPath = path.resolve(__dirname, './uploads');
app.use('/src/uploads', express.static(uploadsPath));

// Configuration de la session -----------------------------------------------------------
app.use(session({
  store: new pgSession({ pool: client }), // Stocker les sessions dans la base de données PostgreSQL
  secret: 'your_secret_key', // Clé secrète pour signer les cookies de session
  resave: false, // Ne pas sauvegarder la session si elle n'a pas été modifiée
  saveUninitialized: false, // Ne pas créer de session si aucune donnée n'est sauvegardée
  cookie: {
    secure: false, // Utiliser secure: true en production avec HTTPS
    httpOnly: true, // Empêche l'accès au cookie via JavaScript côté client
    maxAge: 30 * 24 * 60 * 60 * 1000 // Durée de vie de 30 jours
  }
}));

// Configuration de CORS pour autoriser les requêtes du front-end -------------------------
app.use(cors({
  origin: 'http://localhost:4200',
  credentials: true,
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With', 'Accept'],
  maxAge: 86400,
  credentials: true
}));

// Connexion à la base de données --------------------------------------------------------
connectDatabase().catch(err => {
  console.error('Database connection error:', err); // Affiche l'erreur de connexion
  process.exit(1); // Quitte le processus si la connexion échoue
});

// Utilisation des routes ----------------------------------------------------------------
app.use(userRoutes); // Routes pour les utilisateurs
app.use(coursesRoute); // Routes pour les cours
app.use(userCoursesRoute); // Routes pour les cours utilisateur
app.use(messageRoute); // Routes pour les messages
app.use(contactRoutes);

// Route d'exemple pour tester la session -----------------------------------------------
app.get('/sessioninfo', (req, res) => {
  console.log('Current session:', req.session);
  res.send(req.session); // Retourne les informations de la session en cours
});

// Route d'exemple pour récupérer les informations de l'utilisateur ---------------------
app.get('/user', (req, res) => {
  if (req.session && req.session.userId) {
    const sessionUserId = req.session.userId;
    res.status(200).json({ userId: sessionUserId }); // Retourne l'ID de l'utilisateur
  } else {
    res.status(401).json({ error: 'User not authenticated' }); // Erreur si l'utilisateur n'est pas authentifié
  }
});

// Route d'exemple pour tester les vues de la session -----------------------------------
app.get('/session-test', (req, res) => {
  if (req.session.views) {
    req.session.views++;
    res.send(`Views: ${req.session.views}`); // Incrémente et affiche le nombre de vues de la session
  } else {
    req.session.views = 1;
    res.send('Welcome for the first time!'); // Message pour la première visite
  }
});

// Route pour la création de cours (exemple) --------------------------------------------
app.post('/createCourse', upload.single('file'), (req, res) => {
  const courseData = req.body;
  const file = req.file;
  console.log('Course Data:', courseData);
  console.log('Uploaded File:', file);
  // Traitement des données du cours et du fichier ici
  res.status(201).json({ message: 'Course created', courseData, file });
});

// Configuration de socket.io -----------------------------------------------------------
setupSocketIO(io, session); // Initialiser socket.io avec la gestion des sessions

// Démarrage du serveur -----------------------------------------------------------------
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Exportation de l'application pour les tests ou autres modules ------------------------
module.exports = {
  app
};
