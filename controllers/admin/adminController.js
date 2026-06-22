const BusinessIdea = require("../../models/BusinessIdea");
const CaseStudy = require("../../models/CaseStudy");
const Post = require("../../models/Post");
const Blog = require("../../models/Blog");
const Service = require("../../models/Service");
const { FAQ, Testimonial } = require("../../models/Misc");
const PrivacyPolicy = require("../../models/PrivacyPolicy");
const TermsCondition = require('../../models/TermsCondition');
const User = require("../../models/User");
const Admin = require("../../models/Admin");
const { Contact, Newsletter } = require("../../models/Contact");
const AboutPage = require('../../models/AboutPage');
const sendIdeaNotification = require('../../utils/sendIdeaNotification');


// ========== PANEL AUTH ==========
exports.getLogin = (req, res) => {
  if (req.session?.adminId) return res.redirect("/admin/dashboard");
  res.render("admin/login", {
    title: "Admin Login",
    error: req.flash("error"),
    success: req.flash("success"),
  });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email: email?.toLowerCase() }).select(
      "+password",
    );
    if (!admin || !(await admin.comparePassword(password))) {
      req.flash("error", "Invalid email or password.");
      return res.redirect("/admin/login");
    }
    if (!admin.isActive) {
      req.flash(
        "error",
        "Your admin account has been deactivated. Contact super admin.",
      );
      return res.redirect("/admin/login");
    }
    req.session.adminId = admin._id;
    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });
    res.redirect("/admin/dashboard");
  } catch (e) {
    req.flash("error", "Server error. Try again.");
    res.redirect("/admin/login");
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect("/admin/login"));
};

// ========== DASHBOARD ==========
exports.getDashboard = async (req, res) => {
  const [
    totalUsers,
    totalIdeas,
    totalCaseStudies,
    totalBlogs,
    totalPosts,
    totalServices,
    newContacts,
    newsletterSubs,
    recentUsers,
    recentIdeas,
  ] = await Promise.all([
    User.countDocuments(),
    BusinessIdea.countDocuments(),
    CaseStudy.countDocuments(),
    Blog.countDocuments(),
    Post.countDocuments(),
    Service.countDocuments(),
    Contact.countDocuments({ status: "new" }),
    Newsletter.countDocuments({ isActive: true }),
    User.find().sort({ createdAt: -1 }).limit(5),
    BusinessIdea.find().sort({ createdAt: -1 }).limit(5),
  ]);
  res.render("admin/dashboard", {
    title: "Dashboard",
    stats: {
      totalUsers,
      totalIdeas,
      totalCaseStudies,
      totalBlogs,
      totalPosts,
      totalServices,
      newContacts,
      newsletterSubs,
    },
    recentUsers,
    recentIdeas,
    error: req.flash("error"),
    success: req.flash("success"),
  });
};

// ========== IDEAS ==========
exports.getIdeas = async (req, res) => {
  const type = req.query.type || "business";
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const ideas = await BusinessIdea.find({ type })
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  const total = await BusinessIdea.countDocuments({ type });
  res.render("admin/ideas/index", {
    title: `${type.charAt(0).toUpperCase() + type.slice(1)} Ideas`,
    ideas,
    type,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    error: req.flash("error"),
    success: req.flash("success"),
  });
};
exports.getCreateIdea = (req, res) => {
  const type = req.query.type || "business";
  res.render("admin/ideas/form", {
    title: "Create Idea",
    idea: null,
    type,
    error: req.flash("error"),
  });
};
// exports.postCreateIdea = async (req, res) => {
//   try {
//     await BusinessIdea.create(req.body);
//     req.flash("success", "Idea created.");
//     res.redirect(`/admin/ideas?type=${req.body.type || "business"}`);
//   } catch (e) {
//     req.flash("error", e.message);
//     res.redirect("/admin/ideas/create?type=" + (req.body.type || "business"));
//   }
// };

exports.postCreateIdea = async (req, res) => {
  try {
    const idea = await BusinessIdea.create(req.body);
 
    // ✅ Idea create hone ke baad notification bhejo (async, non-blocking)
    sendIdeaNotification(idea).catch(err =>
      console.error('Notification error:', err.message)
    );
 
    req.flash('success', 'Idea created.');
    res.redirect(`/admin/ideas?type=${req.body.type || 'business'}`);
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/admin/ideas/create?type=' + (req.body.type || 'business'));
  }
};

