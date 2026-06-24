const mongoose = require('mongoose');
const slugify = require('slugify');

const caseStudySchema = new mongoose.Schema(
{
  title: {
    type: String,
    required: true,
    trim: true
  },

  slug: {
    type: String,
    unique: true
  },

  excerpt: {
    type: String,
    required: true
  },

  companyName: {
    type: String,
    required: true
  },

  founderName: {
    type: String,
    required: true
  },

  founderImage: {
    type: String,
    default: '/images/person1.jpg'
  },

  image: {
    type: String,
    default: '/images/startup-sketch.png'
  },

  industry: {
    type: String,
    enum: [
      'Marketing',
      'Advertising',
      'Analytics',
      'Real Estate',
      'Automations',
      'SaaS',
      'E-Commerce',
      'Other'
    ],
    default: 'Other'
  },

  monthlyRevenue: {
    type: Number,
    required: true
  },

  companySize: {
    type: Number,
    default: 2
  },

  payout: {
    type: String,
    default: ''
  },

  // ========= CASE STUDY SECTIONS =========

  companyOverview: {
    type: String,
    default: ''
  },

  founderStory: {
    type: String,
    default: ''
  },

  problem: {
    type: String,
    default: ''
  },

  solution: {
    type: String,
    default: ''
  },

  businessModel: {
    type: String,
    default: ''
  },

  revenue: {
    type: String,
    default: ''
  },

  funding: {
    type: String,
    default: ''
  },

  growth: {
    type: String,
    default: ''
  },

  marketingStrategy: {
    type: String,
    default: ''
  },

  firstCustomers: {
    type: String,
    default: ''
  },

  lessons: [{
    type: String
  }],

  howToStart: {
    type: String,
    default: ''
  },

  upvotes: {
    type: Number,
    default: 0
  },

  upvotedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  comments: {
    type: Number,
    default: 0
  },

  isActive: {
    type: Boolean,
    default: true
  },

  isFeatured: {
    type: Boolean,
    default: false
  }

},
{
  timestamps: true
});

caseStudySchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug =
      slugify(this.title, {
        lower: true,
        strict: true
      }) +
      '-' +
      Date.now();
  }

  next();
});

module.exports = mongoose.model('CaseStudy', caseStudySchema);