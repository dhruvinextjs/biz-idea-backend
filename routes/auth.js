// const express = require('express');
// const router  = express.Router();
// const {
//   checkUsername,
//   getStages,
//   getCodingLevels,
//   getBusinessInterests,
//   register,
//   login,
//   getMe,
//   updateProfile,
//   changePassword,
//   addStage,
//   saveStage,
// } = require('../controllers/authController');
// const { protect } = require('../middleware/auth');

// // ── Signup step helpers (GET — no body, no auth) ─────────────
// router.get('/check-username', checkUsername);   // Step 1
// router.post('/signup/stages', getStages);       // Step 2
// router.post('/signup/save-stage', saveStage);

// router.get('/signup/coding-levels',     getCodingLevels); // Step 3
// router.get('/signup/business-interests',getBusinessInterests); // Step 4
// // Step 5 fields (birthdate, location, twitter) → sent directly in register body

// // ── Auth ─────────────────────────────────────────────────────
// router.post('/register', register); // Step 6 (final)
// router.post('/login',    login);

// // ── Protected (requires user JWT) ────────────────────────────
// router.get ('/me',              protect, getMe);
// router.put ('/update-profile',  protect, updateProfile);
// router.put ('/change-password', protect, changePassword);

// module.exports = router;

const express = require('express');
const router = express.Router();
const {
  checkUsername,
  getStages,
  saveStage,
  getCodingLevels,
  saveCodingLevel,
  getBusinessInterests,
  saveBusinessInterests,
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  saveProfileInfo,
  addSocialLink,
  getSocialLinks,
  deleteSocialLink,
  editdesctiptionprofile,
  editsocialLink,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require("../middleware/upload")

// ─────────────────────────────────────────────────────────
//  STEP 1 — Username check + user creation
//  POST (body me username bhejo)
// ─────────────────────────────────────────────────────────
router.post('/check-username', checkUsername);

// ─────────────────────────────────────────────────────────
//  STEP 2 — Stage
//  GET options  → POST /signup/stages
//  Save choice  → POST /signup/save-stage  [token required]
// ─────────────────────────────────────────────────────────
router.post('/signup/stages', protect, getStages);
router.post('/signup/save-stage', protect, saveStage);

// ─────────────────────────────────────────────────────────
//  STEP 3 — Coding level
//  GET options  → POST /signup/coding-levels
//  Save choice  → POST /signup/save-coding-level  [token required]
// ─────────────────────────────────────────────────────────
router.post('/signup/coding-levels', protect, getCodingLevels);
router.post('/signup/save-coding-level', protect, saveCodingLevel);

// ─────────────────────────────────────────────────────────
//  STEP 4 — Business interests
//  GET options  → POST /signup/business-interests
//  Save choices → POST /signup/save-business-interests  [token required]
// ─────────────────────────────────────────────────────────
router.post('/signup/business-interests', protect, getBusinessInterests);
router.post('/signup/save-business-interests', protect, saveBusinessInterests);

// ─────────────────────────────────────────────────────────
//  STEP 5 — No API (frontend collects birthdate/location/twitter)
//  These fields are sent directly in Step 6 body
// ─────────────────────────────────────────────────────────

router.post('/signup/save-profile', protect, saveProfileInfo);

// ─────────────────────────────────────────────────────────
//  STEP 6 — Complete registration
//  Body: { email, password, birthdate, location, twitterHandle }
//  [token required — same token from step 1]
// ─────────────────────────────────────────────────────────
router.post('/register', protect, register);

// ─────────────────────────────────────────────────────────
//  LOGIN (already registered users)
// ─────────────────────────────────────────────────────────
router.post('/login', login);

// ─────────────────────────────────────────────────────────
//  PROFILE  [token required]
// ─────────────────────────────────────────────────────────
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);


router.post(
  '/add-social-link',
  protect,
  addSocialLink
);

router.get(
  '/get-social-links',
  protect,
  getSocialLinks
);

router.delete(
  '/delete-social-link/:platform',
  protect,
  deleteSocialLink
);

router.put(
  '/edit-social-link/:platform',
  protect,
  editsocialLink
);

router.post(
  '/edit-description-profile',
  protect,
  upload.single('Profilephoto'),
  editdesctiptionprofile
);

module.exports = router;
