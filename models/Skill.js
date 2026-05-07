const mongoose = require("mongoose");

const skillSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true, unique: true },
    category: { type: String, default: "General", trim: true },
    icon:     { type: String, default: "💡" }, // emoji or icon class
    isActive: { type: Boolean, default: true },
    order:    { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Skill", skillSchema);
