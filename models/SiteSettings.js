const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
  siteTitle: {
    type: String,
    default: 'Anil Sangam — Freelance Web & App Developer'
  },
  metaDescription: {
    type: String,
    default: 'Freelance developer building websites and iOS apps for clients worldwide. Working remotely, replies within 5 hours.'
  },
  contactEmail: {
    type: String,
    default: 'asangam012@gmail.com'
  },
  enableInquiries: {
    type: Boolean,
    default: true
  },
  defaultTheme: {
    type: String,
    enum: ['system', 'light', 'dark'],
    default: 'system'
  },
  customNotice: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
