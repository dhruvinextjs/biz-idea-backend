const router = require("express").Router();
const c = require("../../controllers/admin/adminSkillController");

// ====================== API Routes ======================
router.get("/api", c.apiGetAll);           // API - Get all skills
router.post("/api", c.apiCreate);          // API - Create
router.put("/api/:id", c.apiUpdate);       // API - Update
router.delete("/api/:id", c.apiDelete);    // API - Delete

// ====================== PANEL (HTML) Routes ======================
router.get("/", c.panelList);                    // Main List Page
router.get("/create", c.panelCreateForm);        // Create Form
router.post("/create", c.panelCreate);           // Create Submit
router.get("/edit/:id", c.panelEditForm);        // Edit Form
router.post("/edit/:id", c.panelUpdate);         // Update Submit
router.post("/delete/:id", c.panelDelete);       // Delete

module.exports = router;