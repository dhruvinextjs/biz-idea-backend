const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// All available admin permissions (maps to admin panel sections)
const ALL_PERMISSIONS = [
  'dashboard',
  'ideas',
  'case-studies',
  'blogs',
  'posts',
  'services',
  'faqs',
  'testimonials',
  'users',
  'contacts',
  'newsletter',
  'sub-admins', // Only super admin can grant this
];

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },

    // 'super' = full access, 'sub' = limited by permissions array
    adminType: {
      type: String,
      enum: ['super', 'sub'],
      default: 'sub',
    },

    // Which panel sections this sub-admin can access
    permissions: {
      type: [{ type: String, enum: ALL_PERMISSIONS }],
      default: [],
    },

    // Who created this admin (super admin's _id)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },

    isActive: { type: Boolean, default: true },
    avatar: { type: String, default: '/images/avatar.png' },
    lastLogin: { type: Date, default: null },
  },
  { timestamps: true }
);

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Check if this admin has a specific permission
adminSchema.methods.hasPermission = function (perm) {
  if (this.adminType === 'super') return true;
  return this.permissions.includes(perm);
};

adminSchema.statics.ALL_PERMISSIONS = ALL_PERMISSIONS;

module.exports = mongoose.model('Admin', adminSchema);
