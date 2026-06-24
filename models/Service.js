const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  fullDescription: { type: String, default: '' },

  image: {
    type: String,
    default: '/uploads/services/default.png'
  },

  detailImage: {
    type: String,
    default: '/uploads/services/default-detail.png'
  },

  sectionTitle: {
    type: String,
    default: ''
  },

  sectionDescription: {
    type: String,
    default: ''
  },

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

  isFeatured: {
    type: Boolean,
    default: false
  },

  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }

}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
