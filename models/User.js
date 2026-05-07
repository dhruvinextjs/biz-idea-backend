// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');

// const CODING_LEVELS = [
//   'No, and coding is totally unfamiliar',
//   'Not, but I understand a few concepts',
//   "Yes, and I'm beginner",
//   "Yes, and I'm intermediate or a professional",
// ];

// const BUSINESS_INTERESTS = [
//   'E-commerce / Online Store',
//   'SaaS / Software',
//   'Content / Media',
//   'Freelancing / Agency',
//   'Mobile App',
//   'AI / Tech Startup',
//   'Local / Service Business',
//   'Other',
// ];

// const userSchema = new mongoose.Schema(
//   {
//     // STEP 1 — Username
//     username: {
//       type: String,
//       required: [true, 'Username is required'],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       minlength: [3, 'Min 3 characters'],
//       maxlength: [30, 'Max 30 characters'],
//       match: [/^[a-z0-9_]+$/, 'Only lowercase letters, numbers and underscores'],
//     },

//     // STEP 2 — Stage (Now Dynamic - Reference to Stage Model)
//     stage: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Stage',
//       default: null,
//     },

//     // STEP 3 — Coding Level (Abhi static rakha hai)
//     codingLevel: {
//       type: String,
//       enum: { values: CODING_LEVELS, message: 'Invalid coding level' },
//       default: null,
//     },

//     // STEP 4 — Business Interests (Abhi static rakha hai)
//     businessInterests: {
//       type: [{ type: String, enum: BUSINESS_INTERESTS }],
//       default: [],
//     },

//     // STEP 5 — Profile info
//     birthdate: {
//       type: Date,
//       default: null,
//     },
//     location: {
//       type: String,
//       trim: true,
//       default: '',
//     },
//     twitterHandle: {
//       type: String,
//       trim: true,
//       default: '',
//     },

//     // Other fields
//     name: {
//       type: String,
//       trim: true,
//       default: '',
//     },
//     email: {
//       type: String,
//       // required: [true, 'Email is required'],
//       unique: true,
//       lowercase: true,
//       trim: true,
//       match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
//     },
//     password: {
//       type: String,
//       // required: [true, 'Password is required'],
//       minlength: [6, 'Min 6 characters'],
//       select: false,
//     },

//     avatar:  { type: String, default: '/images/avatar.png' },
//     bio:     { type: String, default: '', maxlength: 300 },

//     isActive:        { type: Boolean, default: true },
//     isEmailVerified: { type: Boolean, default: false },

//     upvotedPosts:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
//     upvotedIdeas:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'BusinessIdea' }],
//     upvotedCaseStudies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CaseStudy' }],
//   },
//   { timestamps: true }
// );

// // Password Hashing
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, 12);
//   next();
// });

// userSchema.methods.comparePassword = async function (candidate) {
//   return bcrypt.compare(candidate, this.password);
// };

// // Static Arrays (Stage remove kar diya)
// userSchema.statics.CODING_LEVELS     = CODING_LEVELS;
// userSchema.statics.BUSINESS_INTERESTS = BUSINESS_INTERESTS;

// module.exports = mongoose.model('User', userSchema);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const CODING_LEVELS = [
  'No, and coding is totally unfamiliar',
  'Not, but I understand a few concepts',
  "Yes, and I'm beginner",
  "Yes, and I'm intermediate or a professional",
];

const BUSINESS_INTERESTS = [
  'E-commerce / Online Store',
  'SaaS / Software',
  'Content / Media',
  'Freelancing / Agency',
  'Mobile App',
  'AI / Tech Startup',
  'Local / Service Business',
  'Other',
];

const userSchema = new mongoose.Schema(
  {
    // STEP 1 — Username
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [3, 'Min 3 characters'],
      maxlength: [30, 'Max 30 characters'],
      match: [/^[a-z0-9_]+$/, 'Only lowercase letters, numbers and underscores'],
    },

    // STEP 2 — Stage (dynamic, references Stage model)
    stage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stage',
      default: null,
    },

    // STEP 3 — Coding Level
    codingLevel: {
      type: String,
      default: null,
    },

    // STEP 4 — Business Interests
    businessInterests: {
      type: [{ type: String, enum: BUSINESS_INTERESTS }],
      default: [],
    },

    // STEP 5 — Profile info
    birthdate:     { type: Date,   default: null },
    location:      { type: String, trim: true, default: '' },
    twitterHandle: { type: String, trim: true, default: '' },

    // STEP 6 — Credentials
    name: { type: String, trim: true, default: '' },

    email: {
      type: String,
      unique: true,
      sparse: true,          // null values pe unique check skip hoga
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
    },

    password: {
      type: String,
      minlength: [6, 'Min 6 characters'],
      select: false,
    },

    // Profile extras
    avatar: { type: String, default: '/images/avatar.png' },
    bio:    { type: String, default: '', maxlength: 300 },

    // Status
    isActive:        { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },

    // Activity
    upvotedPosts:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
    upvotedIdeas:       [{ type: mongoose.Schema.Types.ObjectId, ref: 'BusinessIdea' }],
    upvotedCaseStudies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CaseStudy' }],
  },
  { timestamps: true }
);

// Hash password only when it's set and modified
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  if (!this.password) return false;
  return bcrypt.compare(candidate, this.password);
};

userSchema.statics.CODING_LEVELS      = CODING_LEVELS;
userSchema.statics.BUSINESS_INTERESTS = BUSINESS_INTERESTS;

module.exports = mongoose.model('User', userSchema);
