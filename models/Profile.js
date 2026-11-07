const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  fullName: {
    type: String,
    default: 'Anil Sangam'
  },
  headline: {
    type: String,
    default: "Hi, I'm Anil Sangam. I am a software developer, web developer and app developer."
  },
  subheadline: {
    type: String,
    default: 'Building modern web and mobile applications using React, React Native, Node.js, Express.js and MongoDB.'
  },
  bio: {
    type: String,
    default: 'Software Developer focused on building responsive web applications, mobile applications, REST APIs and reliable backend systems.'
  },
  email: {
    type: String,
    default: 'asangam012@gmail.com'
  },
  whatsappNumber: {
    type: String,
    default: ''
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: 'Bhopal, Madhya Pradesh, India'
  },
  responseTime: {
    type: String,
    default: 'Usually replies within 24 hours'
  },
  availabilityStatus: {
    type: String,
    default: 'Open to opportunities'
  },
  socialLinks: {
    github: { type: String, default: 'https://github.com/anilsangam' },
    linkedin: { type: String, default: 'https://www.linkedin.com/in/anil-sangam-019aa3386' },
    twitter: { type: String, default: '' },
    instagram: { type: String, default: '' },
    cal: { type: String, default: '' }
  },
  heroSkills: {
    type: [String],
    default: ['Software Developer', 'Web Developer', 'App Developer']
  },
  heroImage: {
    type: String,
    default: '/uploads/anil_sangam.png'
  },
  heroImageColor: {
    type: String,
    default: '/uploads/anil_sangam_colour.png'
  },
  resumeUrl: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);
