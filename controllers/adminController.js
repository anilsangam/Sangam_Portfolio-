const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Inquiry = require('../models/Inquiry');
const SiteSettings = require('../models/SiteSettings');
const { uploadToCloudinaryIfAvailable } = require('../middleware/uploadMiddleware');

// GET /admin/login
exports.getLogin = (req, res) => {
  res.render('admin/login', {
    pageTitle: 'Admin Login — Anil Sangam Portfolio',
    error: req.session.loginError || null,
    success: req.session.loginSuccess || null
  });
  delete req.session.loginError;
  delete req.session.loginSuccess;
};

// POST /admin/login
exports.postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      req.session.loginError = 'Please enter both username and password.';
      return res.redirect('/admin/login');
    }

    const admin = await Admin.findOne({
      $or: [{ username: username.toLowerCase().trim() }, { email: username.toLowerCase().trim() }]
    });

    if (!admin) {
      req.session.loginError = 'Invalid credentials.';
      return res.redirect('/admin/login');
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      req.session.loginError = 'Invalid credentials.';
      return res.redirect('/admin/login');
    }

    // Login successful
    req.session.adminId = admin._id;
    req.session.adminUser = admin.username;
    admin.lastLogin = new Date();
    await admin.save();

    const redirectTo = req.session.returnTo || '/admin/dashboard';
    delete req.session.returnTo;
    return res.redirect(redirectTo);
  } catch (err) {
    console.error('Admin Login Error:', err);
    req.session.loginError = 'Server error during authentication.';
    return res.redirect('/admin/login');
  }
};

// POST /admin/logout
exports.postLogout = (req, res) => {
  req.session.destroy(err => {
    if (err) console.error('Logout error:', err);
    res.redirect('/admin/login');
  });
};

// GET /admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const [profile, projects, skills, experience, education, inquiries, settings] = await Promise.all([
      Profile.findOne().lean(),
      Project.find().sort({ category: 1, order: 1 }).lean(),
      Skill.find().sort({ order: 1 }).lean(),
      Experience.find().sort({ order: 1 }).lean(),
      Education.find().sort({ order: 1 }).lean(),
      Inquiry.find().sort({ createdAt: -1 }).lean(),
      SiteSettings.findOne().lean()
    ]);

    res.render('admin/dashboard', {
      pageTitle: 'Admin Dashboard — Portfolio Control Panel',
      adminUser: req.session.adminUser,
      profile: profile || {},
      projects: projects || [],
      skills: skills || [],
      experience: experience || [],
      education: education || [],
      inquiries: inquiries || [],
      settings: settings || {},
      msg: req.session.adminMsg || null
    });
    delete req.session.adminMsg;
  } catch (err) {
    console.error('Dashboard Error:', err);
    res.status(500).send('Error loading admin dashboard: ' + err.message);
  }
};

