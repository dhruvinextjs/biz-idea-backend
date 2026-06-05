// const jwt  = require('jsonwebtoken');
// const User = require('../models/User');
// const Stage = require('../models/Stage');
// const { asyncHandler } = require('../middleware/auth');

// const signUserToken = (id) =>
//   jwt.sign({ id, type: 'user' }, process.env.JWT_USER_SECRET, {
//     expiresIn: process.env.JWT_USER_EXPIRE || '7d',
//   });

// // ══════════════════════════════════════════════════════════════
// //  STEP 1 — Username availability check
// //  GET /api/auth/check-username/:username
// //  Auth: None
// //  Called on every keystroke (debounce 400ms on frontend)
// // ══════════════════════════════════════════════════════════════
// // exports.checkUsername = async (req, res) => {
// //   const { username } = req.body;

// //   if (!username || typeof username !== 'string') 
// //     return res.status(400).json({ 
// //       success: false, 
// //       available: false, 
// //       message: 'Username is required.' 
// //     });

// //   const trimmedUsername = username.toLowerCase().trim();

// //   if (trimmedUsername.length < 3)
// //     return res.status(400).json({ 
// //       success: false, 
// //       available: false, 
// //       message: 'Min 3 characters required.' 
// //     });

// //   if (trimmedUsername.length > 30)
// //     return res.status(400).json({ 
// //       success: false, 
// //       available: false, 
// //       message: 'Max 30 characters allowed.' 
// //     });

// //   if (!/^[a-z0-9_]+$/.test(trimmedUsername))
// //     return res.status(400).json({ 
// //       success: false, 
// //       available: false, 
// //       message: 'Only letters, numbers and underscores allowed.' 
// //     });

// //   const exists = await User.findOne({ username: trimmedUsername });

// //   return res.json({
// //     success:   true,
// //     available: !exists,
// //     message:   exists ? 'Username already taken.' : 'Username is available! 🎉',
// //   });
// // };
// exports.checkUsername = async (req, res) => {
//   const { username } = req.body;

//   if (!username || typeof username !== 'string') 
//     return res.status(400).json({ success: false, available: false, message: 'Username is required.' });

//   const trimmedUsername = username.toLowerCase().trim();

//   if (trimmedUsername.length < 3 || trimmedUsername.length > 30 || !/^[a-z0-9_]+$/.test(trimmedUsername)) {
//     return res.status(400).json({ success: false, available: false, message: 'Invalid username format.' });
//   }

//   try {
//     let user = await User.findOne({ username: trimmedUsername });

//     if (!user) {
//       user = await User.create({
//         username: trimmedUsername,
//         name: trimmedUsername,
//         email: null,
//         password: null,
//         stage: null,
//         codingLevel: null,
//         businessInterests: [],
//         isActive: true,
//       }, { validateBeforeSave: false });
//     }

//     const token = signUserToken(user._id);

//     res.json({
//       success: true,
//       available: true,
//       message: "Username available & user created",
//       token,
//       user: { id: user._id, username: user.username }
//     });

//   } catch (error) {
//     console.error("Check Username Error:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// };
// // ══════════════════════════════════════════════════════════════
// //  STEP 2 — Get stage options
// //  GET /api/auth/signup/stages
// //  Auth: None
// // ══════════════════════════════════════════════════════════════
// exports.getStages = async (req, res) => {
//   try {
//     const stages = await Stage.find({ isActive: true })
//       .sort({ order: 1, name: 1 });

//     res.json({
//       success: true,
//       step: 2,
//       question: "Which best describes the stage you're at right now?",
//       data: stages.map(stage => ({
//         id: stage._id,
//         name: stage.name,
//         description: stage.description || ""
//       }))
//     });
//   } catch (error) {
//     console.error("Get Stages Error:", error);   // ← Debugging ke liye
//     res.status(500).json({ 
//       success: false, 
//       message: "Server error while fetching stages" 
//     });
//   }
// };

// // // ====================== USER SIDE - SAVE SELECTED STAGE ======================
// // exports.saveStage = async (req, res) => {
// //   try {
// //     const { stageId } = req.body;
// //     const userId = req.user.id;

