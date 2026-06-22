const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
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
      enum: ["idea", "blog", "case-study","post"],
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },


    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

     replies: {
  type: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      text: {
        type: String,
        required: true,
      },

      likes: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      ],

      createdAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
}
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Comment", commentSchema);