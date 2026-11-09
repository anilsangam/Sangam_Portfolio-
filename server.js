
require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');

const { connectDB } = require('./config/db');

const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';

// Validate production secrets
if (IS_PRODUCTION && !process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET is required in production.');
}

const MONGODB_URI = process.env.MONGODB_URI;
if (IS_PRODUCTION && !MONGODB_URI) throw new Error('MONGODB_URI is required in production.');

// Trust Vercel reverse proxy
if (IS_PRODUCTION) {
  app.set('trust proxy', 1);
}

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);

// Body and Cookie Parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({
  extended: true,
  limit: '1mb'
}));
app.use(cookieParser());

// Static Assets
app.use(express.static(path.join(__dirname, 'public')));

// Local uploads (Use Cloudinary for persistent production uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB-backed Session Store
const sessionStore = MONGODB_URI ? MongoStore.create({
  mongoUrl: MONGODB_URI,
  collectionName: 'sessions',
  ttl: 24 * 60 * 60,
  autoRemove: 'native'
}) : null;

// Static files are served above without waiting for MongoDB. The connection
// middleware also runs before session middleware, so both Mongoose and the
// Mongo-backed session store only handle requests after MongoDB is ready.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(503).send('Service temporarily unavailable. Please try again later.');
  }
});

// Session Configuration
app.use(
  session({
    name: 'portfolio.sid',
    secret:
      process.env.SESSION_SECRET ||
      'local-development-only-session-secret',
    ...(sessionStore ? { store: sessionStore } : {}),
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
      httpOnly: true,
      secure: IS_PRODUCTION,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  console.error('[Session Error]', err.message);
  res.status(503).send('Session service temporarily unavailable. Please try again.');
});

// Admin Routes
app.use('/admin', adminRoutes);

// Public Routes
app.use('/', publicRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Application Error]', err);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500).send(
    'Something went wrong. Please try again later.'
  );
});

// 404 Handler
app.use((req, res) => {
  res.status(404).render('pages/404', {
    pageTitle: 'Page Not Found — Anil Sangam',
    profile: {
      fullName: 'Anil Sangam'
    },
    settings: {
      siteTitle: 'Anil Sangam | Software Developer'
    }
  });
});

// Local Development Server
function startServer() {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`
========================================
       PORTFOLIO SERVER STARTED
========================================

Environment: ${NODE_ENV}
Server Port: ${PORT}

Public Website:
http://localhost:${PORT}/

Admin Panel:
http://localhost:${PORT}/admin/login

Admin Dashboard:
http://localhost:${PORT}/admin/dashboard

Database:
Connection will be established on the first dynamic request.

========================================
`);
  });

  return server;
}

// Only start a listening server locally.
// Vercel imports the exported Express application.
if (require.main === module) {
  startServer();
}

module.exports = app;