// //     if (!stageId) {
// //       return res.status(400).json({ success: false, message: "Stage ID is required" });
// //     }

// //     const user = await User.findByIdAndUpdate(
// //       userId,
// //       { stage: stageId },
// //       { new: true }
// //     );

// //     res.json({
// //       success: true,
// //       message: "Stage saved successfully",
// //       stageId: user.stage
// //     });
// //   } catch (error) {
// //     res.status(500).json({ success: false, message: error.message });
// //   }
// // };

// exports.saveStage = async (req, res) => {
//   try {
//     const { stageId } = req.body;
//     const userId = req.user.id;

//     if (!stageId) {
//       return res.status(400).json({ success: false, message: "Stage ID is required" });
//     }

//     const user = await User.findByIdAndUpdate(
//       userId,
//       { stage: stageId },
//       { new: true }
//     );

//     res.json({
//       success: true,
//       message: "Stage saved successfully",
//       stage: user.stage
//     });
//   } catch (error) {
//     console.error("Save Stage Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
// // ══════════════════════════════════════════════════════════════
// //  STEP 3 — Get coding-level options
// //  GET /api/auth/signup/coding-levels
// //  Auth: None
// // ══════════════════════════════════════════════════════════════
// // ====================== STEP 3 — GET CODING LEVELS ======================
// exports.getCodingLevels = asyncHandler(async (_req, res) => {
//   res.json({
//     success: true,
//     step: 3,
//     question: 'Do you know how to code?',
//     data: User.CODING_LEVELS.map(level => ({
//       name: level,           // agar id chahiye to baad mein dynamic bana sakte hain
//     }))
//   });
// });

// // ====================== SAVE CODING LEVEL ======================
// exports.saveCodingLevel = asyncHandler(async (req, res) => {
//   try {
//     const { codingLevel } = req.body;
//     const userId = req.user.id;

//     if (!codingLevel) {
//       return res.status(400).json({ success: false, message: "Coding level is required" });
//     }

//     if (!User.CODING_LEVELS.includes(codingLevel)) {
//       return res.status(400).json({ success: false, message: "Invalid coding level" });
//     }

//     const user = await User.findByIdAndUpdate(
//       userId,
//       { codingLevel },
//       { new: true }
//     );

//     res.json({
//       success: true,
//       message: "Coding level saved successfully",
//       codingLevel: user.codingLevel
//     });
//   } catch (error) {
//     console.error("Save Coding Level Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// });

// // ══════════════════════════════════════════════════════════════
// //  STEP 4 — Get business interest options
// //  GET /api/auth/signup/business-interests
// //  Auth: None
// // ══════════════════════════════════════════════════════════════
// // ====================== STEP 4 — GET BUSINESS INTERESTS ======================
// exports.getBusinessInterests = asyncHandler(async (_req, res) => {
//   res.json({
//     success: true,
//     step: 4,
//     question: 'What types of businesses are you most interested in running?',
//     hint: 'Select all that apply',
//     data: User.BUSINESS_INTERESTS.map(interest => ({
//       name: interest
//     }))
//   });
// });

// // ====================== SAVE BUSINESS INTERESTS ======================
// exports.saveBusinessInterests = asyncHandler(async (req, res) => {
//   const { businessInterests } = req.body;   // array expected
//   const userId = req.user.id;

//   if (!Array.isArray(businessInterests)) {
//     return res.status(400).json({ success: false, message: "Business interests must be an array" });
//   }

//   // Validate interests
//   const validInterests = businessInterests.filter(i => 
//     User.BUSINESS_INTERESTS.includes(i)
//   );

//   const user = await User.findByIdAndUpdate(
//     userId,
//     { businessInterests: validInterests },
//     { new: true }
//   );

//   res.json({
//     success: true,
//     message: "Business interests saved successfully",
//     businessInterests: user.businessInterests
//   });
// });

// // ══════════════════════════════════════════════════════════════
// //  STEP 5 — Profile info  (no separate API — fields sent in final register)
// //  Fields: birthdate, location, twitterHandle
// //  Note:   Frontend collects these and sends in POST /api/auth/register
// // ══════════════════════════════════════════════════════════════

