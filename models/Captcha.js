const mongoose = require("mongoose");

const captchaSchema = new mongoose.Schema(
{
  question:String,
  answer:Number,
},
{
  timestamps:true
}
);

module.exports = mongoose.model(
  "Captcha",
  captchaSchema
);