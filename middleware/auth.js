const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

exports.asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

// // USER JWT
// exports.protect = async (req, res, next) => {
//   let token;
//   if (req.headers.authorization?.startsWith('Bearer')) token = req.headers.authorization.split(' ')[1];
//   else if (req.cookies?.userToken) token = req.cookies.userToken;
//   if (!token) return res.status(401).json({ success: false, message: 'Not authorized. Please login.' });
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);
//     if (decoded.type !== 'user') return res.status(401).json({ success: false, message: 'Invalid token type.' });
//     const user = await User.findById(decoded.id).select('-password');
//     if (!user) return res.status(401).json({ success: false, message: 'User not found.' });
//     if (!user.isActive) return res.status(401).json({ success: false, message: 'Account deactivated.' });
//     req.user = user;
//     next();
//   } catch { return res.status(401).json({ success: false, message: 'Token expired or invalid.' }); }
// };

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.userToken) {
    token = req.cookies.userToken;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Please login.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_USER_SECRET);

    if (decoded.type !== 'user') {
      return res.status(401).json({ success: false, message: 'Invalid token type.' });
    }

    // ✅ Find user — no email/password check here
    // Incomplete users (mid-signup) must also pass this middleware
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found.' });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account deactivated.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Protect Middleware Error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Token expired or invalid. Please login again.',
    });
  }
};


// ADMIN JWT (for API routes)
exports.protectAdmin = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith('Bearer')) token = req.headers.authorization.split(' ')[1];
  else if (req.cookies?.adminToken) token = req.cookies.adminToken;
  if (!token) return res.status(401).json({ success: false, message: 'Admin not authorized.' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
    if (decoded.type !== 'admin') return res.status(401).json({ success: false, message: 'Invalid admin token.' });
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin || !admin.isActive) return res.status(401).json({ success: false, message: 'Admin not found or deactivated.' });
    req.admin = admin;
    next();
  } catch { return res.status(401).json({ success: false, message: 'Admin token expired or invalid.' }); }
};

exports.superAdminOnly = (req, res, next) => {
  if (req.admin?.adminType === 'super') return next();
  return res.status(403).json({ success: false, message: 'Super admin access required.' });
};

// Permission check for API routes
exports.requirePermission = (permission) => (req, res, next) => {
  if (!req.admin) return res.status(401).json({ success: false, message: 'Not authenticated as admin.' });
  if (req.admin.hasPermission(permission)) return next();
  return res.status(403).json({ success: false, message: `Access denied. Missing permission: '${permission}'.`, requiredPermission: permission });
};

// SESSION AUTH for EJS panel
exports.adminSession = (req, res, next) => {
  if (req.session?.adminId) return next();
  req.flash('error', 'Please login to access admin panel.');
  return res.redirect('/admin/login');
};

// Load full admin from session
exports.loadSessionAdmin = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.session.adminId).select('-password');
    if (!admin || !admin.isActive) { req.session.destroy(); return res.redirect('/admin/login'); }
    req.sessionAdmin = admin;
    req.session.adminMeta = { id: admin._id, name: admin.name, email: admin.email, adminType: admin.adminType, permissions: admin.permissions };
    res.locals.adminMeta = req.session.adminMeta;
    res.locals.isSuperAdmin = admin.adminType === 'super';
    next();
  } catch { req.session.destroy(); res.redirect('/admin/login'); }
};

// Panel permission guard - shows 403 EJS page
exports.panelPermission = (permission) => async (req, res, next) => {
  const admin = req.sessionAdmin;
  if (!admin) return res.redirect('/admin/login');
  if (admin.adminType === 'super' || admin.permissions.includes(permission)) return next();
  return res.status(403).render('admin/403', {
    title: 'Access Denied', permission,
    message: `You don't have access to the "${permission}" section. Contact your super admin.`,
    error: null, success: null,
  });
};

// GLOBAL ERROR HANDLER
exports.errorHandler = (err, req, res, next) => {
  console.error('❌', err.stack);
  const statusCode = err.statusCode || 500;
  if (req.path.startsWith('/api')) return res.status(statusCode).json({ success: false, message: err.message || 'Internal Server Error' });
  res.status(statusCode).send(`<h2>${statusCode} - ${err.message || 'Server Error'}</h2><a href="/admin">Go back</a>`);
};
