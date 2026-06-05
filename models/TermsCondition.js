const mongoose = require('mongoose');

const termsConditionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      default: 'Terms & Conditions'
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

module.exports = mongoose.model('TermsCondition', termsConditionSchema);