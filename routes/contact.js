const express = require('express');
const router = express.Router();
const { submitContact, subscribe, unsubscribe } = require('../controllers/contactController');

// Contact form
router.post('/contact', submitContact);

// Newsletter
router.post('/newsletter/subscribe', subscribe);
router.post('/newsletter/unsubscribe', unsubscribe);

module.exports = router;
