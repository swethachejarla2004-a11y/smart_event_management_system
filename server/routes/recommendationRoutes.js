const express = require('express');
const router = express.Router();
const { getEventRecommendations } = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/events', protect, getEventRecommendations);

module.exports = router;