// POST /admin/profile
exports.postUpdateProfile = async (req, res) => {
  try {
    const { fullName, headline, subheadline, bio, email, location, responseTime, availabilityStatus, heroSkills, resumeUrl, whatsappNumber, phoneNumber, socialGithub, socialTwitter, socialLinkedin, socialInstagram } = req.body;
    let skillsArray = [];
    if (heroSkills) {
      skillsArray = heroSkills.split(',').map(s => s.trim()).filter(Boolean);
    }

    const updateData = {
      fullName,
      headline,
      subheadline,
      bio,
      email,
      whatsappNumber: (whatsappNumber || '').trim(),
      phoneNumber: (phoneNumber || '').trim(),
      'socialLinks.github': (socialGithub || '').trim(),
      'socialLinks.twitter': (socialTwitter || '').trim(),
      'socialLinks.linkedin': (socialLinkedin || '').trim(),
      'socialLinks.instagram': (socialInstagram || '').trim(),
      location,
      responseTime,
      availabilityStatus,
      heroSkills: skillsArray,
      resumeUrl: (resumeUrl || '').trim()
    };

    // Store the grayscale base and color reveal as separate portrait assets.
    const baseImage = req.files?.heroImage?.[0] || req.file;
    const colorImage = req.files?.heroImageColor?.[0];
    if (baseImage) {
      const cloudUrl = await uploadToCloudinaryIfAvailable(baseImage.path);
      updateData.heroImage = cloudUrl || ('/images/' + baseImage.filename);
    }
    if (colorImage) {
      const cloudUrl = await uploadToCloudinaryIfAvailable(colorImage.path);
      updateData.heroImageColor = cloudUrl || ('/images/' + colorImage.filename);
    }
    const resumeFile = req.files?.resume?.[0];
    if (resumeFile) {
      const cloudUrl = await uploadToCloudinaryIfAvailable(resumeFile.path);
      updateData.resumeUrl = cloudUrl || ('/images/' + resumeFile.filename);
    }

    await Profile.findOneAndUpdate(
      {},
      updateData,
      { upsert: true, new: true }
    );

    req.session.adminMsg = 'Profile and portrait images updated successfully!';
    res.redirect('/admin/dashboard#profile');
  } catch (err) {
    console.error('Update Profile Error:', err);
    req.session.adminMsg = 'Failed to update profile: ' + err.message;
    res.redirect('/admin/dashboard#profile');
  }
};

// POST /admin/projects/create
exports.postCreateProject = async (req, res) => {
  try {
    const { title, subTitle, category, kind, desc, tags, url, note, order, bg, ar } = req.body;
    let tagsArray = [];
    if (tags) {
      tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean);
    }

    const coverFile = req.files?.coverImage?.[0] || req.files?.media?.[0];
    const screenshotFile = req.files?.screenshotImage?.[0];
    let coverFilename = '';
    let screenshotFilename = '';
    if (coverFile) {
      const cloudUrl = await uploadToCloudinaryIfAvailable(coverFile.path);
      coverFilename = cloudUrl || ('/images/' + coverFile.filename);
    }
    if (screenshotFile) {
      const cloudUrl = await uploadToCloudinaryIfAvailable(screenshotFile.path);
      screenshotFilename = cloudUrl || ('/images/' + screenshotFile.filename);
    }

    await Project.create({
      title,
      subTitle,
      category,
      kind,
      desc,
      tags: tagsArray,
      url,
      note,
      order: Number(order) || 0,
      bg: bg || '#1A1818',
      ar: ar || '16 / 9',
      poster: coverFilename || req.body.poster || '',
      shot: screenshotFilename || coverFilename || req.body.shot || '',
      video: req.body.video || '',
      icon: req.body.icon || '',
      isPublished: true
    });

    req.session.adminMsg = 'Project added successfully!';
    res.redirect('/admin/dashboard#projects');
  } catch (err) {
    console.error('Create Project Error:', err);
    req.session.adminMsg = 'Failed to create project: ' + err.message;
    res.redirect('/admin/dashboard#projects');
  }
};

// POST /admin/projects/edit/:id
exports.postUpdateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subTitle, category, kind, desc, tags, url, order, isPublished } = req.body;

    let updateData = {
      title,
      subTitle,
      category,
      kind,
      desc,
      tags: tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      url,
      order: Number(order) || 0,
      isPublished: isPublished === 'true' || isPublished === 'on' || isPublished === true
    };

    const coverImage = req.files?.coverImage?.[0];
    const screenshotImage = req.files?.screenshotImage?.[0];
    if (coverImage) {
      const cloudUrl = await uploadToCloudinaryIfAvailable(coverImage.path);
      updateData.poster = cloudUrl || ('/images/' + coverImage.filename);
    }
    if (screenshotImage) {
      const cloudUrl = await uploadToCloudinaryIfAvailable(screenshotImage.path);
      updateData.shot = cloudUrl || ('/images/' + screenshotImage.filename);
    }

    await Project.findByIdAndUpdate(id, updateData);
    req.session.adminMsg = 'Project updated successfully!';
    res.redirect('/admin/dashboard#projects');
  } catch (err) {
    console.error('Update Project Error:', err);
    req.session.adminMsg = 'Failed to update project: ' + err.message;
    res.redirect('/admin/dashboard#projects');
  }
};

