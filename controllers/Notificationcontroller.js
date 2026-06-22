const User = require('../models/User');
const { asyncHandler } = require('../middleware/auth');

/**
 * GET /api/user/notification-settings
 * User ki current notification preferences fetch karo
 */
exports.getNotificationSettings = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('emailNotifications');

  res.status(200).json({
    success: true,
    data: user.emailNotifications || {
      newBusinessIdeas: true,
      marketingEmails: false,
    },
  });
});

/**
 * PUT /api/user/notification-settings
 * Body: { newBusinessIdeas: true/false, marketingEmails: true/false }
 * Settings page ke UPDATE button se call hoga
 */
exports.updateNotificationSettings = asyncHandler(async (req, res) => {
  const { newBusinessIdeas, marketingEmails } = req.body;

  const update = {};

  if (typeof newBusinessIdeas === 'boolean') {
    update['emailNotifications.newBusinessIdeas'] = newBusinessIdeas;
  }
  if (typeof marketingEmails === 'boolean') {
    update['emailNotifications.marketingEmails'] = marketingEmails;
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    { $set: update },
    { new: true }
  ).select('emailNotifications');

  res.status(200).json({
    success: true,
    message: 'Notification settings updated successfully.',
    data: user.emailNotifications,
  });
});