// // ══════════════════════════════════════════════════════════════
// //  STEP 6 — Final registration
// //  POST /api/auth/register
// //  Auth: None
// //  Body: all steps combined (see docs)
// // ══════════════════════════════════════════════════════════════
// // exports.register = asyncHandler(async (req, res) => {
// //   const {
// //     // Step 1
// //     username,
// //     // Step 2
// //     stage,
// //     // Step 3
// //     codingLevel,
// //     // Step 4
// //     businessInterests,          // array
// //     // Step 5
// //     birthdate,
// //     location,
// //     twitterHandle,
// //     // Step 6
// //     email,
// //     password,
// //   } = req.body;

// //   // ── Required fields ──────────────────────────────────
// //   const missing = [];
// //   if (!username) missing.push('username');
// //   if (!email)    missing.push('email');
// //   if (!password) missing.push('password');
// //   if (missing.length)
// //     return res.status(400).json({
// //       success: false,
// //       message: `Missing required fields: ${missing.join(', ')}`,
// //     });

// //   if (password.length < 6)
// //     return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });

// //   // ── Duplicate checks ─────────────────────────────────
// //   const [emailExists, usernameExists] = await Promise.all([
// //     User.findOne({ email: email.toLowerCase() }),
// //     User.findOne({ username: username.toLowerCase() }),
// //   ]);
// //   if (emailExists)    return res.status(400).json({ success: false, message: 'Email is already registered.' });
// //   if (usernameExists) return res.status(400).json({ success: false, message: 'Username is already taken.' });

// //   // ── Validate enum fields ──────────────────────────────
// //   if (stage        && !User.STAGES.includes(stage))
// //     return res.status(400).json({ success: false, message: 'Invalid stage value.' });
// //   if (codingLevel  && !User.CODING_LEVELS.includes(codingLevel))
// //     return res.status(400).json({ success: false, message: 'Invalid coding level.' });

// //   const validInterests = Array.isArray(businessInterests)
// //     ? businessInterests.filter(i => User.BUSINESS_INTERESTS.includes(i))
// //     : [];

// //   // ── Validate birthdate ────────────────────────────────
// //   let parsedBirthdate = null;
// //   if (birthdate) {
// //     parsedBirthdate = new Date(birthdate);
// //     if (isNaN(parsedBirthdate.getTime()))
// //       return res.status(400).json({ success: false, message: 'Invalid birthdate format. Use YYYY-MM-DD.' });

// //     const age = Math.floor((Date.now() - parsedBirthdate) / (365.25 * 24 * 60 * 60 * 1000));
// //     if (age < 13)
// //       return res.status(400).json({ success: false, message: 'You must be at least 13 years old.' });
// //   }

// //   // ── Sanitise twitter handle ───────────────────────────
// //   let cleanTwitter = (twitterHandle || '').trim();
// //   if (cleanTwitter.startsWith('@')) cleanTwitter = cleanTwitter.slice(1);

// //   // ── Create user ───────────────────────────────────────
// //   const user = await User.create({
// //     username:          username.toLowerCase().trim(),
// //     name:              username,           // name defaults to username; user can update later
// //     email:             email.toLowerCase().trim(),
// //     password,
// //     stage:             stage             || null,
// //     codingLevel:       codingLevel       || null,
// //     businessInterests: validInterests,
// //     birthdate:         parsedBirthdate,
// //     location:          (location        || '').trim(),
// //     twitterHandle:     cleanTwitter,
// //   });

// //   const token = signUserToken(user._id);

// //   res.status(201).json({
// //     success: true,
// //     message: 'Account created successfully! Welcome to TheBizIdeas 🚀',
// //     token,
// //     user: {
// //       id:                user._id,
// //       username:          user.username,
// //       name:              user.name,
// //       email:             user.email,
// //       stage:             user.stage,
// //       codingLevel:       user.codingLevel,
// //       businessInterests: user.businessInterests,
// //       birthdate:         user.birthdate,
// //       location:          user.location,
// //       twitterHandle:     user.twitterHandle,
// //       avatar:            user.avatar,
// //       createdAt:         user.createdAt,
// //     },
// //   });
// // });

