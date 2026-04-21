const mongoose = require('mongoose');

const serviceLinkSchema = new mongoose.Schema({
  link: {
    type: String,
    required: [true, 'Service link is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/(www\.)?(meet\.google\.com)/.test(v);
      },
      message: 'Please provide a valid Google Meet link',
    },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Only one document should be here
serviceLinkSchema.statics.getSingleton = async function() {
  let doc = await this.findOne();
  if (!doc) {
    doc = await this.create({ link: 'https://meet.google.com/' });
  }
  return doc;
};

module.exports = mongoose.model('ServiceLink', serviceLinkSchema);