exports.getEditIdea = async (req, res) => {
  const idea = await BusinessIdea.findById(req.params.id);
  if (!idea) {
    req.flash("error", "Not found");
    return res.redirect("/admin/ideas");
  }
  res.render("admin/ideas/form", {
    title: "Edit Idea",
    idea,
    type: idea.type,
    error: req.flash("error"),
  });
};
exports.postEditIdea = async (req, res) => {
  try {
    await BusinessIdea.findByIdAndUpdate(req.params.id, req.body);
    req.flash("success", "Idea updated.");
    res.redirect(`/admin/ideas?type=${req.body.type || "business"}`);
  } catch (e) {
    req.flash("error", e.message);
    res.redirect(`/admin/ideas/${req.params.id}/edit`);
  }
};
exports.deleteIdea = async (req, res) => {
  await BusinessIdea.findByIdAndDelete(req.params.id);
  req.flash("success", "Idea deleted.");
  res.redirect("/admin/ideas?type=" + (req.query.type || "business"));
};

// ========== CASE STUDIES ==========
exports.getCaseStudies = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const studies = await CaseStudy.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  const total = await CaseStudy.countDocuments();
  res.render("admin/case-studies/index", {
    title: "Case Studies",
    studies,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    error: req.flash("error"),
    success: req.flash("success"),
  });
};
exports.getCreateCaseStudy = (req, res) =>
  res.render("admin/case-studies/form", {
    title: "Create Case Study",
    study: null,
    error: req.flash("error"),
  });
exports.postCreateCaseStudy = async (req, res) => {
  try {
    await CaseStudy.create(req.body);
    req.flash("success", "Case study created.");
    res.redirect("/admin/case-studies");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/admin/case-studies/create");
  }
};
exports.getEditCaseStudy = async (req, res) => {
  const study = await CaseStudy.findById(req.params.id);
  if (!study) {
    req.flash("error", "Not found");
    return res.redirect("/admin/case-studies");
  }
  res.render("admin/case-studies/form", {
    title: "Edit Case Study",
    study,
    error: req.flash("error"),
  });
};
exports.postEditCaseStudy = async (req, res) => {
  try {
    await CaseStudy.findByIdAndUpdate(req.params.id, req.body);
    req.flash("success", "Updated.");
    res.redirect("/admin/case-studies");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect(`/admin/case-studies/${req.params.id}/edit`);
  }
};
exports.deleteCaseStudy = async (req, res) => {
  await CaseStudy.findByIdAndDelete(req.params.id);
  req.flash("success", "Deleted.");
  res.redirect("/admin/case-studies");
};

// ========== BLOGS ==========
exports.getBlogs = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const blogs = await Blog.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  const total = await Blog.countDocuments();
  res.render("admin/blogs/index", {
    title: "Blogs",
    blogs,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    error: req.flash("error"),
    success: req.flash("success"),
  });
};
exports.getCreateBlog = (req, res) =>
  res.render("admin/blogs/form", {
    title: "Create Blog",
    blog: null,
    error: req.flash("error"),
  });
exports.postCreateBlog = async (req, res) => {
  try {
    await Blog.create(req.body);
    req.flash("success", "Blog created.");
    res.redirect("/admin/blogs");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/admin/blogs/create");
  }
};
exports.getEditBlog = async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) {
    req.flash("error", "Not found");
    return res.redirect("/admin/blogs");
  }
  res.render("admin/blogs/form", {
    title: "Edit Blog",
    blog,
    error: req.flash("error"),
  });
};
exports.postEditBlog = async (req, res) => {
  try {
    await Blog.findByIdAndUpdate(req.params.id, req.body);
    req.flash("success", "Updated.");
    res.redirect("/admin/blogs");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect(`/admin/blogs/${req.params.id}/edit`);
  }
};
exports.deleteBlog = async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  req.flash("success", "Deleted.");
  res.redirect("/admin/blogs");
};

