const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  role: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  period: {
    type: String,
    trim: true
  },
  year: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  highlights: {
    type: [String],
    default: []
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Experience', experienceSchema);

