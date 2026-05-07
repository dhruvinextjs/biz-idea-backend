const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  fullDescription: { type: String, default: '' },
  image: { type: String, default: '/images/service1.png' },
  icon: { type: String, default: '💼' },
  price: { type: String, default: 'Contact Us' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
