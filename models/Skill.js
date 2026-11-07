const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: ['Web Development', 'App Development', 'Tools & Workflow', 'Backend & Database'],
    default: 'Web Development'
  },
  proficiency: {
    type: Number,
    min: 0,
    max: 100,
    default: 85
  },
  icon: {
    type: String
  },
  order: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Skill', skillSchema);
