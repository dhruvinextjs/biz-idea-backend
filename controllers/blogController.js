const Blog = require('../models/Blog');
const { asyncHandler } = require('../middleware/auth');

// @desc    Get all blogs
// @route   GET /api/blogs
exports.getBlogs = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const skip = (page - 1) * limit;
  const filter = { isActive: true };
  if (req.query.category && req.query.category !== 'All') filter.category = req.query.category;
  if (req.query.search) filter.title = { $regex: req.query.search, $options: 'i' };

  const total = await Blog.countDocuments(filter);
  const blogs = await Blog.find(filter).sort({ isFeatured: -1, publishedAt: -1 }).skip(skip).limit(limit).select('-content');

  res.json({ success: true, count: blogs.length, total, totalPages: Math.ceil(total / limit), currentPage: page, data: blogs });
});

// @desc    Get single blog
// @route   GET /api/blogs/:id
exports.getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.findOne({ $or: [{ _id: req.params.id }, { slug: req.params.id }], isActive: true });
  if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
  res.json({ success: true, data: blog });
});

// @desc    Get featured blogs
// @route   GET /api/blogs/featured
exports.getFeaturedBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find({ isActive: true }).sort({ isFeatured: -1, publishedAt: -1 }).limit(4).select('-content');
  res.json({ success: true, data: blogs });
});