// ========== SERVICES ==========
exports.getServices = async (req, res) => {
  const services = await Service.find().sort({ order: 1, createdAt: 1 });
  res.render("admin/services/index", {
    title: "Services",
    services,
    error: req.flash("error"),
    success: req.flash("success"),
  });
};
exports.getCreateService = (req, res) =>
  res.render("admin/services/form", {
    title: "Create Service",
    service: null,
    error: req.flash("error"),
  });
exports.postCreateService = async (req, res) => {
  try {
    const data = {
  ...req.body
};

const titles = req.body.featureTitle || [];
const descriptions = req.body.featureDescription || [];

data.features = titles
  .map((title, index) => ({
    title,
    description: descriptions[index] || ""
  }))
  .filter(item => item.title.trim() !== "");

if (req.files?.image?.[0]) {
  data.image = `/uploads/services/${req.files.image[0].filename}`;
}

if (req.files?.detailImage?.[0]) {
  data.detailImage = `/uploads/services/${req.files.detailImage[0].filename}`;
}

await Service.create(data);
    req.flash("success", "Service created.");
    res.redirect("/admin/services");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/admin/services/create");
  }
};
exports.getEditService = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) {
    req.flash("error", "Not found");
    return res.redirect("/admin/services");
  }
  res.render("admin/services/form", {
    title: "Edit Service",
    service,
    error: req.flash("error"),
  });
};
exports.postEditService = async (req, res) => {
  try {
    const data = {
  ...req.body
};

const titles = req.body.featureTitle || [];
const descriptions = req.body.featureDescription || [];

data.features = titles
  .map((title, index) => ({
    title,
    description: descriptions[index] || ""
  }))
  .filter(item => item.title.trim() !== "");

if (req.files?.image?.[0]) {
  data.image = `/uploads/services/${req.files.image[0].filename}`;
}

if (req.files?.detailImage?.[0]) {
  data.detailImage = `/uploads/services/${req.files.detailImage[0].filename}`;
}

await Service.findByIdAndUpdate(
  req.params.id,
  data,
  { new: true }
);
    req.flash("success", "Updated.");
    res.redirect("/admin/services");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect(`/admin/services/${req.params.id}/edit`);
  }
};
exports.deleteService = async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  req.flash("success", "Deleted.");
  res.redirect("/admin/services");
};

// ========== FAQs ==========
exports.getFAQs = async (req, res) => {
  const faqs = await FAQ.find().sort({ order: 1 });
  res.render("admin/faqs/index", {
    title: "FAQs",
    faqs,
    error: req.flash("error"),
    success: req.flash("success"),
  });
};
exports.postCreateFAQ = async (req, res) => {
  await FAQ.create(req.body);
  req.flash("success", "FAQ created.");
  res.redirect("/admin/faqs");
};
exports.postEditFAQ = async (req, res) => {
  await FAQ.findByIdAndUpdate(req.params.id, req.body);
  req.flash("success", "Updated.");
  res.redirect("/admin/faqs");
};
exports.deleteFAQ = async (req, res) => {
  await FAQ.findByIdAndDelete(req.params.id);
  req.flash("success", "Deleted.");
  res.redirect("/admin/faqs");
};

// ========== TESTIMONIALS ==========
exports.getTestimonials = async (req, res) => {
  const testimonials = await Testimonial.find().sort({ order: 1 });
  res.render("admin/testimonials/index", {
    title: "Testimonials",
    testimonials,
    error: req.flash("error"),
    success: req.flash("success"),
  });
};
// exports.postCreateTestimonial=async(req,res)=>{await Testimonial.create(req.body);req.flash('success','Created.');res.redirect('/admin/testimonials');};
exports.postCreateTestimonial = async (req, res) => {
  const data = {
    ...req.body,
    image: req.file ? `/uploads/testimonials/${req.file.filename}` : "",
  };

  await Testimonial.create(data);

  req.flash("success", "Created.");
  res.redirect("/admin/testimonials");
};
exports.postEditTestimonial = async (req, res) => {
  await Testimonial.findByIdAndUpdate(req.params.id, req.body);
  req.flash("success", "Updated.");
  res.redirect("/admin/testimonials");
};
exports.deleteTestimonial = async (req, res) => {
  await Testimonial.findByIdAndDelete(req.params.id);
  req.flash("success", "Deleted.");
  res.redirect("/admin/testimonials");
};

