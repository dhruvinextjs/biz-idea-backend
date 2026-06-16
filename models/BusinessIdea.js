const mongoose = require('mongoose');
const slugify = require('slugify');

const businessIdeaSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  fullDescription: { type: String, default: '' },
  category: {
    type: String,
    enum: ['AI & Tech', 'SaaS', 'E-Commerce', 'Local Business', 'Services', 'Other'],
    default: 'Other'
  },
  type: { type: String, enum: ['business', 'app', 'startup'], default: 'business' },
  investmentMin: { type: Number, default: 1000 },
  investmentMax: { type: Number, default: 5000 },
  profitMargin: { type: Number, default: 50 }, // percentage
  teamSize: { type: String, enum: ['Solo (1)', 'Small (2-5)', 'Medium (6-15)', 'Large (15+)'], default: 'Solo (1)' },
  image: { type: String, default: '/images/startup-sketch.png' },
  tags: [{ type: String }],
  upvotes: { type: Number, default: 0 },
  upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  likes: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],
dislikes: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],
}, { timestamps: true });

businessIdeaSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('BusinessIdea', businessIdeaSchema);
