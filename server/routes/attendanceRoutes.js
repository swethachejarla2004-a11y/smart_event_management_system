const express = require('express');
const router = express.Router();
const { 
  generateEventQRCode, 
  scanAttendanceQR, 
  getMyAttendance, 
  getEventAttendance 
} = require('../controllers/attendanceController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.get('/qrcode/:eventId', protect, authorize('organizer', 'admin'), generateEventQRCode);
router.post('/scan', protect, scanAttendanceQR);
router.get('/my-attendance', protect, getMyAttendance);
router.get('/event/:eventId', protect, authorize('organizer', 'admin'), getEventAttendance);

module.exports = router;
