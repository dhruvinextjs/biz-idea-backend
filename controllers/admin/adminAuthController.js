// const jwt = require('jsonwebtoken');
// const Admin = require('../../models/Admin');
// const { asyncHandler } = require('../../middleware/auth');

// const signAdminToken = (id) =>
//   jwt.sign({ id, type: 'admin' }, process.env.JWT_ADMIN_SECRET, { expiresIn: process.env.JWT_ADMIN_EXPIRE || '1d' });

// // ─────────────────────────────────────────────────────
// //  ADMIN LOGIN (API — for separate admin frontend if needed)
// //  POST /api/admin/auth/login
// // ─────────────────────────────────────────────────────
// // exports.adminLogin = asyncHandler(async (req, res) => {
// //   const { email, password } = req.body;
// //   if (!email || !password)
// //     return res.status(400).json({ success: false, message: 'Email and password are required.' });

// //   const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
// //   if (!admin || !(await admin.comparePassword(password)))
// //     return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
// //   if (!admin.isActive)
// //     return res.status(401).json({ success: false, message: 'Admin account deactivated.' });

// //   admin.lastLogin = new Date();
// //   await admin.save({ validateBeforeSave: false });

// //   const token = signAdminToken(admin._id);

// //   res.json({
// //     success: true,
// //     message: 'Admin login successful.',
// //     token,
// //     admin: {
// //       id: admin._id, name: admin.name, email: admin.email,
// //       adminType: admin.adminType, permissions: admin.permissions,
// //     },
// //   });
// // });

// exports.adminLogin = asyncHandler(async (req, res) => {
//   const { email, password } = req.body;

//   const admin = await Admin.findOne({
//     email: email.toLowerCase()
//   }).select('+password');

//   if (!admin || !(await admin.comparePassword(password))) {
//     return res.status(401).json({
//       success: false,
//       message: 'Invalid admin credentials.'
//     });
//   }

//   if (!admin.isActive) {
//     return res.status(401).json({
//       success: false,
//       message: 'Admin account deactivated.'
//     });
//   }

//   // ✅ Session Create
//   req.session.adminId = admin._id;

//   req.session.adminMeta = {
//     id: admin._id,
//     name: admin.name,
//     email: admin.email,
//     adminType: admin.adminType,
//     permissions: admin.permissions
//   };

//   await new Promise((resolve, reject) => {
//     req.session.save(err => {
//       if (err) reject(err);
//       else resolve();
//     });
//   });

//   const token = signAdminToken(admin._id);

//   res.json({
//     success: true,
//     message: 'Admin login successful.',
//     token
//   });
// });

// // ─────────────────────────────────────────────────────
// //  GET ALL SUB-ADMINS  (super admin only
// //  GET /api/admin/sub-admins
// // ─────────────────────────────────────────────────────
// exports.getSubAdmins = asyncHandler(async (req, res) => {
//   const subAdmins = await Admin.find({ adminType: 'sub' }).sort({ createdAt: -1 });
//   res.json({ success: true, count: subAdmins.length, data: subAdmins });
// });

// // ─────────────────────────────────────────────────────
// //  CREATE SUB-ADMIN  (super admin only)
// //  POST /api/admin/sub-admins
// // ─────────────────────────────────────────────────────
// exports.createSubAdmin = asyncHandler(async (req, res) => {
//   const { name, email, password, permissions } = req.body;

//   if (!name || !email || !password)
//     return res.status(400).json({ success: false, message: 'Name, email and password are required.' });

//   const existing = await Admin.findOne({ email: email.toLowerCase() });
//   if (existing) return res.status(400).json({ success: false, message: 'Admin with this email already exists.' });

//   // Validate permissions against allowed list
//   const validPerms = (permissions || []).filter(p => Admin.ALL_PERMISSIONS.includes(p));

//   const subAdmin = await Admin.create({
//     name, email: email.toLowerCase(), password,
//     adminType: 'sub',
//     permissions: validPerms,
//     createdBy: req.admin._id,
//   });