// ========== PRIVACY POLICY ==========
exports.getPrivacyPolicy = async (req, res) => {
  let policy = await PrivacyPolicy.findOne();

  if (!policy) {
    policy = await PrivacyPolicy.create({
      title: 'Privacy Policy',
      content: ''
    });
  }

  res.render('admin/privacy-policy/index', {
    title: 'Privacy Policy',
    policy,
    error: req.flash('error'),
    success: req.flash('success')
  });
};

exports.postPrivacyPolicy = async (req, res) => {
  try {
    let policy = await PrivacyPolicy.findOne();

    if (!policy) {
      await PrivacyPolicy.create(req.body);
    } else {
      await PrivacyPolicy.findByIdAndUpdate(policy._id, req.body);
    }

    req.flash('success', 'Privacy Policy updated.');
    res.redirect('/admin/privacy-policy');
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/admin/privacy-policy');
  }
};


// terms-conditions
exports.getTermsConditions = async (req, res) => {

  let terms = await TermsCondition.findOne();

  if (!terms) {
    terms = await TermsCondition.create({
      title: 'Terms & Conditions',
      content: ''
    });
  }

  res.render('admin/terms-condition/index', {
    title: 'Terms & Conditions',
    terms,
    error: req.flash('error'),
    success: req.flash('success')
  });
};

exports.postCreateTermsCondition = async (req, res) => {
  try {
    await TermsCondition.create(req.body);

    req.flash('success', 'Created successfully.');
    res.redirect('/admin/terms-condition');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/admin/terms-condition');
  }
};

exports.postEditTermsCondition = async (req, res) => {
  try {
    await TermsCondition.findByIdAndUpdate(
      req.params.id,
      req.body
    );

    req.flash('success', 'Updated successfully.');
    res.redirect('/admin/terms-condition');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/admin/terms-condition');
  }
};

exports.deleteTermsCondition = async (req, res) => {
  await TermsCondition.findByIdAndDelete(req.params.id);

  req.flash('success', 'Deleted successfully.');
  res.redirect('/admin/terms-condition');
};


// about
exports.getAboutPage = async (req, res) => {
  try {

    const about = await AboutPage.findOne();

    res.render('admin/about/index', {
      title: 'About Page',
      admin: req.admin,
      about,
       success: req.flash('success'),
    error: req.flash('error')
    });

  } catch (error) {
    console.log(error);
    res.redirect('/admin/dashboard');
  }
};

exports.postAboutPage = async (req, res) => {
  try {

    let about = await AboutPage.findOne();

    let imagePath = about?.founderImage || '';

    if (req.file) {
      imagePath = `/uploads/about/${req.file.filename}`;
    }

    const payload = {
      headingLine1: req.body.headingLine1,
      headingLine2: req.body.headingLine2,
      headingLine3: req.body.headingLine3,

      description1: req.body.description1,
      description2: req.body.description2,

      founderImage: imagePath,
      founderName: req.body.founderName,

      storyTitle: req.body.storyTitle,
      storyContent: req.body.storyContent,

      missionTitle: req.body.missionTitle,
      missionDescription: req.body.missionDescription,

      visionTitle: req.body.visionTitle,
      visionDescription: req.body.visionDescription,

      businessIdeas: req.body.businessIdeas,
      startupIdeas: req.body.startupIdeas,
      communityMembers: req.body.communityMembers,
      projectsLaunched: req.body.projectsLaunched,

      isActive: true
    };

    if (about) {
      await AboutPage.findByIdAndUpdate(
        about._id,
        payload
      );
    } else {
      await AboutPage.create(payload);
    }

    req.flash('success', 'About Page Updated');

    res.redirect('/admin/about');

  } catch (error) {
    console.log(error);
    res.redirect('/admin/about');
  }
};

