require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log('\n🚀 ═══════════════════════════════════════════════');
    console.log('   BizIdeas Backend');
    console.log(`   http://localhost:${PORT}`);
    console.log('   ═══════════════════════════════════════════════');
    console.log(`\n🖥️  Admin Panel : http://localhost:${PORT}/admin`);
    console.log(`📡  API Base    : http://localhost:${PORT}/api`);
    console.log('\n🔑 AUTH SYSTEM (2 separate models):');
    console.log('   USER  tokens → signed with JWT_USER_SECRET');
    console.log('   ADMIN tokens → signed with JWT_ADMIN_SECRET');
    console.log('\n📋 USER API:');
    console.log('   GET  /api/auth/check-username/:username  → Step 1 username check');
    console.log('   GET  /api/auth/signup/stages             → Step 2 options');
    console.log('   GET  /api/auth/signup/roles              → Step 3 options');
    console.log('   GET  /api/auth/signup/interests          → Step 4 options');
    console.log('   POST /api/auth/register                  → Final registration');
    console.log('   POST /api/auth/login');
    console.log('   GET  /api/auth/me                        → [JWT required]');
    console.log('\n📋 ADMIN API:');
    console.log('   POST /api/admin/login');
    console.log('   GET  /api/admin/me                       → [Admin JWT]');
    console.log('   GET  /api/admin/sub-admins               → [Super Admin only]');
    console.log('   POST /api/admin/sub-admins               → [Super Admin only]');
    console.log('   PUT  /api/admin/sub-admins/:id           → [Super Admin only]');
    console.log('   DEL  /api/admin/sub-admins/:id           → [Super Admin only]');
    console.log('\n');
  });
};

startServer();
