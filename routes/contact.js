const express = require('express');
const router = express.Router();
const { submitContact, subscribe, unsubscribe, getCaptcha } = require('../controllers/contactController');

// Contact form
router.post('/contact', submitContact);

router.get(
  "/captcha",
  getCaptcha
);

// Newsletter
router.post('/newsletter/subscribe', subscribe);
router.post('/newsletter/unsubscribe', unsubscribe);

module.exports = router;