// // ====================== COMPLETE REGISTRATION (Email + Password) ======================
// exports.register = asyncHandler(async (req, res) => {
//   const { email, password, birthdate, location, twitterHandle } = req.body;
//   const userId = req.user.id;

//   if (!email || !password) {
//     return res.status(400).json({ success: false, message: "Email and password are required to complete registration" });
//   }

//   const user = await User.findById(userId);
//   if (!user) return res.status(404).json({ success: false, message: "User not found" });

//   // Check if already completed
//   if (user.email) {
//     return res.status(400).json({ success: false, message: "Account already completed" });
//   }

//   // Duplicate email check
//   const emailExists = await User.findOne({ email: email.toLowerCase() });
//   if (emailExists) return res.status(400).json({ success: false, message: 'Email already registered.' });

//   user.email = email.toLowerCase().trim();
//   user.password = password;
//   user.birthdate = birthdate ? new Date(birthdate) : null;
//   user.location = location || '';
//   user.twitterHandle = twitterHandle ? twitterHandle.replace('@', '') : '';

//   await user.save();

//   const token = signUserToken(user._id);

//   res.json({
//     success: true,
//     message: "Registration completed successfully!",
//     token,
//     user
//   });
// });

// // ══════════════════════════════════════════════════════════════
// //  LOGIN
// //  POST /api/auth/login
// //  Auth: None
// // ══════════════════════════════════════════════════════════════
// exports.login = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password)
//     return res.status(400).json({ success: false, message: 'Email and password are required.' });

//   const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

//   if (!user || !(await user.comparePassword(password)))
//     return res.status(401).json({ success: false, message: 'Invalid email or password.' });

//   if (!user.isActive)
//     return res.status(401).json({ success: false, message: 'Account deactivated. Contact support.' });

//   const token = signUserToken(user._id);

//   res.json({
//     success: true,
//     message: 'Login successful!',
//     token,
//     user: {
//       id:                user._id,
//       username:          user.username,
//       name:              user.name,
//       email:             user.email,
//       stage:             user.stage,
//       codingLevel:       user.codingLevel,
//       businessInterests: user.businessInterests,
//       location:          user.location,
//       twitterHandle:     user.twitterHandle,
//       avatar:            user.avatar,
//     },
//   });
// });

// // ══════════════════════════════════════════════════════════════
// //  GET ME (current user profile)
// //  GET /api/auth/me
// //  Auth: Bearer token (user)
// // ══════════════════════════════════════════════════════════════
// exports.getMe = asyncHandler(async (req, res) => {
//   const user = await User.findById(req.user.id);
//   if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
//   res.json({ success: true, user });
// });

// // ══════════════════════════════════════════════════════════════
// //  UPDATE PROFILE
// //  PUT /api/auth/update-profile
// //  Auth: Bearer token (user)
// // ══════════════════════════════════════════════════════════════
// exports.updateProfile = asyncHandler(async (req, res) => {
//   const allowed = ['name', 'bio', 'avatar', 'location', 'twitterHandle',
//                    'stage', 'codingLevel', 'businessInterests'];
//   const updates = {};
//   allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

//   // Clean twitter handle
//   if (updates.twitterHandle?.startsWith('@'))
//     updates.twitterHandle = updates.twitterHandle.slice(1);

//   const user = await User.findByIdAndUpdate(req.user.id, updates, {
//     new: true, runValidators: true,
//   });
//   res.json({ success: true, message: 'Profile updated.', user });
// });

// // ══════════════════════════════════════════════════════════════
// //  CHANGE PASSWORD
// //  PUT /api/auth/change-password
// //  Auth: Bearer token (user)
// // ══════════════════════════════════════════════════════════════
// exports.changePassword = asyncHandler(async (req, res) => {
//   const { currentPassword, newPassword } = req.body;

//   if (!currentPassword || !newPassword)
//     return res.status(400).json({ success: false, message: 'Both fields are required.' });
//   if (newPassword.length < 6)
//     return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });

