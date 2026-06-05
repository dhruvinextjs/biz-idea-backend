const Post = require('../models/Post');
const { asyncHandler } = require('../middleware/auth');

// @desc    Get all approved posts (community feed)
// @route   GET /api/posts
exports.getPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = { 
    isActive: true,
    status: 'approved'        // ← Only approved posts
  };

  if (req.query.search) {
    filter.title = { $regex: req.query.search, $options: 'i' };
  }

  const total = await Post.countDocuments(filter);
  const posts = await Post.find(filter)
    .sort({ isPinned: -1, createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('-comments');

  res.json({ 
    success: true, 
    count: posts.length, 
    total, 
    totalPages: Math.ceil(total / limit), 
    currentPage: page, 
    data: posts 
  });
});

// @desc    Get recent approved posts for homepage
// @route   GET /api/posts/recent
exports.getRecentPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ 
    isActive: true, 
    status: 'approved'        // ← Only approved
  })
    .sort({ isPinned: -1, createdAt: -1 })
    .limit(8)
    .select('-comments');

  res.json({ success: true, data: posts });
});

// @desc    Get single post (only if approved)
exports.getPost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  
  if (!post || !post.isActive || post.status !== 'approved') {
    return res.status(404).json({ success: false, message: 'Post not found' });
  }

  res.json({ success: true, data: post });
});

// @desc    Create post (goes to pending state)
// @route   POST /api/posts
exports.createPost = asyncHandler(async (req, res) => {
  const { title, content, tags, image } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Title and content are required' });
  }

  const post = await Post.create({
    title,
    content,
    image: image || null,                    // ← Image support
    tags: tags || [],
    author: req.user.id,
    authorName: req.user.username || req.user.name,
    authorAvatar: req.user.avatar,
    status: 'pending'                        // Default pending
  });

  res.status(201).json({ 
    success: true, 
    message: 'Post submitted for review. It will be visible after admin approval.',
    data: post 
  });
});

// ==================== ADMIN ROUTES ====================

// @desc    Get all pending posts (Admin only)
// @route   GET /api/posts/pending
exports.getPendingPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ status: 'pending' })
    .sort({ createdAt: -1 })
    .populate('author', 'username name avatar');

  res.json({ success: true, data: posts });
});

// @desc    Approve post
// @route   PUT /api/posts/:id/approve
exports.approvePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

  post.status = 'approved';
  post.approvedBy = req.user.id;
  post.approvedAt = Date.now();
  await post.save();

  res.json({ success: true, message: 'Post approved successfully', data: post });
});

// @desc    Reject post
// @route   PUT /api/posts/:id/reject
exports.rejectPost = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

  post.status = 'rejected';
  post.approvedBy = req.user.id;
  post.approvedAt = Date.now();
  await post.save();

  res.json({ success: true, message: 'Post rejected', data: post });
});

exports.upvotePost = asyncHandler(async (req, res) => { ... });   // (keep existing)
exports.addComment = asyncHandler(async (req, res) => { ... });   // (keep existing)