//   res.status(201).json({
//     success: true,
//     message: `Sub-admin "${name}" created successfully.`,
//     data: { id: subAdmin._id, name: subAdmin.name, email: subAdmin.email, permissions: subAdmin.permissions },
//   });
// });

// // ─────────────────────────────────────────────────────
// //  UPDATE SUB-ADMIN PERMISSIONS  (super admin only)
// //  PUT /api/admin/sub-admins/:id
// // ─────────────────────────────────────────────────────
// exports.updateSubAdmin = asyncHandler(async (req, res) => {
//   const { name, permissions, isActive } = req.body;
//   const subAdmin = await Admin.findOne({ _id: req.params.id, adminType: 'sub' });
//   if (!subAdmin) return res.status(404).json({ success: false, message: 'Sub-admin not found.' });

//   if (name) subAdmin.name = name;
//   if (permissions !== undefined) subAdmin.permissions = permissions.filter(p => Admin.ALL_PERMISSIONS.includes(p));
//   if (isActive !== undefined) subAdmin.isActive = isActive;

//   await subAdmin.save();
//   res.json({ success: true, message: 'Sub-admin updated.', data: subAdmin });
// });

// // ─────────────────────────────────────────────────────
// //  DELETE SUB-ADMIN  (super admin only)
// //  DELETE /api/admin/sub-admins/:id
// // ─────────────────────────────────────────────────────
// exports.deleteSubAdmin = asyncHandler(async (req, res) => {
//   const subAdmin = await Admin.findOne({ _id: req.params.id, adminType: 'sub' });
//   if (!subAdmin) return res.status(404).json({ success: false, message: 'Sub-admin not found.' });
//   await subAdmin.deleteOne();
//   res.json({ success: true, message: 'Sub-admin deleted successfully.' });
// });

// // ─────────────────────────────────────────────────────
// //  GET ALL PERMISSIONS LIST
// //  GET /api/admin/permissions
// // ─────────────────────────────────────────────────────
// exports.getPermissions = asyncHandler(async (req, res) => {
//   res.json({ success: true, data: Admin.ALL_PERMISSIONS });
// });

// // ─────────────────────────────────────────────────────
// //  GET CURRENT ADMIN PROFILE
// //  GET /api/admin/me
// // ─────────────────────────────────────────────────────
// exports.getAdminMe = asyncHandler(async (req, res) => {
//   res.json({ success: true, admin: req.admin });
// });

// // ========== CHANGE PASSWORD ==========
// exports.getChangePassword = async (req, res) => {
//   const adminMeta = await Admin.findById(req.session.adminId);

//   res.render("admin/change_pass", {
//     title: "Change Password",
//     adminMeta,
//     error: req.flash("error"),
//     success: req.flash("success")
//   });
// };
 
// exports.postChangePassword = async (req, res) => {
//   try {
//     const { currentPassword, newPassword, confirmPassword } = req.body;

//     const admin = await Admin.findById(req.session.adminId).select("+password");

//     if (!admin) {
//       req.flash("error", "Admin not found.");
//       return res.redirect("/admin/changepass");
//     }

//     const isMatch = await admin.comparePassword(currentPassword);
//     if (!isMatch) {
//       req.flash("error", "Current password is incorrect.");
//       return res.redirect("/admin/changepass");
//     }

//     if (newPassword.length < 6) {
//       req.flash("error", "Password must be at least 6 characters.");
//       return res.redirect("/admin/changepass");
//     }

//     if (newPassword !== confirmPassword) {
//       req.flash("error", "Confirm password does not match.");
//       return res.redirect("/admin/changepass");
//     }

//     admin.password = newPassword;
//     await admin.save();

//     // ✅ Flash set karo, PHIR session destroy karo
//     req.flash("success", "Password changed successfully.");
    
//     req.session.destroy((err) => {
//       if (err) console.error("Session destroy error:", err);
//       // ✅ Query param se message pass karo — flash session pe depend karta tha jo ab destroy ho gaya
//       res.redirect("/admin/login?success=Password+changed+successfully.+Please+login+again.");
//     });

