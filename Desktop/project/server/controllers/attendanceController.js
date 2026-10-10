const Attendance = require('../models/Attendance');
const Registration = require('../models/Registration');
const Event = require('../models/Event');
const Notification = require('../models/Notification');
const QRCode = require('qrcode');

// @desc    Generate QR code data & base64 image for an event
// @route   GET /api/attendance/qrcode/:eventId
// @access  Private (Organizer / Admin)
const generateEventQRCode = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const payload = JSON.stringify({
      eventId: event._id,
      title: event.title,
      secret: event.qrCodeSecret || `QR-EVENT-${event._id}`,
      timestamp: Date.now()
    });

    const qrImage = await QRCode.toDataURL(payload);

    res.json({
      success: true,
      data: {
        eventId: event._id,
        payload,
        qrImage,
        secret: event.qrCodeSecret
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify QR Code payload & record student attendance
// @route   POST /api/attendance/scan
// @access  Private (Student)
const scanAttendanceQR = async (req, res) => {
  try {
    const { qrData, eventId } = req.body;
    const studentId = req.user._id;

    let targetEventId = eventId;
    let qrSecret = null;

    // Parse payload if provided as raw string
    if (qrData) {
      try {
        const parsed = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;
        if (parsed.eventId) targetEventId = parsed.eventId;
        if (parsed.secret) qrSecret = parsed.secret;
      } catch (e) {
        // Raw code or token string fallback
        qrSecret = qrData;
      }
    }

    if (!targetEventId) {
      return res.status(400).json({ success: false, message: 'Event identification missing from QR scan' });
    }

    const event = await Event.findById(targetEventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // 1. Verify student is registered
    const registration = await Registration.findOne({ student: studentId, event: targetEventId });
    if (!registration || registration.status === 'cancelled') {
      return res.status(400).json({ 
        success: false, 
        message: 'Attendance failed: You are not registered for this event. Please register first.' 
      });
    }

    // 2. Prevent duplicate attendance
    const existingAttendance = await Attendance.findOne({ student: studentId, event: targetEventId });
    if (existingAttendance) {
      return res.status(400).json({ 
        success: false, 
        message: `Attendance already recorded on ${new Date(existingAttendance.scannedAt).toLocaleTimeString()}` 
      });
    }

    // 3. Record attendance
    const verificationCode = `ATT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const attendance = await Attendance.create({
      student: studentId,
      event: targetEventId,
      scannedAt: Date.now(),
      attendanceStatus: 'present',
      verificationCode
    });

    // Update registration status to 'attended'
    registration.status = 'attended';
    await registration.save();

    // Create Notification
    await Notification.create({
      user: studentId,
      title: 'Attendance Marked! ✅',
      message: `Your attendance for "${event.title}" has been successfully recorded. Code: ${verificationCode}`,
      type: 'attendance',
      link: '/attendance'
    });

    res.status(201).json({
      success: true,
      message: 'Attendance verified and recorded successfully!',
      data: {
        attendance,
        eventTitle: event.title
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student's attendance history
// @route   GET /api/attendance/my-attendance
// @access  Private (Student)
const getMyAttendance = async (req, res) => {
  try {
    const attendanceRecords = await Attendance.find({ student: req.user._id })
      .populate('event', 'title category date startTime venue image')
      .sort({ scannedAt: -1 });

    const totalRegistrations = await Registration.countDocuments({ student: req.user._id, status: { $ne: 'cancelled' } });
    const totalAttended = attendanceRecords.length;
    const attendanceRate = totalRegistrations > 0 ? Math.round((totalAttended / totalRegistrations) * 100) : 100;

    res.json({
      success: true,
      summary: {
        totalRegistrations,
        totalAttended,
        attendanceRate
      },
      data: attendanceRecords
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get event attendance records (Organizer / Admin view)
// @route   GET /api/attendance/event/:eventId
// @access  Private (Organizer / Admin)
const getEventAttendance = async (req, res) => {
  try {
    const records = await Attendance.find({ event: req.params.eventId })
      .populate('student', 'name email department year profileImage phone')
      .sort({ scannedAt: -1 });

    res.json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  generateEventQRCode,
  scanAttendanceQR,
  getMyAttendance,
  getEventAttendance
};
