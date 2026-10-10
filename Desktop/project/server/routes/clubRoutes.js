const express = require('express');
const router = express.Router();
const { getClubs, createClub, joinClub } = require('../controllers/clubController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/', getClubs);
router.post('/', protect, authorize('admin', 'organizer'), createClub);
router.put('/:id/join', protect, joinClub);

module.exports = router;