//   const user = await User.findById(req.user.id).select('+password');
//   if (!(await user.comparePassword(currentPassword)))
//     return res.status(400).json({ success: false, message: 'Current password is incorrect.' });

//   user.password = newPassword;
//   await user.save();

//   res.json({ success: true, message: 'Password changed successfully.' });
// });


const jwt   = require('jsonwebtoken');
const User  = require('../models/User');
const Stage = require('../models/Stage');
const Skill = require("../models/Skill")
const { asyncHandler } = require('../middleware/auth');

const signUserToken = (id) =>
  jwt.sign({ id, type: 'user' }, process.env.JWT_USER_SECRET, {
    expiresIn: process.env.JWT_USER_EXPIRE || '7d',
  });

// ══════════════════════════════════════════════════════════════════
//  STEP 1 — Username check + user create
//  POST /api/auth/check-username
//  Body: { "username": "helly" }
//  Auth: None
//
//  Logic:
//    - Username valid hai aur available → user create karo (incomplete),
//      token return karo → frontend ye token baaki steps mein use karega
//    - Username already taken (with email) → error
//    - Username taken but incomplete (no email) → same user ka token return
// ══════════════════════════════════════════════════════════════════
exports.checkUsername = asyncHandler(async (req, res) => {
  const { username } = req.body;

  if (!username || typeof username !== 'string')
    return res.status(400).json({ success: false, available: false, message: 'Username is required.' });

  const trimmed = username.toLowerCase().trim();

  if (trimmed.length < 3)
    return res.status(400).json({ success: false, available: false, message: 'Min 3 characters required.' });
  if (trimmed.length > 30)
    return res.status(400).json({ success: false, available: false, message: 'Max 30 characters allowed.' });
  if (!/^[a-z0-9_]+$/.test(trimmed))
    return res.status(400).json({ success: false, available: false, message: 'Only letters, numbers and underscores allowed.' });

  // Check if username already taken
  const existingUser = await User.findOne({ username: trimmed });

  if (existingUser) {
    // Already a complete registered user (has email)
    if (existingUser.email) {
      return res.status(400).json({
        success: false,
        available: false,
        message: 'Username already taken.',
      });
    }

    // Incomplete user from a previous signup attempt — return their token
    const token = signUserToken(existingUser._id);
    return res.json({
      success:   true,
      available: true,
      message:   'Username is available! 🎉',
      token,
      user: { id: existingUser._id, username: existingUser.username },
    });
  }

  // Fresh username — create incomplete user record
  const newUser = new User({
    username: trimmed,
    name:     trimmed,
    // email & password intentionally NOT set yet (step 6)
  });
  // Skip validation so that missing email/password doesn't fail
  await newUser.save({ validateBeforeSave: false });

  const token = signUserToken(newUser._id);

  res.status(201).json({
    success:   true,
    available: true,
    message:   'Username is available! 🎉',
    token,
    user: { id: newUser._id, username: newUser.username },
  });
});

// ══════════════════════════════════════════════════════════════════
//  STEP 2a — Get stage options
//  POST /api/auth/signup/stages   (POST kyunki token body se bhi aa sakta)
//  Auth: Bearer token (user — even incomplete)
// ══════════════════════════════════════════════════════════════════
exports.getStages = asyncHandler(async (req, res) => {
  const stages = await Stage.find({ isActive: true }).sort({ order: 1, name: 1 });

  res.json({
    success:  true,
    step:     2,
    question: "Which best describes the stage you're at right now?",
    data:     stages.map(s => ({ id: s._id, name: s.name, description: s.description || '' })),
  });
});

// ══════════════════════════════════════════════════════════════════
//  STEP 2b — Save selected stage to user
//  POST /api/auth/signup/save-stage
//  Body: { "stageId": "69fc70189ef725f1e5a91860" }
//  Auth: Bearer token (user)
// ══════════════════════════════════════════════════════════════════
exports.saveStage = asyncHandler(async (req, res) => {
  const { stageId } = req.body;

  if (!stageId)
    return res.status(400).json({ success: false, message: 'stageId is required.' });

  // Validate stageId exists in Stage collection
  const stageExists = await Stage.findById(stageId);
  if (!stageExists)
    return res.status(400).json({ success: false, message: 'Invalid stage ID.' });

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { stage: stageId },
    { new: true }
  ).populate('stage', 'name description');

  res.json({
    success: true,
    message: 'Stage saved successfully.',
    stage:   user.stage,
  });
});