// ========== USERS ==========
exports.getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const filter = {};
  if (req.query.search)
    filter.$or = [
      { name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
      { username: { $regex: req.query.search, $options: "i" } },
    ];
  const users = await User.find(filter)
   .populate("stage")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
     .lean();
  const total = await User.countDocuments(filter);
  res.render("admin/users/index", {
    title: "Users",
    users,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    search: req.query.search || "",
    error: req.flash("error"),
    success: req.flash("success"),
  });
};
exports.toggleUserStatus = async (req, res) => {
const user = await User.findById(req.params.id)
  .populate("stage")
  .lean();
  if (!user) {
    req.flash("error", "Not found");
    return res.redirect("/admin/users");
  }
  user.isActive = !user.isActive;
  await user.save();
  req.flash("success", `User ${user.isActive ? "activated" : "deactivated"}.`);
  res.redirect("/admin/users");
};
exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  req.flash("success", "User deleted.");
  res.redirect("/admin/users");
};
exports.getUserDetail = async (req, res) => {
const user = await User.findById(req.params.id)
  .populate("stage")
  .lean();
  if (!user) {
    req.flash("error", "Not found");
    return res.redirect("/admin/users");
  }
  res.render("admin/users/detail", {
    title: "User Detail",
    user,
    error: req.flash("error"),
    success: req.flash("success"),
  });
};

// ========== POSTS ==========
// exports.getPosts=async(req,res)=>{
//   const page=parseInt(req.query.page)||1;const limit=10;
//   const posts=await Post.find().sort({createdAt:-1}).skip((page-1)*limit).limit(limit).select('-comments');
//   const total=await Post.countDocuments();
//   res.render('admin/posts/index',{title:'Community Posts',posts,currentPage:page,totalPages:Math.ceil(total/limit),error:req.flash('error'),success:req.flash('success')});
// };
// exports.togglePostStatus=async(req,res)=>{
//   const post=await Post.findById(req.params.id);
//   if(!post){req.flash('error','Not found');return res.redirect('/admin/posts');}
//   post.isActive=!post.isActive;await post.save();
//   req.flash('success',`Post ${post.isActive?'visible':'hidden'}.`);res.redirect('/admin/posts');
// };

// ========== POSTS ==========
exports.getPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const filter = req.query.status ? { status: req.query.status } : {};

  const posts = await Post.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .select("-comments");

  const total = await Post.countDocuments(filter);

  res.render("admin/posts/index", {
    title: "Community Posts",
    posts,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    currentStatus: req.query.status || "all",
    error: req.flash("error"),
    success: req.flash("success"),
  });
};

// Approve Post
exports.approvePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    req.flash("error", "Post not found");
    return res.redirect("/admin/posts");
  }

  post.status = "approved";
  post.approvedBy = req.session.adminId;
  post.approvedAt = new Date();
  await post.save();

  req.flash("success", "Post approved successfully.");
  res.redirect("/admin/posts?status=approved");
};

// Reject Post
exports.rejectPost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    req.flash("error", "Post not found");
    return res.redirect("/admin/posts");
  }

  post.status = "rejected";
  post.approvedBy = req.session.adminId;
  post.approvedAt = new Date();
  await post.save();

  req.flash("success", "Post rejected.");
  res.redirect("/admin/posts?status=rejected");
};

// Toggle Active (optional - already tha)
exports.togglePostStatus = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) {
    req.flash("error", "Post not found");
    return res.redirect("/admin/posts");
  }

  post.isActive = !post.isActive;
  await post.save();

  req.flash("success", `Post ${post.isActive ? "visible" : "hidden"}.`);
  res.redirect("/admin/posts");
};

exports.deletePost = async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  req.flash("success", "Post deleted.");
  res.redirect("/admin/posts");
};

