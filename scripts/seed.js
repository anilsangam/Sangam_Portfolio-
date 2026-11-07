require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const { connectDB } = require('../config/db');

const Admin = require('../models/Admin');
const Profile = require('../models/Profile');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const SiteSettings = require('../models/SiteSettings');

// ==========================================
// DEFAULT PROFILE
// ==========================================

const DEFAULT_PROFILE = {
  fullName: 'Anil Sangam',
  headline: "Hi, I'm Anil Sangam. I'm a Software Developer.",
  subheadline:
    'Building modern web and mobile applications using React, React Native, Node.js, Express.js and MongoDB.',
  bio:
    'Software Developer focused on building responsive web applications, mobile applications, REST APIs and reliable backend systems.',
  email: 'asangam012@gmail.com',
  location: 'Bhopal, Madhya Pradesh, India',
  availabilityStatus: 'Open to opportunities',
  responseTime: 'Usually replies within 24 hours',
  socialLinks: {
    github: 'https://github.com/anilsangam',
    linkedin: 'https://www.linkedin.com/in/anil-sangam-019aa3386',
    twitter: '',
    instagram: '',
    cal: ''
  },
  heroSkills: [
    'Software Developer',
    'Full-Stack Developer',
    'React Native Developer'
  ],
  heroImage: '/uploads/anil_sangam_colour.png'
};

// ==========================================
// DEFAULT PROJECTS
// ==========================================

const DEFAULT_PROJECTS = [
  {
    category: 'web',
    title: 'Nishad Aarakshan Sankalp',
    subTitle: 'Community and campaign management platform',
    desc:
      'A web platform featuring dynamic content management, public submissions, media galleries, video news and an administrative dashboard.',
    kind: 'Full-Stack Web Application',
    tags: ['Node.js', 'Express.js', 'MongoDB', 'EJS', 'Cloudinary'],
    order: 1,
    isPublished: true
  },
  {
    category: 'web',
    title: 'RIDTech.in - Apna Naukari',
    subTitle: 'Job portal web application',
    desc:
      'A job portal project involving backend development, application functionality and team coordination.',
    kind: 'Web Application',
    tags: ['Node.js', 'Express.js', 'MongoDB', 'JavaScript', 'REST APIs'],
    order: 2,
    isPublished: true
  },
  {
    category: 'app',
    title: 'VIP Party Mobile App',
    subTitle: 'Party management mobile application',
    desc:
      'An Expo React Native mobile application integrated with a shared backend for authentication, notifications, profile management and other app features.',
    kind: 'Mobile Application',
    tags: ['React Native', 'Expo', 'Node.js', 'MongoDB', 'Firebase'],
    order: 1,
    isPublished: true
  },
  {
    category: 'app',
    title: 'Political Party Management System',
    subTitle: 'Android application',
    desc:
      'An Android application project involving React Native development and backend integration.',
    kind: 'Android Application',
    tags: ['React Native', 'Node.js', 'MongoDB', 'REST APIs'],
    order: 2,
    isPublished: true
  }
];

// ==========================================
// DEFAULT EXPERIENCE
// ==========================================

const DEFAULT_EXPERIENCE = [
  {
    role: 'Backend Developer & Team Leader',
    company: 'RIDTech',
    location: 'India',
    period: '2024 — Present',
    year: '2024',
    description:
      'Contributed to web application development, backend functionality and team coordination for the RIDTech.in Apna Naukari job portal.',
    highlights: [
      'Worked on backend development and application functionality.',
      'Contributed to the development of the Apna Naukari job portal.',
      'Coordinated team activities and development tasks.'
    ],
    order: 1
  },
  {
    role: 'Web Development Intern',
    company: 'Acmegrade Pvt. Limited',
    location: 'India',
    period: '2023 — 2024',
    year: '2023',
    description:
      'Completed a web development internship and gained practical experience in web development.',
    highlights: [
      'Gained practical experience with web development concepts.',
      'Worked on implementation tasks during the internship.'
    ],
    order: 2
  }
];

// ==========================================
// DEFAULT EDUCATION
// ==========================================

const DEFAULT_EDUCATION = [
  {
    degree: 'B.Tech - Computer Science & Engineering',
    institution: 'Prestige Institute of Management and Research',
    period: '2023 — 2027',
    year: '2023',
    description:
      'CGPA: 7.42/10. Studying computer science, software development and related engineering subjects.',
    order: 1
  },
  {
    degree: 'Intermediate (12th)',
    institution: "GOVT GIRL'S +2 High School, Bariatu, Ranchi",
    period: '2022',
    year: '2022',
    description: 'JAC Board - 84%',
    order: 2
  },
  {
    degree: 'Secondary (10th)',
    institution: 'Utkramit High School, Rangamati',
    period: '2020',
    year: '2020',
    description: 'JAC Board - 86%',
    order: 3
  }
];

