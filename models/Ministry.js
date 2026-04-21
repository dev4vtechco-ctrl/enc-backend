const mongoose = require('mongoose');

const ministrySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'title is required'],
    trim: true,
  },
  main_photo: {
    type: String,
    required: [true, 'main photo is required'],
  },
  photos: {
    type: [String],
    default: [],
    validate: [arrayLimit, 'max of 10 photos allowed'],
  },
  leader: {
    type: String,
    required: [true, ' name of the leader is required'],
  },
  description: {
    type: String,
    required: [true, 'description is required'],
  },
}, {
  timestamps: true,
});

function arrayLimit(val) {
  return val.length <= 10;
}

module.exports = mongoose.model('Ministry', ministrySchema);