// POST /admin/projects/delete/:id
exports.postDeleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    req.session.adminMsg = 'Project removed successfully.';
    res.redirect('/admin/dashboard#projects');
  } catch (err) {
    req.session.adminMsg = 'Delete error: ' + err.message;
    res.redirect('/admin/dashboard#projects');
  }
};

// POST /admin/skills/create
exports.postCreateSkill = async (req, res) => {
  try {
    const { name, category, proficiency, order } = req.body;
    await Skill.create({
      name,
      category,
      proficiency: Number(proficiency) || 85,
      order: Number(order) || 0,
      isFeatured: true
    });
    req.session.adminMsg = 'Skill added!';
    res.redirect('/admin/dashboard#skills');
  } catch (err) {
    req.session.adminMsg = 'Skill create error: ' + err.message;
    res.redirect('/admin/dashboard#skills');
  }
};

// POST /admin/skills/delete/:id
exports.postDeleteSkill = async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    req.session.adminMsg = 'Skill deleted.';
    res.redirect('/admin/dashboard#skills');
  } catch (err) {
    res.redirect('/admin/dashboard#skills');
  }
};

// POST /admin/experience/create
exports.postCreateExperience = async (req, res) => {
  try {
    const { role, company, location, period, year, description, highlights, order } = req.body;
    await Experience.create({
      role,
      company,
      location,
      period,
      year,
      description,
      highlights: highlights ? highlights.split('\n').map(h => h.trim()).filter(Boolean) : [],
      order: Number(order) || 0
    });
    req.session.adminMsg = 'Experience entry added!';
    res.redirect('/admin/dashboard#timeline');
  } catch (err) {
    req.session.adminMsg = 'Error adding experience: ' + err.message;
    res.redirect('/admin/dashboard#timeline');
  }
};

// POST /admin/experience/delete/:id
exports.postDeleteExperience = async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    req.session.adminMsg = 'Experience entry deleted.';
    res.redirect('/admin/dashboard#timeline');
  } catch (err) {
    res.redirect('/admin/dashboard#timeline');
  }
};

// POST /admin/education/create
exports.postCreateEducation = async (req, res) => {
  try {
    const { degree, institution, period, year, description, order } = req.body;
    await Education.create({
      degree,
      institution,
      period,
      year,
      description,
      order: Number(order) || 0
    });
    req.session.adminMsg = 'Education entry added!';
    res.redirect('/admin/dashboard#timeline');
  } catch (err) {
    req.session.adminMsg = 'Error adding education: ' + err.message;
    res.redirect('/admin/dashboard#timeline');
  }
};

// POST /admin/education/delete/:id
exports.postDeleteEducation = async (req, res) => {
  try {
    await Education.findByIdAndDelete(req.params.id);
    req.session.adminMsg = 'Education entry deleted.';
    res.redirect('/admin/dashboard#timeline');
  } catch (err) {
    res.redirect('/admin/dashboard#timeline');
  }
};

// POST /admin/inquiries/delete/:id
exports.postDeleteInquiry = async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    req.session.adminMsg = 'Inquiry deleted.';
    res.redirect('/admin/dashboard#inquiries');
  } catch (err) {
    res.redirect('/admin/dashboard#inquiries');
  }
};

// POST /admin/settings
exports.postUpdateSettings = async (req, res) => {
  try {
    const { siteTitle, metaDescription, contactEmail, defaultTheme } = req.body;
    await SiteSettings.findOneAndUpdate(
      {},
      { siteTitle, metaDescription, contactEmail, defaultTheme },
      { upsert: true, new: true }
    );
    req.session.adminMsg = 'Settings saved.';
    res.redirect('/admin/dashboard#settings');
  } catch (err) {
    res.redirect('/admin/dashboard#settings');
  }
};
