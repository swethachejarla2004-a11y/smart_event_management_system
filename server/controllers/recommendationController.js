const Event = require('../models/Event');
const Registration = require('../models/Registration');
const { getPersonalizedEventRecommendations } = require('../services/recommendationEngine');

// @desc    Get personalized event recommendations for student
// @route   GET /api/recommendations/events
// @access  Private (Student)
const getEventRecommendations = async (req, res) => {
  try {
    const student = req.user;
    const upcomingEvents = await Event.find({ status: 'published' }).populate('organizer', 'name email department');
    const userHistory = await Registration.find({ student: student._id }).populate('event');

    const recommendations = getPersonalizedEventRecommendations(student, upcomingEvents, userHistory);

    res.json({
      success: true,
      count: recommendations.length,
      data: recommendations
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getEventRecommendations
};
