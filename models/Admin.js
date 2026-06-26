// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// // All available admin permissions (maps to admin panel sections)
// const ALL_PERMISSIONS = [
//   'dashboard',
//   'ideas',
//   'case-studies',
//   'blogs',
//   'posts',
//   'services',
//   'faqs',
//   'testimonials',
//   'privacy-policy',
//   'users',
//   'contacts',
//   'newsletter',
//   'sub-admins', // Only super admin can grant this
// ];

// const adminSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//     },
//     password: { type: String, required: true, minlength: 6, select: false },

//     // 'super' = full access, 'sub' = limited by permissions array
//     adminType: {
//       type: String,
//       enum: ['super', 'sub'],
//       default: 'sub',
//     },

//     // Which panel sections this sub-admin can access
//     permissions: {
//       type: [{ type: String, enum: ALL_PERMISSIONS }],
//       default: [],
//     },

//     // Who created this admin (super admin's _id)
//     createdBy: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Admin',
//       default: null,
//     },

//     isActive: { type: Boolean, default: true },
//     avatar: { type: String, default: '/images/avatar.png' },
//     lastLogin: { type: Date, default: null },
//   },
//   { timestamps: true }
// );

// adminSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

// adminSchema.methods.comparePassword = async function (candidate) {
//   return bcrypt.compare(candidate, this.password);
// };

// // Check if this admin has a specific permission
// adminSchema.methods.hasPermission = function (perm) {
//   if (this.adminType === 'super') return true;
//   return this.permissions.includes(perm);
// };

// adminSchema.statics.ALL_PERMISSIONS = ALL_PERMISSIONS;

// module.exports = mongoose.model('Admin', adminSchema);


const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ALL_PERMISSIONS = [
  'dashboard', 'ideas', 'case-studies', 'blogs', 'posts',
  'services', 'faqs', 'testimonials', 'privacy-policy',
  'users', 'contacts', 'newsletter', 'sub-admins',
];

// Permission labels for display
const PERMISSION_LABELS = {
  'dashboard': 'Dashboard', 'ideas': 'Ideas', 'case-studies': 'Case Studies',
  'blogs': 'Blogs', 'posts': 'Community Posts', 'services': 'Services',
  'faqs': 'FAQs', 'testimonials': 'Testimonials', 'privacy-policy': 'Privacy Policy',
  'users': 'Users', 'contacts': 'Contacts', 'newsletter': 'Newsletter',
};

// Permission detail schema — har module ke liye View/Add/Edit/Delete
const permissionDetailSchema = new mongoose.Schema({
  module:   { type: String, required: true },           // e.g. 'ideas'
  label:    { type: String },                           // e.g. 'Ideas'
  isView:   { type: Boolean, default: false },
  isAdd:    { type: Boolean, default: false },
  isEdit:   { type: Boolean, default: false },
  isDelete: { type: Boolean, default: false },
}, { _id: false });

const adminSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },

  adminType: { type: String, enum: ['super', 'sub'], default: 'sub' },

  // Simple string array — backward compatible (which modules admin can access at all)
  permissions: {
    type: [{ type: String, enum: ALL_PERMISSIONS }],
    default: [],
  },

  // Detailed permissions — View/Add/Edit/Delete per module
  permissionDetails: {
    type: [permissionDetailSchema],
    default: [],
  },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null },
  isActive:  { type: Boolean, default: true },
  avatar:    { type: String, default: '/img/avatar.png' },
  lastLogin: { type: Date, default: null },
}, { timestamps: true });

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Check if admin has access to a module
adminSchema.methods.hasPermission = function (mod) {
  if (this.adminType === 'super') return true;
  return this.permissions.includes(mod);
};

// Check specific action permission (view/add/edit/delete)
adminSchema.methods.hasAction = function (mod, action) {
  if (this.adminType === 'super') return true;
  const detail = this.permissionDetails.find(p => p.module === mod);
  if (!detail) return false;
  const map = { view: 'isView', add: 'isAdd', edit: 'isEdit', delete: 'isDelete' };
  return detail[map[action]] === true;
};

adminSchema.statics.ALL_PERMISSIONS = ALL_PERMISSIONS;
adminSchema.statics.PERMISSION_LABELS = PERMISSION_LABELS;

module.exports = mongoose.model('Admin', adminSchema);