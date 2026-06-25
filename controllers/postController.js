const Post = require('../models/Post');
const { asyncHandler } = require('../middleware/auth');
const slugify = require('slugify');

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
  const { title, content, tags } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Title and content are required' });
  }

  const post = await Post.create({
    title,
     slug: slugify(title, { lower: true, strict: true }),
    content,
    image: req.file
  ? `/uploads/posts/${req.file.filename}`
  : null,                  // ← Image support
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

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Post deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.upvotePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

  const alreadyUpvoted = post.upvotedBy.includes(req.user.id);
  if (alreadyUpvoted) { post.upvotes -= 1; post.upvotedBy.pull(req.user.id); }
  else { post.upvotes += 1; post.upvotedBy.push(req.user.id); }

  await post.save();
  res.json({ success: true, upvotes: post.upvotes, upvoted: !alreadyUpvoted });
});

// // @desc    Add comment
// // @route   POST /api/posts/:id/comments
exports.addComment = asyncHandler(async (req, res) => {
  const { content } = req.body;
  if (!content) return res.status(400).json({ success: false, message: 'Comment content required' });

  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ success: false, message: 'Post not found' });

  post.comments.push({ user: req.user.id, username: req.user.username || req.user.name, avatar: req.user.avatar, content });
  post.commentCount = post.comments.length;
  await post.save();

  res.status(201).json({ success: true, message: 'Comment added', comments: post.comments });
});

// @desc    Get homepage posts (recent)


exports.likeComment = asyncHandler(async (req, res) => {
  const { id, commentId } = req.params;

  const post = await Post.findById(id);

  if (!post) {
    return res.status(404).json({
      success: false,
      message: "Post not found"
    });
  }

  const comment = post.comments.id(commentId);

  if (!comment) {
    return res.status(404).json({
      success: false,
      message: "Comment not found"
    });
  }

  const alreadyLiked = comment.likedBy.some(
    userId => userId.toString() === req.user.id
  );

  if (alreadyLiked) {
    comment.likes -= 1;
    comment.likedBy.pull(req.user.id);
  } else {
    comment.likes += 1;
    comment.likedBy.push(req.user.id);
  }

  await post.save();

  res.status(200).json({
    success: true,
    liked: !alreadyLiked,
    likes: comment.likes
  });
});