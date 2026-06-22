const express = require('express');
const router = express.Router();
const { getIdeas, getIdea, upvoteIdea, getFeaturedIdeas,toggleIdeaLike,toggleIdeaDislike } = require('../controllers/ideaController');
const { protect } = require('../middleware/auth');

router.get('/featured', getFeaturedIdeas);
// router.get('/', getIdeas);
router.get('/', (req, res, next) => {
  console.log("IDEAS ROUTE HIT");
  next();
}, getIdeas);
router.get('/:id', getIdea);
router.post('/:id/upvote', protect, upvoteIdea);
router.post("/:id/like", protect, toggleIdeaLike);
router.post("/:id/dislike", protect, toggleIdeaDislike);

module.exports = router;
