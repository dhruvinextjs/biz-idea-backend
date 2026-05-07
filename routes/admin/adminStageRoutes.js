const express = require('express');
const router = express.Router();
const stageController = require('../../controllers/admin/adminStageController');

// Admin Panel Routes
router.get('/',  stageController.panelList);
router.get('/create',  stageController.panelCreateForm);
router.post('/create',  stageController.panelCreate);
router.get('/edit/:id',  stageController.panelEditForm);
router.post('/edit/:id',  stageController.panelUpdate);
router.get('/delete/:id',  stageController.panelDelete);

// API Routes (Optional)
router.get('/',  stageController.apiGetAll);

module.exports = router