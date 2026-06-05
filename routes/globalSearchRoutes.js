const express = require("express");
const router = express.Router();
const { globalSearch } = require("../controllers/globalSearchController");

router.get("/", globalSearch);

module.exports = router;