const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const adminController = require('../controllers/adminController');
const { requireAuth, redirectIfAuth } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

// Rate limiting for admin login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts
  message: 'Too many login attempts from this IP, please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false
});

// Authentication
router.get('/login', redirectIfAuth, adminController.getLogin);
router.post('/login', loginLimiter, adminController.postLogin);
router.post('/logout', requireAuth, adminController.postLogout);

// Dashboard
router.get('/dashboard', requireAuth, adminController.getDashboard);

// Profile & Hero Image (supports Cloudinary file upload)
router.post('/profile', requireAuth, upload.fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'heroImageColor', maxCount: 1 },
  { name: 'resume', maxCount: 1 }
]), adminController.postUpdateProfile);

// Projects CRUD
router.post('/projects/create', requireAuth, upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'screenshotImage', maxCount: 1 },
  { name: 'desktopImage', maxCount: 1 },
  { name: 'media', maxCount: 1 }
]), adminController.postCreateProject);
router.post('/projects/edit/:id', requireAuth, upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'screenshotImage', maxCount: 1 },
  { name: 'desktopImage', maxCount: 1 }
]), adminController.postUpdateProject);
router.post('/projects/delete/:id', requireAuth, adminController.postDeleteProject);

// Skills CRUD
router.post('/skills/create', requireAuth, adminController.postCreateSkill);
router.post('/skills/delete/:id', requireAuth, adminController.postDeleteSkill);

// Timeline (Experience & Education) CRUD
router.post('/experience/create', requireAuth, adminController.postCreateExperience);
router.post('/experience/delete/:id', requireAuth, adminController.postDeleteExperience);
router.post('/education/create', requireAuth, adminController.postCreateEducation);
router.post('/education/delete/:id', requireAuth, adminController.postDeleteEducation);

// Inquiries
router.post('/inquiries/delete/:id', requireAuth, adminController.postDeleteInquiry);

// Settings
router.post('/settings', requireAuth, adminController.postUpdateSettings);

module.exports = router;

