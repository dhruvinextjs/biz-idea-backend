const express = require('express');
const router = express.Router();
const {
  adminLogin, getSubAdmins, createSubAdmin,
  updateSubAdmin, deleteSubAdmin, getPermissions, getAdminMe,
} = require('../../controllers/admin/adminAuthController');
const { protectAdmin, superAdminOnly } = require('../../middleware/auth');

// Public
router.post('/login', adminLogin);

// Protected (any admin)
router.get('/me', protectAdmin, getAdminMe);
router.get('/permissions', protectAdmin, getPermissions);

// Super admin only — sub-admin management
router.get('/sub-admins', protectAdmin, superAdminOnly, getSubAdmins);
router.post('/sub-admins', protectAdmin, superAdminOnly, createSubAdmin);
router.put('/sub-admins/:id', protectAdmin, superAdminOnly, updateSubAdmin);
router.delete('/sub-admins/:id', protectAdmin, superAdminOnly, deleteSubAdmin);

module.exports = router;
