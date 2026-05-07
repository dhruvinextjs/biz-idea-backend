const { Contact, Newsletter } = require('../models/Contact');
const { asyncHandler } = require('../middleware/auth');

// @desc    Submit contact form
// @route   POST /api/contact
exports.submitContact = asyncHandler(async (req, res) => {
  const { name, email, country, phone, projectRequirement } = req.body;

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required' });
  }

  // Simple math captcha validation handled on frontend, verify answer here if needed
  const contact = await Contact.create({ name, email, country, phone, projectRequirement });

  res.status(201).json({
    success: true,
    message: 'Message sent successfully! We will get back to you soon.',
    data: { id: contact._id },
  });
});

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter/subscribe
exports.subscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

  const existing = await Newsletter.findOne({ email });
  if (existing) {
    if (existing.isActive) {
      return res.status(400).json({ success: false, message: 'You are already subscribed!' });
    }
    existing.isActive = true;
    await existing.save();
    return res.json({ success: true, message: 'Welcome back! You have been re-subscribed.' });
  }

  await Newsletter.create({ email });
  res.status(201).json({ success: true, message: 'Successfully subscribed! Stay tuned for updates.' });
});

// @desc    Unsubscribe
// @route   POST /api/newsletter/unsubscribe
exports.unsubscribe = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' });

  await Newsletter.findOneAndUpdate({ email }, { isActive: false });
  res.json({ success: true, message: 'You have been unsubscribed.' });
});
