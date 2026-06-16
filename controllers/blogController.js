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

exports.toggleBlogLike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const userId = req.user._id;

    const alreadyLiked = blog.likes.some(
  (id) => id.toString() === userId.toString()
);

    if (alreadyLiked) {
      blog.likes = blog.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      blog.likes.push(userId);
    }

    await blog.save();

    res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      totalLikes: blog.likes.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.toggleBlogDislike = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const userId = req.user._id;

    const alreadyDisliked = blog.dislikes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyDisliked) {
      blog.dislikes = blog.dislikes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      blog.likes = blog.likes.filter(
        (id) => id.toString() !== userId.toString()
      );

      blog.dislikes.push(userId);
    }

    await blog.save();

    res.status(200).json({
      success: true,
      disliked: !alreadyDisliked,
      totalLikes: blog.likes.length,
      totalDislikes: blog.dislikes.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};