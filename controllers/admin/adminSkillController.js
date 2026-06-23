const Skill = require("../../models/Skill");


exports.seedSkills = async () => {
  const count = await Skill.countDocuments();
  if (count === 0) {
    await Skill.insertMany(DEFAULT_SKILLS);
    console.log("✅ Default skills seeded");
  }
};

// ─── API ──────────────────────────────────────────────────────────────────────
exports.apiGetAll = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, order: 1, name: 1 });
    res.json({ success: true, data: skills });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

exports.apiCreate = async (req, res) => {
  try {
    const skill = await Skill.create(req.body);
    res.status(201).json({ success: true, data: skill, message: "Skill created" });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ success: false, message: "Skill already exists" });
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.apiUpdate = async (req, res) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!skill) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, data: skill, message: "Skill updated" });
  } catch (err) { res.status(400).json({ success: false, message: err.message }); }
};

exports.apiDelete = async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Skill deleted" });
  } catch (err) { res.status(500).json({ success: false, message: err.message }); }
};

// ─── PANEL ────────────────────────────────────────────────────────────────────
exports.panelList = async (req, res) => {
  const skills = await Skill.find().sort({ category: 1, order: 1 });
  res.render("admin/skills/list", { layout: "admin/layouts/adminLayout", title: "Skills",skills: skills || [],adminMeta: req.adminMeta || req.user || { adminType: 'super' } });
};
// skills, adminMeta: req.adminMeta || { 
//         adminType: 'super', 
//         permissions: ['skills', 'dashboard', 'ideas', 'users'] // temporary fallback
//       } 

exports.panelCreateForm = (req, res) => {
  res.render("admin/skills/form", { layout: "admin/layouts/adminLayout", title: "Add Skill", skill: null, action: "/admin/skills/create",adminMeta: req.adminMeta || req.user || { adminType: 'super' } });
};

exports.panelCreate = async (req, res) => {
  try {
    const data = { ...req.body, isActive: req.body.isActive === "on" }; 
    await Skill.create(data);
    req.flash("success", "Skill created!");
    res.redirect("/admin/skills");
  } catch (err) {
    req.flash("error", err.code === 11000 ? "Skill name already exists" : err.message);
    res.redirect("/admin/skills/create");
  }
};

exports.panelEditForm = async (req, res) => {
  const skill = await Skill.findById(req.params.id);
  if (!skill) { req.flash("error", "Not found"); return res.redirect("/admin/skills"); }
  res.render("admin/skills/form", { layout: "admin/layouts/adminLayout", title: "Edit Skill", skill, action: `/admin/skills/edit/${skill._id}` });
};

exports.panelUpdate = async (req, res) => {
  try {
    const data = { ...req.body, isActive: req.body.isActive === "on" };
    await Skill.findByIdAndUpdate(req.params.id, data);
    req.flash("success", "Skill updated!");
    res.redirect("/admin/skills");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect(`/admin/skills/edit/${req.params.id}`);
  }
};

exports.panelDelete = async (req, res) => {
  await Skill.findByIdAndDelete(req.params.id);
  req.flash("success", "Skill deleted");
  res.redirect("/admin/skills");
};
