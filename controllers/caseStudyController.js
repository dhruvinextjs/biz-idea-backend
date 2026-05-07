const CaseStudy = require('../models/CaseStudy');
const { asyncHandler } = require('../middleware/auth');

// @desc    Get all case studies
// @route   GET /api/case-studies
exports.getCaseStudies = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = { isActive: true };
  if (req.query.industry) filter.industry = req.query.industry;
  if (req.query.search) filter.title = { $regex: req.query.search, $options: 'i' };

  if (req.query.revenueMin) filter.monthlyRevenue = { ...filter.monthlyRevenue, $gte: Number(req.query.revenueMin) };
  if (req.query.revenueMax) filter.monthlyRevenue = { ...filter.monthlyRevenue, $lte: Number(req.query.revenueMax) };
  if (req.query.sizeMin) filter.companySize = { ...filter.companySize, $gte: Number(req.query.sizeMin) };
  if (req.query.sizeMax) filter.companySize = { ...filter.companySize, $lte: Number(req.query.sizeMax) };

  let sortOption = { isFeatured: -1, createdAt: -1 };
  if (req.query.sort === 'oldest') sortOption = { createdAt: 1 };
  if (req.query.sort === 'highestRevenue') sortOption = { monthlyRevenue: -1 };
  if (req.query.sort === 'lowestRevenue') sortOption = { monthlyRevenue: 1 };

  const total = await CaseStudy.countDocuments(filter);
  const caseStudies = await CaseStudy.find(filter).sort(sortOption).skip(skip).limit(limit);

  res.json({ success: true, count: caseStudies.length, total, totalPages: Math.ceil(total / limit), currentPage: page, data: caseStudies });
});

// @desc    Get single case study
// @route   GET /api/case-studies/:id
exports.getCaseStudy = asyncHandler(async (req, res) => {
  const study = await CaseStudy.findOne({ $or: [{ _id: req.params.id }, { slug: req.params.id }], isActive: true });
  if (!study) return res.status(404).json({ success: false, message: 'Case study not found' });
  res.json({ success: true, data: study });
});

// @desc    Upvote case study
// @route   POST /api/case-studies/:id/upvote
exports.upvoteCaseStudy = asyncHandler(async (req, res) => {
  const study = await CaseStudy.findById(req.params.id);
  if (!study) return res.status(404).json({ success: false, message: 'Case study not found' });

  const alreadyUpvoted = study.upvotedBy.includes(req.user.id);
  if (alreadyUpvoted) {
    study.upvotes -= 1;
    study.upvotedBy.pull(req.user.id);
  } else {
    study.upvotes += 1;
    study.upvotedBy.push(req.user.id);
  }
  await study.save();
  res.json({ success: true, upvotes: study.upvotes, upvoted: !alreadyUpvoted });
});

// @desc    Get featured case studies
// @route   GET /api/case-studies/featured
exports.getFeaturedCaseStudies = asyncHandler(async (req, res) => {
  const studies = await CaseStudy.find({ isActive: true }).sort({ isFeatured: -1, upvotes: -1 }).limit(3);
  res.json({ success: true, data: studies });
});