// ==========================================
// DEFAULT SKILLS
// ==========================================

const DEFAULT_SKILLS = [
  { name: 'JavaScript', category: 'Web Development', proficiency: 85, order: 1 },
  { name: 'React.js', category: 'Web Development', proficiency: 85, order: 2 },
  { name: 'React Native', category: 'App Development', proficiency: 85, order: 3 },
  { name: 'Node.js', category: 'Web Development', proficiency: 85, order: 4 },
  { name: 'Express.js', category: 'Web Development', proficiency: 85, order: 5 },
  { name: 'MongoDB', category: 'Web Development', proficiency: 85, order: 6 },
  { name: 'Mongoose', category: 'Web Development', proficiency: 80, order: 7 },
  { name: 'REST APIs', category: 'Web Development', proficiency: 85, order: 8 },
  { name: 'HTML5 & CSS3', category: 'Web Development', proficiency: 90, order: 9 },
  { name: 'Git & GitHub', category: 'Tools & Workflow', proficiency: 75, order: 10 },
  { name: 'Firebase', category: 'Tools & Workflow', proficiency: 70, order: 11 },
  { name: 'Expo', category: 'App Development', proficiency: 85, order: 12 },
  { name: 'C / C++', category: 'Tools & Workflow', proficiency: 75, order: 13 },
  { name: 'Python', category: 'Tools & Workflow', proficiency: 70, order: 14 }
];

// ==========================================
// DEFAULT SITE SETTINGS
// ==========================================

const DEFAULT_SITE_SETTINGS = {
  siteTitle: 'Anil Sangam | Software Developer',
  metaDescription:
    'Anil Sangam - Software Developer building web and mobile applications with React, React Native, Node.js and MongoDB.',
  contactEmail: 'asangam012@gmail.com',
  enableInquiries: true,
  defaultTheme: 'system'
};

// ==========================================
// ADMIN CREATION
// ==========================================

async function createOrUpdateAdmin() {
  const adminUser = process.env.ADMIN_USERNAME || 'sangam';
  const adminEmail = process.env.ADMIN_EMAIL || 'asangam012@gmail.com';
  const adminPass = process.env.ADMIN_PASSWORD || 'Anil@1234';

  if (!adminPass || adminPass.length < 6) {
    throw new Error('Set ADMIN_PASSWORD in .env with at least 6 characters.');
  }

  const existingAdmin = await Admin.findOne({
    username: adminUser
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPass, 12);

    await Admin.create({
      username: adminUser,
      email: adminEmail,
      password: hashedPassword,
      role: 'superadmin'
    });

    console.log(`[Seed] Admin account created: ${adminUser}`);
    return;
  }

  if (existingAdmin.email !== adminEmail) {
    existingAdmin.email = adminEmail;
    await existingAdmin.save();
    console.log(`[Seed] Admin email updated: ${adminEmail}`);
  } else {
    console.log(`[Seed] Admin already exists: ${adminUser}`);
  }
}

// ==========================================
// GENERIC COLLECTION SEEDER
// ==========================================

async function seedCollection(Model, data, label) {
  const count = await Model.countDocuments();

  if (count > 0) {
    console.log(`[Seed] ${label} skipped: ${count} existing record(s) found`);
    return;
  }

  if (Array.isArray(data)) {
    await Model.insertMany(data);
    console.log(`[Seed] ${data.length} ${label} record(s) created`);
  } else {
    await Model.create(data);
    console.log(`[Seed] ${label} created`);
  }
}

// ==========================================
// MAIN SEED FUNCTION
// ==========================================

async function seedData() {
  await createOrUpdateAdmin();

  await seedCollection(Profile, DEFAULT_PROFILE, 'Profile');
  await seedCollection(Project, DEFAULT_PROJECTS, 'Projects');
  await seedCollection(Experience, DEFAULT_EXPERIENCE, 'Experience');
  await seedCollection(Education, DEFAULT_EDUCATION, 'Education');
  await seedCollection(Skill, DEFAULT_SKILLS, 'Skills');
  await seedCollection(SiteSettings, DEFAULT_SITE_SETTINGS, 'Site settings');

  console.log('[Seed] Seeding completed successfully.');
}

// ==========================================
// EXECUTION
// ==========================================

if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      await seedData();
    } catch (err) {
      console.error('[Seed Error]:', err.message);
      process.exitCode = 1;
    } finally {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
    }
  })();
}

module.exports = {
  seedData,
  DEFAULT_PROFILE,
  DEFAULT_PROJECTS,
  DEFAULT_EXPERIENCE,
  DEFAULT_EDUCATION,
  DEFAULT_SKILLS,
  DEFAULT_SITE_SETTINGS
};
