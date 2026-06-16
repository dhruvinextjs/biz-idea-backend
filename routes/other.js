const express = require('express');
const router = express.Router();

// Case Studies
const csRouter = express.Router();
const { getCaseStudies, getCaseStudy, upvoteCaseStudy, getFeaturedCaseStudies } = require('../controllers/caseStudyController');
const { protect } = require('../middleware/auth');
const { toggleIdeaLike } = require('../controllers/ideaController');

csRouter.get('/featured', getFeaturedCaseStudies);
csRouter.get('/', getCaseStudies);
csRouter.get('/:id', getCaseStudy);
csRouter.post('/:id/upvote', protect, upvoteCaseStudy);

// Posts
const postRouter = express.Router();
const { getPosts, getPost, createPost, upvotePost, addComment, getRecentPosts } = require('../controllers/postController');
postRouter.get('/recent', getRecentPosts);
postRouter.get('/', getPosts);
postRouter.get('/:id', getPost);
postRouter.post('/', protect, createPost);
postRouter.post('/:id/upvote', protect, upvotePost);
postRouter.post('/:id/comments', protect, addComment);

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
