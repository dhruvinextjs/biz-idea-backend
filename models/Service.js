const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  fullDescription: { type: String, default: '' },

  // Listing Page Icon/Image
  image: {
    type: String,
    default: '/uploads/services/default.png'
  },

  // Detail Page Banner Image
  detailImage: {
    type: String,
    default: '/uploads/services/default-detail.png'
  },

  // Purple Box Content
  sectionTitle: {
    type: String,
    default: ''
  },

  sectionDescription: {
    type: String,
    default: ''
  },

  // What You Get Cards
  features: [
   {
    icon: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    }
  }
  ],

  price: { type: String, default: 'Contact Us' },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },

   isPinned: { type: Boolean, default: false },

}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
