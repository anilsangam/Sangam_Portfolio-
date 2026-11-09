require('dotenv').config();
const path = require('path');
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const { connectDB, getIsConnected } = require('./config/db');
const publicRoutes = require('./routes/publicRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Security Headers (relaxed CSP for local inline canvas/scripts from original portfolio)
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);

// Body and Cookie Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Static Assets
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'anil_sangam_portfolio_session_secret_2026',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Mount Routes
app.use('/admin', adminRoutes);
app.use('/', publicRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).render('pages/404', {
    pageTitle: 'Page Not Found — Anil Sangam',
    profile: { fullName: 'Anil Sangam' },
    settings: { siteTitle: 'Anil Sangam | Software Developer' }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Application Error:', err);
  res.status(500).send('Something went wrong. Please try again later.');
});

// Server Initialization
async function startServer() {
  // Start listening before waiting for MongoDB so a slow or unavailable
  // database cannot prevent the server from starting.
  const dbConnection = connectDB().catch((err) => {
    console.error('\n[Database Error] Could not establish connection to MongoDB.');
    console.error('Please verify your MONGODB_URI and network connection.');
    console.error(err.message);
    return null;
  });

  app.listen(PORT, '0.0.0.0', async () => {
      const conn = await dbConnection;
      const displayBase = NODE_ENV === 'production' && process.env.BASE_URL ? process.env.BASE_URL : `http://localhost:${PORT}`;

      console.log(`
========================================
       PORTFOLIO SERVER STARTED
========================================

Environment: ${NODE_ENV}
Server Port: ${PORT}

Public Website:
${displayBase}/

Admin Panel:
${displayBase}/admin/login

Admin Dashboard:
${displayBase}/admin/dashboard

Database:
${conn ? 'MongoDB Connected Successfully' : 'Running with default portfolio seed data (MongoDB offline)'}

========================================
`);
    });
}

if (require.main === module) {
  startServer();
}

module.exports = app;
