const express = require('express');
const router = express.Router();

const privacyPolicyController = require('../controllers/privacyPolicyController');

router.get('/', privacyPolicyController.getPrivacyPolicy);

module.exports = router;