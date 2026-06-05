const express = require("express");
const router = express.Router();

const {
  toggleBookmark,
  getBookmarks,
  checkBookmark,
} = require("../controllers/bookmarkController");

const { protect } = require("../middleware/auth");

router.post("/", protect, toggleBookmark);

router.get("/", protect, getBookmarks);

router.get("/check", protect, checkBookmark);

module.exports = router;