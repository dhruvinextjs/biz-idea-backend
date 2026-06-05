const Bookmark = require("../models/Bookmark");
const BusinessIdea = require("../models/BusinessIdea");
const Post = require("../models/Post");
const Blog = require("../models/Blog");
const CaseStudy = require("../models/CaseStudy");



exports.toggleBookmark = async (req, res) => {
  const { itemId, itemType } = req.body;

  const existing = await Bookmark.findOne({
    user: req.user.id,
    itemId,
    itemType,
  });

  if (existing) {
    await Bookmark.findByIdAndDelete(existing._id);

    return res.json({
      success: true,
      bookmarked: false,
      message: "Removed from bookmarks",
    });
  }

  await Bookmark.create({
    user: req.user.id,
    itemId,
    itemType,
  });

  res.json({
    success: true,
    bookmarked: true,
    message: "Added to bookmarks",
  });
};

exports.getBookmarks = async (req, res) => {
  console.log("USER ID:", req.user.id);

  const bookmarks = await Bookmark.find({
    user: req.user.id,
  }).sort({ createdAt: -1 });

  console.log("BOOKMARKS:", bookmarks);

  const data = [];

  for (const item of bookmarks) {
    console.log("ITEM:", item);

  for (const item of bookmarks) {
  let content = null;

  if (item.itemType === "idea") {
    content = await BusinessIdea.findById(item.itemId);
    console.log("IDEA FOUND:", content);
  }

  if (item.itemType === "blog") {
    content = await Blog.findById(item.itemId);
    console.log("BLOG FOUND:", content);
  }

  if (item.itemType === "post") {
    content = await Post.findById(item.itemId);
    console.log("POST FOUND:", content);
  }

  if (item.itemType === "case-study") {
    content = await CaseStudy.findById(item.itemId);
    console.log("CASE STUDY FOUND:", content);
  }

  if (content) {
    data.push({
      bookmarkId: item._id,
      itemType: item.itemType,
      item: content,
    });
  }
}
  }

  res.json({
    success: true,
    count: data.length,
    data,
  });
};

exports.checkBookmark = async (req, res) => {
  const { itemId, itemType } = req.query;

  const exists = await Bookmark.findOne({
    user: req.user.id,
    itemId,
    itemType,
  });

  res.json({
    success: true,
    bookmarked: !!exists,
  });
};