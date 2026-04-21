const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  epigram: {
    type: String,
    required: [true, 'Epigram is required'],
  },
  story: {
    type: String,
    required: [true, 'Story content is required'],
  },
  photos: {
    type: [String],
    default: [],
    validate: [arrayLimit, 'only 3 images are required for story '],
  },
}, {
  timestamps: true,
});

function arrayLimit(val) {
  return val.length === 3;
}

module.exports = mongoose.model('Story', storySchema);