const express = require('express');
const router = express.Router();
const { getIdeas, getIdea, upvoteIdea, getFeaturedIdeas } = require('../controllers/ideaController');
const { protect } = require('../middleware/auth');

router.get('/featured', getFeaturedIdeas);
router.get('/', getIdeas);
router.get('/:id', getIdea);
router.post('/:id/upvote', protect, upvoteIdea);

module.exports = router;
