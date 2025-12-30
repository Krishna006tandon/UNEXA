const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  media: {
    type: String,
    required: true
  },
  mediaType: {
    type: String,
    enum: ['image', 'video'],
    required: true
  },
  caption: {
    type: String,
    maxlength: 200,
    trim: true
  },
  viewers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    viewedAt: {
      type: Date,
      default: Date.now
    }
  }],
  expiresAt: {
    type: Date,
    default: Date.now,
    expires: 24 * 60 * 60
  },
  filters: [{
    type: String,
    enum: ['none', 'grayscale', 'sepia', 'blur', 'brightness', 'contrast', 'vintage', 'cold', 'warm'],
    default: 'none'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Story', storySchema);
