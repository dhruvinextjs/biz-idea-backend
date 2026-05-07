const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true },
  country: { type: String, default: '' },
  phone: { type: String, default: '' },
  projectRequirement: { type: String, default: '' },
  status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' },
}, { timestamps: true });

const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = {
  Contact: mongoose.model('Contact', contactSchema),
  Newsletter: mongoose.model('Newsletter', newsletterSchema),
};
