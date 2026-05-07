require('dotenv').config();
const connectDB = require('./config/db');
const Admin = require('./models/Admin');
const User = require('./models/User');
const BusinessIdea = require('./models/BusinessIdea');
const CaseStudy = require('./models/CaseStudy');
const Blog = require('./models/Blog');
const Service = require('./models/Service');
const { FAQ, Testimonial } = require('./models/Misc');

const seed = async () => {
  await connectDB();
  console.log('🌱 Seeding database...\n');

  await Promise.all([
    Admin.deleteMany({}), User.deleteMany({}), BusinessIdea.deleteMany({}),
    // CaseStudy.deleteMany({}), Post.deleteMany({}), Blog.deleteMany({}),
    Service.deleteMany({}), FAQ.deleteMany({}), Testimonial.deleteMany({}),
  ]);

  // ── Super Admin ──────────────────────────────────
  const superAdmin = await Admin.create({
    name: process.env.SUPER_ADMIN_NAME || 'Super Admin',
    email: process.env.SUPER_ADMIN_EMAIL || 'superadmin@bizideas.com',
    password: process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123',
    adminType: 'super',
    permissions: Admin.ALL_PERMISSIONS, // Super gets all
  });
  console.log('✅ Super Admin created:', superAdmin.email);

  // ── Sample Sub-Admin (Content Manager) ──────────
  const subAdmin = await Admin.create({
    name: 'Content Manager',
    email: 'content@bizideas.com',
    password: 'Content@123',
    adminType: 'sub',
    permissions: ['dashboard', 'ideas', 'blogs', 'case-studies'],
    createdBy: superAdmin._id,
  });
  console.log('✅ Sub-Admin created:', subAdmin.email, '| Permissions:', subAdmin.permissions.join(', '));

  // ── Sample User ─────────────────────────────────
  await User.create({
    username: 'demo_user',
    name: 'Demo User',
    email: 'demo@bizideas.com',
    password: 'Demo@123',
    stage: 'Validating an idea',
    selfRole: 'Solo founder',
    interests: ['Business Ideas', 'Case Studies'],
  });
  console.log('✅ Demo user created: demo@bizideas.com');

  // ── Ideas ────────────────────────────────────────
  await BusinessIdea.create([
    { title: 'AI-Powered Customer Support SaaS', description: 'Automated customer support via advanced AI models.', category: 'AI & Tech', type: 'business', investmentMin: 1000, investmentMax: 5000, profitMargin: 85, teamSize: 'Solo (1)', isFeatured: true },
    { title: 'Eco-Friendly Packaging Solutions', description: 'Sustainable packaging alternatives for businesses.', category: 'Services', type: 'business', investmentMin: 5000, investmentMax: 20000, profitMargin: 45, teamSize: 'Small (2-5)' },
    { title: 'Online Skill-Based Learning Platform', description: 'Courses in high-demand skills like coding and design.', category: 'E-Commerce', type: 'business', investmentMin: 2000, investmentMax: 5000, profitMargin: 70, teamSize: 'Small (2-5)' },
    { title: 'AI-Powered Fitness App with AR', description: 'AI fitness app using 3D animations and AR for workout guidance.', category: 'AI & Tech', type: 'app', investmentMin: 5000, investmentMax: 20000, profitMargin: 80, teamSize: 'Small (2-5)', isFeatured: true },
    { title: 'Local Service Marketplace App', description: 'Connect local service providers with customers.', category: 'Local Business', type: 'app', investmentMin: 5000, investmentMax: 20000, profitMargin: 55, teamSize: 'Small (2-5)' },
    { title: 'B2B Invoice Management SaaS', description: 'Automate invoicing and payment reminders for small businesses.', category: 'SaaS', type: 'startup', investmentMin: 2000, investmentMax: 5000, profitMargin: 75, teamSize: 'Solo (1)', isFeatured: true },
    { title: 'Micro-SaaS for Freelancers', description: 'Time tracking, invoicing, and client management for freelancers.', category: 'SaaS', type: 'startup', investmentMin: 1000, investmentMax: 5000, profitMargin: 80, teamSize: 'Solo (1)' },
  ]);
  console.log('✅ Ideas seeded');

  // ── Case Studies ─────────────────────────────────
  await CaseStudy.create([
    { title: 'Growing a GEO tool to a mid-five-figure MRR within a year', excerpt: 'Daniel Peris saw a trend and built for it. Less than a year later, it\'s bringing in a mid-five-figure MRR.', content: '<p>Full story here...</p>', founderName: 'Daniel Peris', companyName: 'GEO Tool Co.', industry: 'Marketing', monthlyRevenue: 50000, companySize: 3, upvotes: 20, isFeatured: true },
    { title: 'Building a profitable mobile app portfolio reaching $100K/m', excerpt: 'Multiple app income streams combined into a stable revenue engine.', content: '<p>Full story...</p>', founderName: 'Sarah Chen', companyName: 'AppStack', industry: 'Analytics', monthlyRevenue: 100000, companySize: 5 },
    { title: 'From zero to $25K MRR with a simple micro SaaS', excerpt: 'Solving one small problem turned into a profitable recurring business.', content: '<p>Full story...</p>', founderName: 'Alex Kumar', companyName: 'MicroSaaS Lab', industry: 'SaaS', monthlyRevenue: 25000, companySize: 2 },
  ]);
  console.log('✅ Case studies seeded');

  // ── Blogs ────────────────────────────────────────
  await Blog.create([
    { title: 'Top 10 AI Business Ideas for 2026', excerpt: 'AI is reshaping every industry. Here are 10 opportunities you can capitalize on now.', content: '<p>Full content...</p>', category: 'IDEAS', author: 'TheBizIdeas Team', isFeatured: true },
    { title: 'How to Validate Your Business Idea in 48 Hours', excerpt: 'Before spending months building, learn how to validate fast with zero budget.', content: '<p>Full content...</p>', category: 'GUIDE', author: 'TheBizIdeas Team' },
  ]);
  console.log('✅ Blogs seeded');



  // ── FAQs ─────────────────────────────────────────
  await FAQ.create([
    { question: 'Why should I use this instead of brainstorming myself?', answer: 'Because it saves hours. You can go from idea → name → domain → rough cost in minutes instead of days.', order: 1 },
    { question: 'Are the generated names actually usable?', answer: 'Yes, we check for basic availability and ensure they are brandable and relevant to your industry.', order: 2 },
    { question: 'Is this useful if I\'m a solo founder?', answer: 'Perfectly so. It acts as a digital co-founder to help you iterate quickly on your own.', order: 3 },
  ]);
  console.log('✅ FAQs seeded');

  // ── Testimonials ──────────────────────────────────
  await Testimonial.create([
    { name: 'Aarav', role: 'Bootstrapped Founder', content: 'This is the kind of resource I wish I had when I started. Straight to the point, no fluff.', image: '/images/person1.jpg', rating: 5, order: 1 },
    { name: 'Neha', role: 'Facebook', content: 'Most content online is noise. This actually helps you think and move faster.', image: '/images/person2.jpg', rating: 5, order: 2 },
  ]);
  console.log('✅ Testimonials seeded');

  console.log('\n🎉 Seed complete!\n');
  console.log('━'.repeat(50));
  console.log('🔑 SUPER ADMIN (Full Access)');
  console.log('   Email:    ', process.env.SUPER_ADMIN_EMAIL || 'superadmin@bizideas.com');
  console.log('   Password: ', process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123');
  console.log('\n🔑 SUB-ADMIN (ideas, blogs, case-studies, dashboard only)');
  console.log('   Email:     content@bizideas.com');
  console.log('   Password:  Content@123');
  console.log('\n👤 DEMO USER');
  console.log('   Email:     demo@bizideas.com');
  console.log('   Password:  Demo@123');
  console.log('━'.repeat(50));
  process.exit(0);
};

seed().catch(err => { console.error('❌ Seed error:', err); process.exit(1); });
