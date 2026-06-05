const { Contact, Newsletter } = require('../models/Contact');
const { asyncHandler } = require('../middleware/auth');
const Captcha = require("../models/Captcha");

exports.getCaptcha = asyncHandler(async(req,res)=>{

  const num1 = Math.floor(Math.random()*10)+1;
  const num2 = Math.floor(Math.random()*10)+1;

  const captcha = await Captcha.create({
    question:`${num1} x ${num2}`,
    answer:num1*num2
  });

  res.json({
    success:true,
    captchaId:captcha._id,
    question:captcha.question
  });

});

// @desc    Submit contact form
// @route   POST /api/contact
exports.submitContact = asyncHandler(async (req, res) => {

  const {
    name,
    email,
    country,
    phone,
    projectRequirement,
    captchaId,
    captchaAnswer
  } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success:false,
      message:"Name and Email required"
    });
  }

  const captcha = await Captcha.findById(captchaId);

  if(!captcha){
    return res.status(400).json({
      success:false,
      message:"Captcha expired"
    });
  }

  if(Number(captchaAnswer)!==captcha.answer){
    return res.status(400).json({
      success:false,
      message:"Invalid captcha"
    });
  }

  await Captcha.findByIdAndDelete(captchaId);

  const contact = await Contact.create({
    name,
    email,
    country,
    phone,
    projectRequirement
  });

  res.status(201).json({
    success:true,
    message:"Message sent successfully",
    data:contact
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
