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
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};