const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subTitle: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['web', 'app'],
    required: true
  },
  kind: {
    type: String,
    trim: true
  },
  desc: {
    type: String,
    trim: true
  },
  tags: {
    type: [String],
    default: []
  },
  url: {
    type: String,
    trim: true
  },
  video: {
    type: String,
    trim: true
  },
  poster: {
    type: String,
    trim: true
  },
  icon: {
    type: String,
    trim: true
  },
  shot: {
    type: String,
    trim: true
  },
  note: {
    type: String,
    trim: true
  },
  lqip: {
    type: String
  },
  bg: {
    type: String,
    default: '#1A1818'
  },
  ar: {
    type: String,
    default: '16 / 9'
  },
  order: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);

