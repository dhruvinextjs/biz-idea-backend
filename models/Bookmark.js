const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    itemType: {
      type: String,
      enum: ["idea", "post", "case-study", "blog"],
      required: true,
    },
  },
  { timestamps: true }
);

bookmarkSchema.index(
  {
    user: 1,
    itemId: 1,
    itemType: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model("Bookmark", bookmarkSchema);