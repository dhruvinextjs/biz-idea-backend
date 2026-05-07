const BusinessIdea = require('../models/BusinessIdea');
const CaseStudy = require('../models/CaseStudy');
const Post = require('../models/Post');
const Blog = require('../models/Blog');
const { asyncHandler } = require('../middleware/auth');

// @desc    Global search across all content
// @route   GET /api/search?q=keyword&type=all|ideas|case-studies|posts|blogs
exports.globalSearch = asyncHandler(async (req, res) => {
  const { q, type = 'all' } = req.query;

  if (!q || q.trim().length < 2) {
    return res.status(400).json({ success: false, message: 'Search query must be at least 2 characters' });
  }

  const regex = { $regex: q.trim(), $options: 'i' };
  const limit = 5;
  const results = {};

  if (type === 'all' || type === 'ideas') {
    results.ideas = await BusinessIdea.find({
      isActive: true,
      $or: [{ title: regex }, { description: regex }, { category: regex }, { tags: regex }]
    }).limit(limit).select('title description type category investmentMin investmentMax profitMargin image slug');
  }

  if (type === 'all' || type === 'case-studies') {
    results.caseStudies = await CaseStudy.find({
      isActive: true,
      $or: [{ title: regex }, { excerpt: regex }, { founderName: regex }, { companyName: regex }]
    }).limit(limit).select('title excerpt founderName companyName monthlyRevenue industry image slug');
  }

  if (type === 'all' || type === 'posts') {
    results.posts = await Post.find({
      isActive: true,
      $or: [{ title: regex }, { content: regex }]
    }).limit(limit).select('title upvotes commentCount authorName createdAt');
  }

  if (type === 'all' || type === 'blogs') {
    results.blogs = await Blog.find({
      isActive: true,
      $or: [{ title: regex }, { excerpt: regex }]
    }).limit(limit).select('title excerpt category author publishedAt image slug');
  }

  const totalResults = Object.values(results).reduce((acc, arr) => acc + (arr ? arr.length : 0), 0);

  res.json({
    success: true,
    query: q,
    totalResults,
    data: results,
  });
});
