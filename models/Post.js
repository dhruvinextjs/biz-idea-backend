const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  username: { type: String },
  avatar: { type: String },
  content: { type: String, required: true },
    likes: {
    type: Number,
    default: 0
  },

  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, required: true },
  image: { type: String, default: null },           // ← New: Image URL
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  authorName: { type: String },
  authorAvatar: { type: String, default: '/images/avatar.png' },
  
  upvotes: { type: Number, default: 0 },
  upvotedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  comments: [commentSchema],
  commentCount: { type: Number, default: 0 },
  
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true },
  isPinned: { type: Boolean, default: false },
  
  // === Admin Approval ===
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  approvedAt: { type: Date },

  slug: { type: String, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);