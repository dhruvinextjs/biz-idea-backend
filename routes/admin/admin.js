const express = require('express');
const router = express.Router();
const admin = require('../../controllers/admin/adminController');
const { adminSession, loadSessionAdmin, panelPermission } = require('../../middleware/auth');

// ── Public ──────────────────────────────────────────
router.get('/login', admin.getLogin);
router.post('/login', admin.postLogin);
router.get('/logout', admin.logout);

// ── All below require: session + load admin doc ─────
router.use(adminSession, loadSessionAdmin);

router.get('/', (req, res) => res.redirect('/admin/dashboard'));

// Dashboard — every admin can see
router.get('/dashboard', panelPermission('dashboard'), admin.getDashboard);

// Ideas — permission: 'ideas'
router.get('/ideas', panelPermission('ideas'), admin.getIdeas);
router.get('/ideas/create', panelPermission('ideas'), admin.getCreateIdea);
router.post('/ideas/create', panelPermission('ideas'), admin.postCreateIdea);
router.get('/ideas/:id/edit', panelPermission('ideas'), admin.getEditIdea);
router.post('/ideas/:id/edit', panelPermission('ideas'), admin.postEditIdea);
router.post('/ideas/:id/delete', panelPermission('ideas'), admin.deleteIdea);

// Case Studies — permission: 'case-studies'
router.get('/case-studies', panelPermission('case-studies'), admin.getCaseStudies);
router.get('/case-studies/create', panelPermission('case-studies'), admin.getCreateCaseStudy);
router.post('/case-studies/create', panelPermission('case-studies'), admin.postCreateCaseStudy);
router.get('/case-studies/:id/edit', panelPermission('case-studies'), admin.getEditCaseStudy);
router.post('/case-studies/:id/edit', panelPermission('case-studies'), admin.postEditCaseStudy);
router.post('/case-studies/:id/delete', panelPermission('case-studies'), admin.deleteCaseStudy);

// Blogs — permission: 'blogs'
router.get('/blogs', panelPermission('blogs'), admin.getBlogs);
router.get('/blogs/create', panelPermission('blogs'), admin.getCreateBlog);
router.post('/blogs/create', panelPermission('blogs'), admin.postCreateBlog);
router.get('/blogs/:id/edit', panelPermission('blogs'), admin.getEditBlog);
router.post('/blogs/:id/edit', panelPermission('blogs'), admin.postEditBlog);
router.post('/blogs/:id/delete', panelPermission('blogs'), admin.deleteBlog);

// Services — permission: 'services'
router.get('/services', panelPermission('services'), admin.getServices);
router.get('/services/create', panelPermission('services'), admin.getCreateService);
router.post('/services/create', panelPermission('services'), admin.postCreateService);
router.get('/services/:id/edit', panelPermission('services'), admin.getEditService);
router.post('/services/:id/edit', panelPermission('services'), admin.postEditService);
router.post('/services/:id/delete', panelPermission('services'), admin.deleteService);

// FAQs — permission: 'faqs'
router.get('/faqs', panelPermission('faqs'), admin.getFAQs);
router.post('/faqs/create', panelPermission('faqs'), admin.postCreateFAQ);
router.post('/faqs/:id/edit', panelPermission('faqs'), admin.postEditFAQ);
router.post('/faqs/:id/delete', panelPermission('faqs'), admin.deleteFAQ);

// Testimonials — permission: 'testimonials'
router.get('/testimonials', panelPermission('testimonials'), admin.getTestimonials);
router.post('/testimonials/create', panelPermission('testimonials'), admin.postCreateTestimonial);
router.post('/testimonials/:id/edit', panelPermission('testimonials'), admin.postEditTestimonial);
router.post('/testimonials/:id/delete', panelPermission('testimonials'), admin.deleteTestimonial);

// Users — permission: 'users'
router.get('/users', panelPermission('users'), admin.getUsers);
router.get('/users/:id', panelPermission('users'), admin.getUserDetail);
router.post('/users/:id/toggle', panelPermission('users'), admin.toggleUserStatus);
router.post('/users/:id/delete', panelPermission('users'), admin.deleteUser);

// Community Posts — permission: 'posts'
router.get('/posts', panelPermission('posts'), admin.getPosts);
router.post('/posts/:id/toggle', panelPermission('posts'), admin.togglePostStatus);
router.post('/posts/:id/delete', panelPermission('posts'), admin.deletePost);

// Contacts — permission: 'contacts'
router.get('/contacts', panelPermission('contacts'), admin.getContacts);
router.post('/contacts/:id/status', panelPermission('contacts'), admin.updateContactStatus);
router.post('/contacts/:id/delete', panelPermission('contacts'), admin.deleteContact);

// Newsletter — permission: 'newsletter'
router.get('/newsletter', panelPermission('newsletter'), admin.getNewsletterSubs);
router.post('/newsletter/:id/delete', panelPermission('newsletter'), admin.deleteNewsletter);

// Sub-Admins — permission: 'sub-admins' (only super admin gets this)
router.get('/sub-admins', panelPermission('sub-admins'), admin.getSubAdmins);
router.get('/sub-admins/create', panelPermission('sub-admins'), admin.getCreateSubAdmin);
router.post('/sub-admins/create', panelPermission('sub-admins'), admin.postCreateSubAdmin);
router.get('/sub-admins/:id/edit', panelPermission('sub-admins'), admin.getEditSubAdmin);
router.post('/sub-admins/:id/edit', panelPermission('sub-admins'), admin.postEditSubAdmin);
router.post('/sub-admins/:id/delete', panelPermission('sub-admins'), admin.deleteSubAdmin);
router.post('/sub-admins/:id/reset-password', panelPermission('sub-admins'), admin.resetSubAdminPassword);

module.exports = router;