// ══════════════════════════════════════════════════════════════════
//  STEP 3a — Get coding level options
//  POST /api/auth/signup/coding-levels
//  Auth: Bearer token (user)
// ══════════════════════════════════════════════════════════════════
exports.getCodingLevels = asyncHandler(async (req, res) => {
  res.json({
    success:  true,
    step:     3,
    question: 'Do you know how to code?',
    data:     User.CODING_LEVELS.map(level => ({ name: level })),
  });
});

// ══════════════════════════════════════════════════════════════════
//  STEP 3b — Save coding level
//  POST /api/auth/signup/save-coding-level
//  Body: { "codingLevel": "Yes, and I'm beginner" }
//  Auth: Bearer token (user)
// ══════════════════════════════════════════════════════════════════
exports.saveCodingLevel = asyncHandler(async (req, res) => {
  const { codingLevel } = req.body;

  if (!codingLevel)
    return res.status(400).json({ success: false, message: 'codingLevel is required.' });

  if (!User.CODING_LEVELS.includes(codingLevel))
    return res.status(400).json({ success: false, message: 'Invalid coding level value.' });

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { codingLevel },
    { new: true }
  );

  res.json({
    success:     true,
    message:     'Coding level saved successfully.',
    codingLevel: user.codingLevel,
  });
});

// ══════════════════════════════════════════════════════════════════
//  STEP 4a — Get business interest options
//  POST /api/auth/signup/business-interests
//  Auth: Bearer token (user)
// ══════════════════════════════════════════════════════════════════
// ====================== STEP 4 — GET BUSINESS INTERESTS (Dynamic) ======================
exports.getBusinessInterests = async (req, res) => {
  try {
    const businessInterests = await Skill.find({ isActive: true })
      .sort({ name: 1 });

    res.json({
      success: true,
      step: 4,
      question: 'What types of businesses are you most interested in running?',
      hint: 'Select all that apply',
      data: businessInterests.map(item => ({
        id: item._id,
        name: item.name,
        // category: item.category || null   // agar category hai to add kar sakte ho
      }))
    });
  } catch (error) {
    console.error("Get Business Interests Error:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error while fetching business interests" 
    });
  }
};
// ══════════════════════════════════════════════════════════════════
//  STEP 4b — Save business interests
//  POST /api/auth/signup/save-business-interests
//  Body: { "businessInterests": ["SaaS / Software", "Mobile App"] }
//  Auth: Bearer token (user)
// ══════════════════════════════════════════════════════════════════
exports.saveBusinessInterests = asyncHandler(async (req, res) => {
  const { businessInterests } = req.body;

  if (!Array.isArray(businessInterests)) {
    return res.status(400).json({
      success: false,
      message: 'businessInterests must be an array.',
    });
  }

  // Check valid skills from DB
  const skills = await Skill.find({
    name: { $in: businessInterests },
    isActive: true,
  });

  const valid = skills.map(skill => skill.name);

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { businessInterests: valid },
    { new: true }
  );

  res.json({
    success: true,
    message: 'Business interests saved successfully.',
    businessInterests: user.businessInterests,
  });
});

// ══════════════════════════════════════════════════════════════════
//  STEP 5 — Save profile info
//  POST /api/auth/signup/save-profile
//  Body: {
//    "birthdate": "2002-05-15",
//    "location": "Ahmedabad",
//    "twitterHandle": "helly_dev"
//  }
//  Auth: Bearer token
// ══════════════════════════════════════════════════════════════════

