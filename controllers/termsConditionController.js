const TermsCondition = require('../models/TermsCondition');

exports.getTermsCondition = async (req, res) => {
  try {
    const terms = await TermsCondition.findOne({
      isActive: true
    }).sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      data: terms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};