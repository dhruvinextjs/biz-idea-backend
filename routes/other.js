const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Case Studies
const csRouter = express.Router();
const { getCaseStudies, getCaseStudy, upvoteCaseStudy, getFeaturedCaseStudies } = require('../controllers/caseStudyController');
const { protect } = require('../middleware/auth');
const { toggleIdeaLike } = require('../controllers/ideaController');

csRouter.get('/featured', getFeaturedCaseStudies);
csRouter.get('/', getCaseStudies);
csRouter.get('/:id', getCaseStudy);
csRouter.post('/:id/upvote', protect, upvoteCaseStudy);

const postStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/posts');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const postUpload = multer({
  storage: postStorage
});

// Posts
const postRouter = express.Router();
const { getPosts, getPost, createPost, upvotePost, addComment, getRecentPosts,deletePost,likeComment } = require('../controllers/postController');
postRouter.get('/recent', getRecentPosts);
postRouter.get('/', getPosts);
postRouter.get('/:id', getPost);
postRouter.post(
  '/',
  protect,
  postUpload.single('image'),
  createPost
);
postRouter.post('/:id/upvote', protect, upvotePost);
postRouter.post('/:id/comments', protect, addComment);
postRouter.delete('/:id', protect, deletePost);
postRouter.post(
  '/:id/comments/:commentId/like',
  protect,
  likeComment
);

// Blogs
const blogRouter = express.Router();

const {
  getBlogs,
  getBlog,
  getFeaturedBlogs,
  toggleBlogLike,
  toggleBlogDislike
} = require('../controllers/blogController');

blogRouter.get('/featured', getFeaturedBlogs);
blogRouter.get('/', getBlogs);
blogRouter.get('/:id', getBlog);

blogRouter.post('/:id/like', protect, toggleBlogLike);
blogRouter.post('/:id/dislike', protect, toggleBlogDislike);

// Misc
const miscRouter = express.Router();
const { getServices, getService, getFAQs, getTestimonials, getTools, getHomepageData } = require('../controllers/miscController');
const { globalSearch } = require('../controllers/searchController');
miscRouter.get('/homepage', getHomepageData);
miscRouter.get('/services', getServices);
miscRouter.get('/services/:id', getService);
miscRouter.get('/faqs', getFAQs);
miscRouter.get('/testimonials', getTestimonials);
miscRouter.get('/tools', getTools);
miscRouter.get('/search', globalSearch);

const privacyPolicyController = require('../controllers/privacyPolicyController');

router.get('/', privacyPolicyController.getPrivacyPolicy);


module.exports = { csRouter, postRouter, blogRouter, miscRouter,router };
