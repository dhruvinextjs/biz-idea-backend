const mongoose = require('mongoose');
const slugify = require('slugify');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  slug: { type: String, unique: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  category: {
    type: String,
    enum: ['IDEAS', 'GUIDE', 'FINANCE', 'TECH', 'MARKETING', 'GENERAL'],
    default: 'GENERAL'
  },
  image: { type: String, default: '/images/startup-sketch.png' },
  author: { type: String, default: 'TheBizIdeas Team' },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  publishedAt: { type: Date, default: Date.now },
}, { timestamps: true });

blogSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true }) + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Blog', blogSchema);
