const mongoose = require('mongoose');

const weeklyHighlightSchema = new mongoose.Schema({
  images: {
    type: [String],
    default: [],
    validate: [arrayLimit, 'Maximum 20 images allowed'],
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

function arrayLimit(val) {
  return val.length <= 20;
}

// Only one document should be here(note well)
weeklyHighlightSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({ images: [] });
  }
  return doc;
};

module.exports = mongoose.model('WeeklyHighlight', weeklyHighlightSchema);