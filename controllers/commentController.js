const Comment = require("../models/Comment");

exports.addComment = async (req, res) => {
  try {
    const { itemId, itemType, text } = req.body;

    const comment = await Comment.create({
      user: req.user._id,
      itemId,
      itemType,
      text,
    });

    res.status(201).json({
      success: true,
      data: comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.getComments = async (req, res) => {
  try {
    const { itemId, itemType } = req.query;

const comments = await Comment.find({
  itemId,
  itemType,
})
.populate("user", "name")
.populate("likes", "_id")
.populate("replies.user", "name")
.sort({ createdAt: -1 });

    res.json({
      success: true,
      count: comments.length,
        data: comments.map((c) => ({
    _id: c._id,
    text: c.text,
    user: c.user,
    createdAt: c.createdAt,
    likesCount: c.likes.length,
    likes: c.likes,

     replies: c.replies.map((reply) => ({
    _id: reply._id,
    text: reply.text,
    user: reply.user,
    createdAt: reply.createdAt,
    likesCount: reply.likes ? reply.likes.length : 0,
    likes: reply.likes || [],
  })),
  })),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.toggleCommentLike = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const userId = req.user._id;

    const alreadyLiked = comment.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      comment.likes = comment.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.json({
      success: true,
      liked: !alreadyLiked,
      likesCount: comment.likes.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.addReply = async (req, res) => {
  try {
    const { text } = req.body;

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    if (!comment.replies) {
  comment.replies = [];
}


    comment.replies.push({
      user: req.user._id,
      text,
    });

    await comment.save();

    res.status(201).json({
      success: true,
      message: "Reply added successfully",
      repliesCount: comment.replies.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.toggleReplyLike = async (req, res) => {
  try {
    const { commentId, replyId } = req.params;

    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    const reply = comment.replies.id(replyId);

    if (!reply) {
      return res.status(404).json({
        success: false,
        message: "Reply not found",
      });
    }

    const userId = req.user._id;

    const alreadyLiked = reply.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (alreadyLiked) {
      reply.likes = reply.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      reply.likes.push(userId);
    }

    await comment.save();

    res.json({
      success: true,
      liked: !alreadyLiked,
      likesCount: reply.likes.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};