exports.saveProfileInfo = asyncHandler(async (req, res) => {
  const { birthdate, location, twitterHandle } = req.body;

  // Validation
  if (!birthdate) {
    return res.status(400).json({
      success: false,
      message: 'Birthdate is required.',
    });
  }

  if (!location || !location.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Location is required.',
    });
  }

  if (!twitterHandle || !twitterHandle.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Twitter handle is required.',
    });
  }

  // Optional cleanup
  const cleanTwitter = twitterHandle.replace('@', '').trim();

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      birthdate: new Date(birthdate),
      location: location.trim(),
      twitterHandle: cleanTwitter,
    },
    { new: true }
  );

  res.json({
    success: true,
    message: 'Profile information saved successfully.',
    data: {
      birthdate: user.birthdate,
      location: user.location,
      twitterHandle: user.twitterHandle,
    },
  });
});
// ══════════════════════════════════════════════════════════════════
//  STEP 6 — Complete registration (email + password + step5 fields)
//  POST /api/auth/register
//  Body: { email, password, birthdate, location, twitterHandle }
//  Auth: Bearer token (user — incomplete user)
//
//  This COMPLETES the user record that was created in Step 1
// ══════════════════════════════════════════════════════════════════
exports.register = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password are required.' });

  if (password.length < 6)
    return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });

  // Get current user (created at step 1)
  const user = await User.findById(req.user.id).select('+password');
  if (!user)
    return res.status(404).json({ success: false, message: 'User not found.' });

  // Already completed?
  if (user.email)
    return res.status(400).json({ success: false, message: 'Registration already completed.' });

  // Email duplicate check
  const emailExists = await User.findOne({ email: email.toLowerCase() });
  if (emailExists)
    return res.status(400).json({ success: false, message: 'Email is already registered.' });

 

  // Complete the user record
  user.email         = email.toLowerCase().trim();
  user.password      = password;         // pre-save hook will hash it
  

  await user.save();

  // Fresh token (same user, now complete)
  const token = signUserToken(user._id);

  // Return user without password
  const userObj = await User.findById(user._id).populate('stage', 'name description');

  res.json({
    success: true,
    message: 'Registration completed successfully! Welcome to TheBizIdeas 🚀',
    token,
    user: {
      id:                userObj._id,
      username:          userObj.username,
      name:              userObj.name,
      email:             userObj.email,
      stage:             userObj.stage,
      codingLevel:       userObj.codingLevel,
      businessInterests: userObj.businessInterests,
      birthdate:         userObj.birthdate,
      location:          userObj.location,
      twitterHandle:     userObj.twitterHandle,
      avatar:            userObj.avatar,
      createdAt:         userObj.createdAt,
    },
  });
});

// ══════════════════════════════════════════════════════════════════
//  LOGIN
//  POST /api/auth/login
//  Body: { email, password }
//  Auth: None
// ══════════════════════════════════════════════════════════════════
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ success: false, message: 'Email and password are required.' });

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user || !(await user.comparePassword(password)))
    return res.status(401).json({ success: false, message: 'Invalid email or password.' });

  if (!user.isActive)
    return res.status(401).json({ success: false, message: 'Account deactivated. Contact support.' });

  const token = signUserToken(user._id);

  const populated = await User.findById(user._id).populate('stage', 'name description');

  res.json({
    success: true,
    message: 'Login successful!',
    token,
    user: {
      id:                populated._id,
      username:          populated.username,
      name:              populated.name,
      email:             populated.email,
      stage:             populated.stage,
      codingLevel:       populated.codingLevel,
      businessInterests: populated.businessInterests,
      location:          populated.location,
      twitterHandle:     populated.twitterHandle,
      avatar:            populated.avatar,
    },
  });
});

// ══════════════════════════════════════════════════════════════════
//  GET ME
//  GET /api/auth/me
//  Auth: Bearer token (user)
// ══════════════════════════════════════════════════════════════════
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('stage', 'name description');
  if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
  res.json({ success: true, user });
});

// ══════════════════════════════════════════════════════════════════
//  UPDATE PROFILE
//  PUT /api/auth/update-profile
//  Auth: Bearer token (user)
// ══════════════════════════════════════════════════════════════════
exports.updateProfile = asyncHandler(async (req, res) => {
  const allowed = ['name', 'bio', 'avatar', 'location', 'twitterHandle',
                   'stage', 'codingLevel', 'businessInterests'];
  const updates = {};
  allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  if (updates.twitterHandle?.startsWith('@'))
    updates.twitterHandle = updates.twitterHandle.slice(1);

  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true })
                         .populate('stage', 'name description');
  res.json({ success: true, message: 'Profile updated.', user });
});

