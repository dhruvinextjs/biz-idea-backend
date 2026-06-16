const BusinessIdea = require('../models/BusinessIdea');
const { asyncHandler } = require('../middleware/auth');

// Helper to build filter query
const buildFilter = (query, type) => {
  const filter = { isActive: true, type };

  if (query.investment) {
    const ranges = { '$0 - $2K': [0, 2000], '$2K - $5K': [2000, 5000], '$5K - $20K': [5000, 20000], '$20K+': [20000, Infinity] };
    const range = ranges[query.investment];
    if (range) {
      filter.investmentMin = { $gte: range[0] };
      if (range[1] !== Infinity) filter.investmentMax = { $lte: range[1] };
    }
  }

  if (query.industry) filter.category = query.industry;
  if (query.teamSize) filter.teamSize = query.teamSize;

  if (query.profitMargin) {
    const margins = { '0-20%': [0, 20], '21-50%': [21, 50], '51-80%': [51, 80], '80%+': [80, 100] };
    const range = margins[query.profitMargin];
    if (range) filter.profitMargin = { $gte: range[0], $lte: range[1] };
  }

  if (query.search) filter.title = { $regex: query.search, $options: 'i' };

  return filter;
};

// @desc    Get all ideas (business/app/startup)
// @route   GET /api/ideas?type=business&page=1&limit=9
exports.getIdeas = asyncHandler(async (req, res) => {
  const type = req.query.type || 'business';
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const skip = (page - 1) * limit;

  const filter = buildFilter(req.query, type);
  const total = await BusinessIdea.countDocuments(filter);
  const ideas = await BusinessIdea.find(filter).sort({ isFeatured: -1, createdAt: -1 }).skip(skip).limit(limit);

  res.json({
    success: true,
    count: ideas.length,
    total,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    data: ideas,
  });
});

// @desc    Get single idea
// @route   GET /api/ideas/:id
exports.getIdea = asyncHandler(async (req, res) => {
  const idea = await BusinessIdea.findOne({ $or: [{ _id: req.params.id }, { slug: req.params.id }], isActive: true });
  if (!idea) return res.status(404).json({ success: false, message: 'Idea not found' });
  res.json({ success: true, data: idea });
});

// @desc    Upvote idea
// @route   POST /api/ideas/:id/upvote
exports.upvoteIdea = asyncHandler(async (req, res) => {
  const idea = await BusinessIdea.findById(req.params.id);
  if (!idea) return res.status(404).json({ success: false, message: 'Idea not found' });

  const alreadyUpvoted = idea.upvotedBy.includes(req.user.id);
  if (alreadyUpvoted) {
    idea.upvotes -= 1;
    idea.upvotedBy.pull(req.user.id);
  } else {
    idea.upvotes += 1;
    idea.upvotedBy.push(req.user.id);
  }

  await idea.save();
  res.json({ success: true, upvotes: idea.upvotes, upvoted: !alreadyUpvoted });
});

// @desc    Get featured ideas for homepage
// @route   GET /api/ideas/featured
exports.getFeaturedIdeas = asyncHandler(async (req, res) => {
  const businessIdeas = await BusinessIdea.find({ isActive: true, type: 'business' }).sort({ isFeatured: -1, upvotes: -1 }).limit(5);
  const appIdeas = await BusinessIdea.find({ isActive: true, type: 'app' }).sort({ isFeatured: -1, upvotes: -1 }).limit(5);
  const startupIdeas = await BusinessIdea.find({ isActive: true, type: 'startup' }).sort({ isFeatured: -1, upvotes: -1 }).limit(5);

  res.json({
    success: true,
    data: { businessIdeas, appIdeas, startupIdeas }
  });
});


exports.toggleIdeaLike = async (req, res) => {
  try {
    const idea = await BusinessIdea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: "Idea not found",
      });
    }

    const userId = req.user._id;

    const alreadyLiked = idea.likes.includes(userId);

    if (alreadyLiked) {
      idea.likes = idea.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      idea.likes.push(userId);
    }

    await idea.save();

    res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      totalLikes: idea.likes.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.toggleIdeaDislike = async (req, res) => {
  try {
    const idea = await BusinessIdea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: "Idea not found",
      });
    }

    const userId = req.user._id;

    const alreadyDisliked = idea.dislikes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyDisliked) {
      idea.dislikes = idea.dislikes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      // remove like first
      idea.likes = idea.likes.filter(
        (id) => id.toString() !== userId.toString()
      );

      idea.dislikes.push(userId);
    }

    await idea.save();

    res.json({
      success: true,
      disliked: !alreadyDisliked,
      totalLikes: idea.likes.length,
      totalDislikes: idea.dislikes.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};