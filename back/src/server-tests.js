const Koa = require('koa');
const Router = require('koa-router');
const session = require('koa-session');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const PgSession = require('koa-pg-session'); // Vérifiez le bon module de session PostgreSQL
const { Pool } = require('pg');
const jwtCheck = require('./middleware/jwCheck');
const injectSession = require('./middleware/sessionInjection');
const userRoutes = require('./routes/users');
const coursesRoute = require('./api/courses');
const userCoursesRoute = require('./routes/usercourses');

const app = new Koa();
const router = new Router();

// URL de connexion à la base de données CockroachDB
const dbUrl = 'postgresql://axel:CqfYxdcHoA1lZeT2DAz5fA@punchy-dragon-11093.8nj.gcp-europe-west1.cockroachlabs.cloud:26257/we4b_db';

// Créer un pool de connexions à la base de données en utilisant l'URL
const pool = new Pool({
  connectionString: dbUrl,
  ssl: {
    rejectUnauthorized: false // Permettre les certificats auto-signés si nécessaire
  }
});

// Configurer la session Koa avec PostgreSQL
const pgSession = new PgSession({
  pool, // Utiliser le pool de connexion PostgreSQL
  tableName: 'session' // Nom de la table de sessions dans PostgreSQL
});

// Clé secrète pour sécuriser les sessions (minimum 32 caractères)
app.keys = ['votre_clé_secrète_ici_avec_au_moins_32_caracteres'];

// Middleware Koa
app.use(bodyParser());
app.use(cors({
  origin: 'http://localhost:4200', // Remplacez par le domaine de votre front-end
  credentials: true // Permettre l'envoi des cookies
}));
app.use(session({ maxAge: 30 * 24 * 60 * 60 * 1000 }, app));
app.use(pgSession);
app.use(injectSession);

// Routes
router.get('/authorized', jwtCheck, async (ctx) => {
  ctx.body = 'Secure resource';
});

router.get('/sessioninfo', async (ctx) => {
  console.log('Current session:', ctx.session);
  ctx.body = ctx.session;
});

router.get('/user', async (ctx) => {
  if (ctx.session && ctx.session.userId) {
    ctx.status = 200;
    ctx.body = { userId: ctx.session.userId };
  } else {
    ctx.status = 401;
    ctx.body = { error: 'User not authenticated' };
  }
});

router.get('/session-test', async (ctx) => {
  if (ctx.session.views) {
    ctx.session.views++;
    ctx.body = `Views: ${ctx.session.views}`;
  } else {
    ctx.session.views = 1;
    ctx.body = 'Welcome for the first time!';
  }
});

// Enregistrer les routes Koa
app.use(router.routes());
app.use(router.allowedMethods());

// Démarrer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
