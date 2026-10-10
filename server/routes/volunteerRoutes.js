const express = require('express');
const router = express.Router();
const { 
  applyForVolunteer, 
  getEventVolunteerApplications, 
  updateApplicationStatus, 
  assignVolunteerTask, 
  getMyVolunteerTasks, 
  getRecommendedVolunteers 
} = require('../controllers/volunteerController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/apply', protect, applyForVolunteer);
router.get('/my-tasks', protect, getMyVolunteerTasks);
router.get('/event/:eventId', protect, authorize('organizer', 'admin'), getEventVolunteerApplications);
router.put('/applications/:id/status', protect, authorize('organizer', 'admin'), updateApplicationStatus);
router.post('/assign', protect, authorize('organizer', 'admin'), assignVolunteerTask);
router.get('/recommend-volunteers/:eventId', protect, authorize('organizer', 'admin'), getRecommendedVolunteers);

module.exports = router;
