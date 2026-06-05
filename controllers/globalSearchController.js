const BusinessIdea = require("../models/BusinessIdea");
const Blog = require("../models/Blog");
const Post = require("../models/Post");
const CaseStudy = require("../models/CaseStudy");

exports.globalSearch = async (req, res) => {
  try {
    const search = req.query.search?.trim();

    if (!search) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }

    const regex = new RegExp(search, "i");

    const [ideas, blogs, posts, caseStudies] = await Promise.all([
      BusinessIdea.find({
        $or: [
          { title: regex },
          { description: regex },
          { tags: regex },
        ],
      }).limit(10),

      Blog.find({
        $or: [
          { title: regex },
          { description: regex },
        ],
      }).limit(10),

      Post.find({
        $or: [
          { title: regex },
          { content: regex },
        ],
      }).limit(10),

      CaseStudy.find({
        $or: [
          { title: regex },
          { description: regex },
        ],
      }).limit(10),
    ]);

    res.status(200).json({
      success: true,
      data: {
        ideas,
        blogs,
        posts,
        caseStudies,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};