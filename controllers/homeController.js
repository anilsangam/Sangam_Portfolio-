const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Inquiry = require('../models/Inquiry');
const SiteSettings = require('../models/SiteSettings');
const ProjectService = require('../services/projectService');

// Home content comes from the records managed in the admin panel.
async function getProfileData() {
  try {
    return await Profile.findOne().lean();
  } catch (e) {
    return null;
  }
}

// Helper to get site settings
async function getSettingsData() {
  try {
    const settings = await SiteSettings.findOne().lean();
    return settings || {
      siteTitle: '',
      metaDescription: '',
      contactEmail: '',
      enableInquiries: true,
      defaultTheme: 'system'
    };
  } catch (e) {
    return {
      siteTitle: '',
      metaDescription: '',
      contactEmail: '',
      enableInquiries: true,
      defaultTheme: 'system'
    };
  }
}

async function renderHomePage(req, res, options = {}) {
  try {
    const profile = await getProfileData();
    const settings = await getSettingsData();

    let experience = [];
    try {
      experience = await Experience.find().sort({ order: 1 }).lean();
      if (!experience) experience = [];
    } catch (e) {
      experience = [];
    }

    let education = [];
    try {
      education = await Education.find().sort({ order: 1 }).lean();
      if (!education) education = [];
    } catch (e) {
      education = [];
    }

    let skills = [];
    try {
      skills = await Skill.find({ isFeatured: true }).sort({ order: 1 }).lean();
      if (!skills) skills = [];
    } catch (e) {
      skills = [];
    }

    const projects = await ProjectService.getPublishedProjects();
    const booksData = ProjectService.formatForBooksShowcase(projects, profile);

    res.render('home/index', {
      pageTitle: settings.siteTitle || (profile && profile.fullName) || 'Portfolio',
      profile,
      settings,
      projects,
      booksData,
      experience,
      education,
      skills,
      currentRoute: options.currentRoute || 'home',
      scrollToSection: options.scrollToSection || '',
      openContact: options.openContact || false
    });
  } catch (err) {
    console.error('Home Page Error:', err);
    res.status(500).send('Internal Server Error');
  }
}

exports.getHome = (req, res) => renderHomePage(req, res, { currentRoute: 'home', scrollToSection: '' });
exports.getWorks = (req, res) => renderHomePage(req, res, { currentRoute: 'works', scrollToSection: 'works' });
exports.getAbout = (req, res) => renderHomePage(req, res, { currentRoute: 'about', scrollToSection: 'about' });
exports.getContact = (req, res) => renderHomePage(req, res, { currentRoute: 'contact', openContact: true });

exports.getWebDeveloper = async (req, res) => {
  try {
    const profile = await getProfileData();
    const settings = await getSettingsData();
    const projects = await ProjectService.getPublishedProjects('web');
    const booksData = ProjectService.formatForBooksShowcase(projects, profile);

    res.render('pages/web_developer', {
      pageTitle: 'Full-Stack Web Developer — ' + ((profile && profile.fullName) || ''),
      profile,
      settings,
      projects,
      booksData,
      currentRoute: 'web-developer'
    });
  } catch (err) {
    console.error('Web Developer Page Error:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.getAppDeveloper = async (req, res) => {
  try {
    const profile = await getProfileData();
    const settings = await getSettingsData();
    const projects = await ProjectService.getPublishedProjects('app');
    const booksData = ProjectService.formatForBooksShowcase(projects, profile);

    res.render('pages/app_developer', {
      pageTitle: 'Mobile App Developer — ' + ((profile && profile.fullName) || ''),
      profile,
      settings,
      projects,
      booksData,
      currentRoute: 'app-developer'
    });
  } catch (err) {
    console.error('App Developer Page Error:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.postContact = async (req, res) => {
  try {
    const { name, email, message, budget, projectType } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Please provide name, email and project message.' });
    }

    await Inquiry.create({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
      budget: budget ? budget.trim() : '',
      projectType: projectType ? projectType.trim() : ''
    });

    return res.json({
      success: true,
      message: 'Thank you for reaching out! I will reply within 24 hours.'
    });
  } catch (err) {
    console.error('Contact Form Error:', err);
    return res.status(500).json({ success: false, error: 'Failed to process inquiry. Please try again.' });
  }
};
