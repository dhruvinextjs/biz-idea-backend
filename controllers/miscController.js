const Service = require('../models/Service');
const { FAQ, Testimonial, Tool } = require('../models/Misc');
const { asyncHandler } = require('../middleware/auth');

// SERVICES
exports.getServices = asyncHandler(async (req, res) => {
  const services = await Service.find({ isActive: true }).sort({ order: 1, createdAt: 1 });
  res.json({ success: true, count: services.length, data: services });
});

exports.getService = asyncHandler(async (req, res) => {
  const service = await Service.findOne({ _id: req.params.id, isActive: true });
  if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
  res.json({ success: true, data: service });
});

// FAQs
exports.getFAQs = asyncHandler(async (req, res) => {
  const faqs = await FAQ.find({ isActive: true }).sort({ order: 1 });
  res.json({ success: true, count: faqs.length, data: faqs });
});

// TESTIMONIALS
exports.getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await Testimonial.find({ isActive: true }).sort({ order: 1 });
  res.json({ success: true, count: testimonials.length, data: testimonials });
});

// TOOLS
exports.getTools = asyncHandler(async (req, res) => {
  const tools = await Tool.find({ isActive: true }).sort({ order: 1 });
  res.json({ success: true, count: tools.length, data: tools });
});

// HOMEPAGE - aggregated data for homepage
exports.getHomepageData = asyncHandler(async (req, res) => {
  const BusinessIdea = require('../models/BusinessIdea');
  const CaseStudy = require('../models/CaseStudy');
  const Post = require('../models/Post');
  const Blog = require('../models/Blog');

  const [featuredCaseStudies, recentPosts, businessIdeas, appIdeas, startupIdeas, services, testimonials, faqs] = await Promise.all([
    CaseStudy.find({ isActive: true }).sort({ isFeatured: -1, upvotes: -1 }).limit(3),
    Post.find({ isActive: true }).sort({ isPinned: -1, createdAt: -1 }).limit(8).select('-comments'),
    BusinessIdea.find({ isActive: true, type: 'business' }).sort({ isFeatured: -1 }).limit(5),
    BusinessIdea.find({ isActive: true, type: 'app' }).sort({ isFeatured: -1 }).limit(5),
    BusinessIdea.find({ isActive: true, type: 'startup' }).sort({ isFeatured: -1 }).limit(5),
    Service.find({ isActive: true }).sort({ order: 1 }).limit(3),
    Testimonial.find({ isActive: true }).sort({ order: 1 }).limit(3),
    FAQ.find({ isActive: true }).sort({ order: 1 }).limit(10),
  ]);

  res.json({
    success: true,
    data: { featuredCaseStudies, recentPosts, businessIdeas, appIdeas, startupIdeas, services, testimonials, faqs }
  });
});
