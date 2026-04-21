const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  main_photo: {
    type: String,
    required: [true, 'Main photo is required'],
  },
  photos: {
    type: [String],
    default: [],
    validate: [arrayLimit, 'only 10 images allowed'],
  },
}, {
  timestamps: true,
});

function arrayLimit(val) {
  return val.length <= 10;
}

module.exports = mongoose.model('Event', eventSchema);