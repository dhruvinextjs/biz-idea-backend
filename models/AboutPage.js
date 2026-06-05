const mongoose = require('mongoose');

const aboutPageSchema = new mongoose.Schema(
{
  headingLine1: String,
  headingLine2: String,
  headingLine3: String,

  description1: String,
  description2: String,

  founderImage: String,
  founderName: String,
  storyTitle: String,
  storyContent: String,

  missionTitle: String,
  missionDescription: String,

  visionTitle: String,
  visionDescription: String,

  businessIdeas: String,
  startupIdeas: String,
  communityMembers: String,
  projectsLaunched: String,

  isActive:{
    type:Boolean,
    default:true
  }
},
{
  timestamps:true
}
);

module.exports = mongoose.model('AboutPage', aboutPageSchema);