exports.getPendingPosts = async (req, res) => {
  try {
    const posts = await Post.find({
      status: "pending",
      isActive: true
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: posts.length,
      posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.postsPage = async (req, res) => {
  try {
    const posts = await Post.find({
      status: "pending"
    })
      .populate("userId", "name email")
      .sort({ createdAt: -1 });

    res.render("admin/posts", {
      title: "Community Posts",
      posts,
      adminMeta: req.adminMeta
    });
  } catch (err) {
    console.log(err);
    res.redirect("/admin/dashboard");
  }
};

// ========== CONTACTS ==========
exports.getContacts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 10;
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  const contacts = await Contact.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
  const total = await Contact.countDocuments(filter);
  res.render("admin/contacts/index", {
    title: "Contact Messages",
    contacts,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    currentStatus: req.query.status || "",
    error: req.flash("error"),
    success: req.flash("success"),
  });
};
exports.updateContactStatus = async (req, res) => {
  await Contact.findByIdAndUpdate(req.params.id, { status: req.body.status });
  req.flash("success", "Status updated.");
  res.redirect("/admin/contacts");
};
exports.deleteContact = async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  req.flash("success", "Deleted.");
  res.redirect("/admin/contacts");
};

// ========== NEWSLETTER ==========
exports.getNewsletterSubs = async (req, res) => {
  const subs = await Newsletter.find().sort({ createdAt: -1 });
  res.render("admin/newsletter/index", {
    title: "Newsletter Subscribers",
    subs,
    error: req.flash("error"),
    success: req.flash("success"),
  });
};
exports.deleteNewsletter = async (req, res) => {
  await Newsletter.findByIdAndDelete(req.params.id);
  req.flash("success", "Removed.");
  res.redirect("/admin/newsletter");
};

// ========== SUB-ADMINS (Panel) ==========
exports.getSubAdmins = async (req, res) => {
  const subAdmins = await Admin.find({ adminType: "sub" }).sort({
    createdAt: -1,
  });
  res.render("admin/sub-admins/index", {
    title: "Sub-Admins",
    subAdmins,
    allPermissions: Admin.ALL_PERMISSIONS,
    error: req.flash("error"),
    success: req.flash("success"),
  });
};
exports.getCreateSubAdmin = (req, res) =>
  res.render("admin/sub-admins/form", {
    title: "Create Sub-Admin",
    subAdmin: null,
    allPermissions: Admin.ALL_PERMISSIONS,
    error: req.flash("error"),
  });
exports.postCreateSubAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const permissions = req.body.permissions
      ? (Array.isArray(req.body.permissions)
          ? req.body.permissions
          : [req.body.permissions]
        ).filter((p) => Admin.ALL_PERMISSIONS.includes(p))
      : [];
    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      req.flash("error", "Email already used by another admin.");
      return res.redirect("/admin/sub-admins/create");
    }
    await Admin.create({
      name,
      email: email.toLowerCase(),
      password,
      adminType: "sub",
      permissions,
      createdBy: req.session.adminId,
    });
    req.flash("success", `Sub-admin "${name}" created successfully.`);
    res.redirect("/admin/sub-admins");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/admin/sub-admins/create");
  }
};
exports.getEditSubAdmin = async (req, res) => {
  const subAdmin = await Admin.findOne({
    _id: req.params.id,
    adminType: "sub",
  });
  if (!subAdmin) {
    req.flash("error", "Not found");
    return res.redirect("/admin/sub-admins");
  }
  res.render("admin/sub-admins/form", {
    title: "Edit Sub-Admin",
    subAdmin,
    allPermissions: Admin.ALL_PERMISSIONS,
    error: req.flash("error"),
  });
};
exports.postEditSubAdmin = async (req, res) => {
  try {
    const { name, isActive } = req.body;
    const permissions = req.body.permissions
      ? (Array.isArray(req.body.permissions)
          ? req.body.permissions
          : [req.body.permissions]
        ).filter((p) => Admin.ALL_PERMISSIONS.includes(p))
      : [];
    await Admin.findByIdAndUpdate(req.params.id, {
      name,
      permissions,
      isActive: isActive === "true",
    });
    req.flash("success", "Sub-admin updated.");
    res.redirect("/admin/sub-admins");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect(`/admin/sub-admins/${req.params.id}/edit`);
  }
};
exports.deleteSubAdmin = async (req, res) => {
  await Admin.findOneAndDelete({ _id: req.params.id, adminType: "sub" });
  req.flash("success", "Sub-admin deleted.");
  res.redirect("/admin/sub-admins");
};
exports.resetSubAdminPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      req.flash("error", "Password must be at least 6 characters.");
      return res.redirect(`/admin/sub-admins/${req.params.id}/edit`);
    }
    const subAdmin = await Admin.findOne({
      _id: req.params.id,
      adminType: "sub",
    }).select("+password");
    if (!subAdmin) {
      req.flash("error", "Not found");
      return res.redirect("/admin/sub-admins");
    }
    subAdmin.password = newPassword;
    await subAdmin.save();
    req.flash("success", "Password reset successfully.");
    res.redirect("/admin/sub-admins");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/admin/sub-admins");
  }
};
