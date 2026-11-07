const express = require('express');
const router = express.Router();
const homeController = require('../controllers/homeController');

// Home route
router.get('/', homeController.getHome);
router.get('/home', (req, res) => res.redirect('/'));

// Clean direct section routes (no # in url!)
router.get('/works', homeController.getWorks);
router.get('/about', homeController.getAbout);
router.get('/contact', homeController.getContact);

// Category subpages
router.get('/web-developer', homeController.getWebDeveloper);
router.get('/web-developer/', homeController.getWebDeveloper);

router.get('/app-developer', homeController.getAppDeveloper);
router.get('/app-developer/', homeController.getAppDeveloper);

// Contact Inquiry Submission
router.post('/contact', homeController.postContact);

module.exports = router;
