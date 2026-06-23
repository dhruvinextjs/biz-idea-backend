const express = require('express');
const router = express.Router();
const { getNotificationSettings, updateNotificationSettings } = require('../controllers/Notificationcontroller');
const { protect } = require('../middleware/auth'); // aapka JWT auth middleware

// GET  /api/user/notification-settings
router.get('/notification-settings', protect, getNotificationSettings);

// PUT  /api/user/notification-settings
router.put('/notification-settings', protect, updateNotificationSettings);

module.exports = router;
