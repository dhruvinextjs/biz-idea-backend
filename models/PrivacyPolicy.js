const mongoose = require('mongoose');

const privacyPolicySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'Privacy Policy'
    },
    content: {
      type: String,
      required: false
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('PrivacyPolicy', privacyPolicySchema);