const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const testimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, default: 'Founder' },
  company: { type: String, default: '' },
  content: { type: String, required: true },
  image: { type: String, default: '/images/person1.jpg' },
  rating: { type: Number, default: 5, min: 1, max: 5 },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

const Tool = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  link: { type: String, default: '#' },
  icon: { type: String, default: '🔧' },
  image: { type: String, default: '/images/startup-sketch.png' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = {
  FAQ: mongoose.model('FAQ', faqSchema),
  Testimonial: mongoose.model('Testimonial', testimonialSchema),
  Tool: mongoose.model('Tool', Tool),
};