//   } catch (error) {
//     req.flash("error", error.message);
//     res.redirect("/admin/changepass");
//   }
// };


const jwt = require('jsonwebtoken');
const Admin = require('../../models/Admin');
const { asyncHandler } = require('../../middleware/auth');

const signAdminToken = (id) =>
  jwt.sign({ id, type: 'admin' }, process.env.JWT_ADMIN_SECRET, {
    expiresIn: process.env.JWT_ADMIN_EXPIRE || '1d',
  });

// ─────────────────────────────────────────────────────
// ADMIN LOGIN
// POST /api/admin/auth/login
// ─────────────────────────────────────────────────────
exports.adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email: email.toLowerCase() }).select('+password');
  if (!admin || !(await admin.comparePassword(password)))
    return res.status(401).json({ success: false, message: 'Invalid admin credentials.' });

  if (!admin.isActive)
    return res.status(401).json({ success: false, message: 'Admin account deactivated.' });

  req.session.adminId = admin._id;
  req.session.adminMeta = {
    id: admin._id, name: admin.name, email: admin.email,
    adminType: admin.adminType, permissions: admin.permissions,
  };

  await new Promise((resolve, reject) => {
    req.session.save(err => err ? reject(err) : resolve());
  });

  const token = signAdminToken(admin._id);
  res.json({ success: true, message: 'Admin login successful.', token });
});

// ─────────────────────────────────────────────────────
// GET ALL SUB-ADMINS
// GET /admin/sub-admins
// ─────────────────────────────────────────────────────
exports.getSubAdminListPage = async (req, res) => {
  try {
    const adminMeta = await Admin.findById(req.session.adminId);
    const subAdmins = await Admin.find({ adminType: 'sub' }).sort({ createdAt: -1 });
    res.render('admin/sub-admins/index', {
      title: 'Sub Admins', adminMeta, subAdmins,
      success: req.flash('success'), error: req.flash('error'),
    });
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/admin/dashboard');
  }
};

// ─────────────────────────────────────────────────────
// GET CREATE FORM
// GET /admin/sub-admins/create
// ─────────────────────────────────────────────────────
exports.getCreateSubAdmin = async (req, res) => {
  try {
    const adminMeta = await Admin.findById(req.session.adminId);
    res.render('admin/sub-admins/create', {
      title: 'Add Sub Admin', adminMeta,
      allPermissions: Admin.ALL_PERMISSIONS.filter(p => p !== 'sub-admins'),
      permissionLabels: Admin.PERMISSION_LABELS,
      success: req.flash('success'), error: req.flash('error'),
    });
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/admin/sub-admins');
  }
};

// ─────────────────────────────────────────────────────
// POST CREATE SUB-ADMIN
// POST /admin/sub-admins/create
// ─────────────────────────────────────────────────────
exports.postCreateSubAdmin = async (req, res) => {
  try {
    const { name, email, password, permissions } = req.body;

    if (!name || !email || !password) {
      req.flash('error', 'Name, email and password are required.');
      return res.redirect('/admin/sub-admins/create');
    }

    const existing = await Admin.findOne({ email: email.toLowerCase() });
    if (existing) {
      req.flash('error', 'Admin with this email already exists.');
      return res.redirect('/admin/sub-admins/create');
    }

    // permissions = { ideas: { isView: 'true', isAdd: 'true', isEdit: 'false', isDelete: 'false', module: 'ideas', moduleName: 'Ideas' }, ... }
    const permissionsObj = permissions || {};
    const permissionDetails = [];
    const permissionsArr = [];

    Object.keys(permissionsObj).forEach(mod => {
      const p = permissionsObj[mod];
      const detail = {
        module:   mod,
        label:    p.moduleName || mod,
        isView:   p.isView   === 'true',
        isAdd:    p.isAdd    === 'true',
        isEdit:   p.isEdit   === 'true',
        isDelete: p.isDelete === 'true',
      };
      permissionDetails.push(detail);
      // Agar koi bhi action on ho to module access mein add karo
      if (detail.isView || detail.isAdd || detail.isEdit || detail.isDelete) {
        permissionsArr.push(mod);
      }
    });

    await Admin.create({
      name, email: email.toLowerCase(), password,
      adminType: 'sub',
      permissions: permissionsArr,
      permissionDetails,
      createdBy: req.session.adminId,
    });

    req.flash('success', `Sub admin "${name}" created successfully.`);
    res.redirect('/admin/sub-admins');
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/admin/sub-admins/create');
  }
};