// ══════════════════════════════════════════════════════════════════
//  CHANGE PASSWORD
//  PUT /api/auth/change-password
//  Auth: Bearer token (user)
// ══════════════════════════════════════════════════════════════════
// exports.changePassword = asyncHandler(async (req, res) => {
//   const { currentPassword, newPassword } = req.body;

//   if (!currentPassword || !newPassword)
//     return res.status(400).json({ success: false, message: 'Both fields are required.' });
//   if (newPassword.length < 6)
//     return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });

//   const user = await User.findById(req.user.id).select('+password');
//   if (!(await user.comparePassword(currentPassword)))
//     return res.status(400).json({ success: false, message: 'Current password is incorrect.' });

//   user.password = newPassword;
//   await user.save();
//   res.json({ success: true, message: 'Password changed successfully.' });
// });


exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // Check required fields
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'Current password, new password and confirm password are required.',
    });
  }

  // Password length validation
  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 6 characters.',
    });
  }

  // New & confirm password match check
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: 'New password and confirm password do not match.',
    });
  }

  // Get user with password
  const user = await User.findById(req.user.id).select('+password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found.',
    });
  }

  // Check current password
  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: 'Current password is incorrect.',
    });
  }

  // Prevent same password
  if (currentPassword === newPassword) {
    return res.status(400).json({
      success: false,
      message: 'New password must be different from current password.',
    });
  }

  // Update password
  user.password = newPassword;

  await user.save();

  res.json({
    success: true,
    message: 'Password changed successfully.',
  });
});



// ADD / UPDATE SOCIAL LINK
exports.addSocialLink = asyncHandler(async (req, res) => {

    const { platform, link } = req.body;

    if (!platform || !link) {
        return res.status(400).json({
            success: false,
            message: 'Platform and link are required.'
        });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found.'
        });
    }

    // check existing platform
    const existingLink = user.socialLinks.find(
        item => item.platform === platform
    );

    // update existing
    if (existingLink) {

        existingLink.link = link;

    } else {

        // add new
        user.socialLinks.push({
            platform,
            link
        });
    }

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Social link saved successfully.',
        data: user.socialLinks
    });
});



// GET SOCIAL LINKS
exports.getSocialLinks = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user.id)
        .select('socialLinks');

    res.status(200).json({
        success: true,
        data: user.socialLinks || []
    });
});



// DELETE SOCIAL LINK
exports.deleteSocialLink = asyncHandler(async (req, res) => {

    const { platform } = req.params;

    const user = await User.findById(req.user.id);

    user.socialLinks = user.socialLinks.filter(
        item => item.platform !== platform
    );

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Social link deleted successfully.',
        data: user.socialLinks
    });
});

exports.editsocialLink = asyncHandler(async (req, res) => {

    const { platform } = req.params;
    const { link } = req.body;

    if (!link) {
        return res.status(400).json({
            success: false,
            message: 'Link is required.'
        });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: 'User not found.'
        });
    }

    // find social link
    const socialLink = user.socialLinks.find(
        item => item.platform === platform
    );

    if (!socialLink) {
        return res.status(404).json({
            success: false,
            message: 'Social link not found.'
        });
    }

    // update link
    socialLink.link = link;

    await user.save();

    res.status(200).json({
        success: true,
        message: 'Social link updated successfully.',
        data: user.socialLinks
    });

});


exports.editdesctiptionprofile = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  // Find logged in user
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Update name
  if (name) {
    user.name = name.trim();
  }

  // Update description
  if (description) {
    user.description = description.trim();
  }

  // Update profile photo
  // multer upload field name = Profilephoto
  if (req.file) {
    user.Profilephoto = `/uploads/profile/${req.file.filename}`;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: {
      _id: user._id,
      name: user.name,
      description: user.description,
      Profilephoto: user.Profilephoto,
    },
  });
});