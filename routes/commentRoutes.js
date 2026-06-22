const express = require("express");
const router = express.Router();

const {
  addComment,
  getComments,
  toggleCommentLike,
  addReply,
  toggleReplyLike
} = require("../controllers/commentController");

const { protect } = require("../middleware/auth");

router.post("/", protect, addComment);

router.get("/", getComments);

router.post("/:id/like", protect, toggleCommentLike);

router.post("/:id/reply", protect, addReply);

router.post(
  "/:commentId/replies/:replyId/like",
  protect,
  toggleReplyLike
);

module.exports = router;