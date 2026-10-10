const express = require('express');
const router = express.Router();
const { 
  registerForEvent, 
  cancelRegistration, 
  getMyRegistrations, 
  getEventRegistrations 
} = require('../controllers/registrationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.post('/', protect, registerForEvent);
router.get('/my-registrations', protect, getMyRegistrations);
router.put('/:id/cancel', protect, cancelRegistration);
router.get('/event/:eventId', protect, authorize('organizer', 'admin'), getEventRegistrations);

module.exports = router;