// ─────────────────────────────────────────────────────
// GET EDIT FORM
// GET /admin/sub-admins/:id/edit
// ─────────────────────────────────────────────────────
exports.getEditSubAdmin = async (req, res) => {
  try {
    const adminMeta = await Admin.findById(req.session.adminId);
    const subAdmin = await Admin.findOne({ _id: req.params.id, adminType: 'sub' });
    if (!subAdmin) {
      req.flash('error', 'Sub admin not found.');
      return res.redirect('/admin/sub-admins');
    }

    // permissionDetails ko object mein convert karo for easy EJS access
    const permDetailMap = {};
    subAdmin.permissionDetails.forEach(p => {
      permDetailMap[p.module] = p;
    });

    res.render('admin/sub-admins/edit', {
      title: 'Edit Sub Admin', adminMeta, subAdmin, permDetailMap,
      allPermissions: Admin.ALL_PERMISSIONS.filter(p => p !== 'sub-admins'),
      permissionLabels: Admin.PERMISSION_LABELS,
      success: req.flash('success'), error: req.flash('error'),
    });
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/admin/sub-admins');
  }
};

// ─────────────────────────────────────────────────────
// POST EDIT SUB-ADMIN
// POST /admin/sub-admins/:id/edit
// ─────────────────────────────────────────────────────
exports.postEditSubAdmin = async (req, res) => {
  try {
    const subAdmin = await Admin.findOne({ _id: req.params.id, adminType: 'sub' });
    if (!subAdmin) {
      req.flash('error', 'Sub admin not found.');
      return res.redirect('/admin/sub-admins');
    }

    const { name, email, password, permissions } = req.body;

    if (name)  subAdmin.name  = name;
    if (email) subAdmin.email = email.toLowerCase();
    if (password && password.trim() !== '') subAdmin.password = password;

    const permissionsObj = permissions || {};
    const permissionDetails = [];
    const permissionsArr = [];

    Object.keys(permissionsObj).forEach(mod => {
      const p = permissionsObj[mod];
      const detail = {
        module:   mod,
        label:    p.moduleName || mod,
        isView:   p.isView   === 'true',
        isAdd:    p.isAdd    === 'true',
        isEdit:   p.isEdit   === 'true',
        isDelete: p.isDelete === 'true',
      };
      permissionDetails.push(detail);
      if (detail.isView || detail.isAdd || detail.isEdit || detail.isDelete) {
        permissionsArr.push(mod);
      }
    });

    subAdmin.permissions      = permissionsArr;
    subAdmin.permissionDetails = permissionDetails;
    await subAdmin.save();

    req.flash('success', 'Sub admin updated successfully.');
    res.redirect('/admin/sub-admins');
  } catch (err) {
    req.flash('error', err.message);
    res.redirect(`/admin/sub-admins/${req.params.id}/edit`);
  }
};

// ─────────────────────────────────────────────────────
// DELETE SUB-ADMIN
// POST /admin/sub-admins/:id/delete
// ─────────────────────────────────────────────────────
exports.postDeleteSubAdmin = async (req, res) => {
  try {
    const subAdmin = await Admin.findOne({ _id: req.params.id, adminType: 'sub' });
    if (!subAdmin) {
      req.flash('error', 'Sub admin not found.');
      return res.redirect('/admin/sub-admins');
    }
    await subAdmin.deleteOne();
    req.flash('success', 'Sub admin deleted successfully.');
    res.redirect('/admin/sub-admins');
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/admin/sub-admins');
  }
};

