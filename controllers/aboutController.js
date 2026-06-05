const AboutPage = require('../models/AboutPage');

exports.getAboutPage = async (req, res) => {
  try {

    const about = await AboutPage.findOne({
      isActive: true
    });

    res.status(200).json({
      success: true,
      data: about
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};