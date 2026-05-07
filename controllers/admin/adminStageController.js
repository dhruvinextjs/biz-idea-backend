const Stage = require("../../models/Stage");

// ====================== API ROUTES (Frontend + JSON) ======================

// Get all stages for signup
exports.getStages = async (req, res) => {
  try {
    const stages = await Stage.find({ isActive: true })
      .sort({ order: 1, name: 1 });

    res.json({
      success: true,
      step: 2,
      question: "Which best describes the stage you're at right now?",
      data: stages.map(stage => ({
        id: stage._id,
        name: stage.name,
        description: stage.description || ""
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ====================== ADMIN API ======================
exports.apiGetAll = async (req, res) => {
  try {
    const stages = await Stage.find().sort({ order: 1, name: 1 });
    res.json({ success: true, data: stages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.apiCreate = async (req, res) => {
  try {
    const stage = await Stage.create(req.body);
    res.status(201).json({ success: true, data: stage, message: "Stage created" });
  } catch (err) {
    if (err.code === 11000) 
      return res.status(409).json({ success: false, message: "Stage name already exists" });
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.apiUpdate = async (req, res) => {
  try {
    const stage = await Stage.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!stage) return res.status(404).json({ success: false, message: "Stage not found" });
    res.json({ success: true, data: stage, message: "Stage updated" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

exports.apiDelete = async (req, res) => {
  try {
    await Stage.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Stage deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ====================== ADMIN PANEL (EJS) ======================

exports.panelList = async (req, res) => {
  try {
    const stages = await Stage.find().sort({ order: 1, name: 1 });
    res.render("admin/stages/list", { 
      layout: "admin/layouts/adminLayout", 
      title: "Manage Stages",
      stages: stages || [],
      adminMeta: req.adminMeta || { adminType: 'super' }
    });
  } catch (err) {
    req.flash("error", "Something went wrong");
    res.redirect("/admin");
  }
};

exports.panelCreateForm = (req, res) => {
  res.render("admin/stages/form", { 
    layout: "admin/layouts/adminLayout", 
    title: "Add New Stage",
    stage: null, 
    action: "/admin/stages/create",
    adminMeta: req.adminMeta || { adminType: 'super' }
  });
};

exports.panelCreate = async (req, res) => {
  try {
    const { name, description, order, isActive } = req.body;

    if (!name || name.trim() === "") {
      req.flash("error", "Stage name is required");
      return res.redirect("/admin/stages/create");
    }

    const stageData = {
      name: name.trim(),
      description: description ? description.trim() : "",
      order: order ? parseInt(order) : 0,
      isActive: isActive === "on" || isActive === true
    };

    const stage = await Stage.create(stageData);

    console.log("✅ Stage Created Successfully:", stage); // Debugging

    req.flash("success", "Stage created successfully!");
    res.redirect("/admin/stages");
  } catch (err) {
    console.error("Stage Create Error:", err);
    req.flash("error", err.code === 11000 ? "Stage name already exists" : err.message);
    res.redirect("/admin/stages/create");
  }
};

exports.panelEditForm = async (req, res) => {
  try {
    const stage = await Stage.findById(req.params.id);
    if (!stage) {
      req.flash("error", "Stage not found");
      return res.redirect("/admin/stages");
    }

    res.render("admin/stages/form", { 
      layout: "admin/layouts/adminLayout", 
      title: "Edit Stage",
      stage,
      action: `/admin/stages/edit/${stage._id}`,
      adminMeta: req.adminMeta || { adminType: 'super' }
    });
  } catch (err) {
    req.flash("error", "Something went wrong");
    res.redirect("/admin/stages");
  }
};

exports.panelUpdate = async (req, res) => {
  try {
    const data = { 
      ...req.body, 
      isActive: req.body.isActive === "on" 
    };
    await Stage.findByIdAndUpdate(req.params.id, data);
    req.flash("success", "Stage updated successfully!");
    res.redirect("/admin/stages");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect(`/admin/stages/edit/${req.params.id}`);
  }
};

exports.panelDelete = async (req, res) => {
  try {
    await Stage.findByIdAndDelete(req.params.id);
    req.flash("success", "Stage deleted successfully");
    res.redirect("/admin/stages");
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/admin/stages");
  }
};