// ─────────────────────────────────────────────────────
// ACTIVATE / DEACTIVATE
// GET /admin/sub-admins/:id/activate
// GET /admin/sub-admins/:id/deactivate
// ─────────────────────────────────────────────────────
exports.activateSubAdmin = async (req, res) => {
  try {
    await Admin.findByIdAndUpdate(req.params.id, { isActive: true });
    req.flash('success', 'Sub admin activated.');
    res.redirect('/admin/sub-admins');
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/admin/sub-admins');
  }
};

exports.deactivateSubAdmin = async (req, res) => {
  try {
    await Admin.findByIdAndUpdate(req.params.id, { isActive: false });
    req.flash('success', 'Sub admin deactivated.');
    res.redirect('/admin/sub-admins');
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/admin/sub-admins');
  }
};

// ─────────────────────────────────────────────────────
// CHANGE PASSWORD (existing)
// ─────────────────────────────────────────────────────
exports.getChangePassword = async (req, res) => {
  const adminMeta = await Admin.findById(req.session.adminId);
  res.render('admin/change_pass', {
    title: 'Change Password', adminMeta,
    error: req.flash('error'), success: req.flash('success'),
  });
};

exports.postChangePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const admin = await Admin.findById(req.session.adminId).select('+password');

    if (!admin) { req.flash('error', 'Admin not found.'); return res.redirect('/admin/changepass'); }

    const isMatch = await admin.comparePassword(currentPassword);
    if (!isMatch) { req.flash('error', 'Current password is incorrect.'); return res.redirect('/admin/changepass'); }
    if (newPassword.length < 6) { req.flash('error', 'Password must be at least 6 characters.'); return res.redirect('/admin/changepass'); }
    if (newPassword !== confirmPassword) { req.flash('error', 'Passwords do not match.'); return res.redirect('/admin/changepass'); }

    admin.password = newPassword;
    await admin.save();

    req.session.destroy(err => {
      if (err) console.error('Session destroy error:', err);
      res.redirect('/admin/login?success=Password+changed+successfully.+Please+login+again.');
    });
  } catch (err) {
    req.flash('error', err.message);
    res.redirect('/admin/changepass');
  }
};

// API exports (backward compat)
exports.getSubAdmins   = asyncHandler(async (req, res) => {
  const subAdmins = await Admin.find({ adminType: 'sub' }).sort({ createdAt: -1 });
  res.json({ success: true, count: subAdmins.length, data: subAdmins });
});
exports.createSubAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: 'Name, email and password required.' });
  const existing = await Admin.findOne({ email: email.toLowerCase() });
  if (existing) return res.status(400).json({ success: false, message: 'Email already exists.' });
  const subAdmin = await Admin.create({ name, email: email.toLowerCase(), password, adminType: 'sub', createdBy: req.admin._id });
  res.status(201).json({ success: true, data: subAdmin });
});
exports.updateSubAdmin = asyncHandler(async (req, res) => {
  const { name, permissions, isActive } = req.body;
  const subAdmin = await Admin.findOne({ _id: req.params.id, adminType: 'sub' });
  if (!subAdmin) return res.status(404).json({ success: false, message: 'Sub-admin not found.' });
  if (name) subAdmin.name = name;
  if (permissions !== undefined) subAdmin.permissions = permissions.filter(p => Admin.ALL_PERMISSIONS.includes(p));
  if (isActive !== undefined) subAdmin.isActive = isActive;
  await subAdmin.save();
  res.json({ success: true, data: subAdmin });
});
exports.deleteSubAdmin = asyncHandler(async (req, res) => {
  const subAdmin = await Admin.findOne({ _id: req.params.id, adminType: 'sub' });
  if (!subAdmin) return res.status(404).json({ success: false, message: 'Sub-admin not found.' });
  await subAdmin.deleteOne();
  res.json({ success: true, message: 'Deleted.' });
});
exports.getPermissions = asyncHandler(async (req, res) => {
  res.json({ success: true, data: Admin.ALL_PERMISSIONS });
});
exports.getAdminMe = asyncHandler(async (req, res) => {
  res.json({ success: true, admin: req.admin });
});