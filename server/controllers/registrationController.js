const Registration = require('../models/Registration');
const Event = require('../models/Event');
const Notification = require('../models/Notification');

// @desc    Register student for an event
// @route   POST /api/registrations
// @access  Private (Student)
const registerForEvent = async (req, res) => {
  try {
    const { eventId } = req.body;
    const studentId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.status === 'cancelled') {
      return res.status(400).json({ success: false, message: 'This event has been cancelled' });
    }

    // Check capacity
    const currentCount = await Registration.countDocuments({ event: eventId, status: 'registered' });
    if (currentCount >= event.maxParticipants) {
      return res.status(400).json({ success: false, message: 'Event registration is full' });
    }

    // Check existing registration
    const existing = await Registration.findOne({ student: studentId, event: eventId });
    if (existing) {
      if (existing.status === 'registered') {
        return res.status(400).json({ success: false, message: 'Already registered for this event' });
      } else {
        // Re-activate registration
        existing.status = 'registered';
        existing.registrationDate = Date.now();
        await existing.save();

        // Send notification
        await Notification.create({
          user: studentId,
          title: 'Registration Restored',
          message: `Your registration for "${event.title}" has been restored.`,
          type: 'event',
          link: `/events/${event._id}`
        });

        return res.json({ success: true, data: existing });
      }
    }

    // Create unique ticket code
    const ticketCode = `TKT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const registration = await Registration.create({
      student: studentId,
      event: eventId,
      ticketCode
    });

    // Send in-app notification
    await Notification.create({
      user: studentId,
      title: 'Registration Successful',
      message: `You are successfully registered for "${event.title}". Access your ticket in your dashboard.`,
      type: 'event',
      link: `/events/${event._id}`
    });

    res.status(201).json({ success: true, data: registration });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel student event registration
// @route   PUT /api/registrations/:id/cancel
// @access  Private (Student)
const cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id).populate('event');
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration record not found' });
    }

    if (registration.student.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    registration.status = 'cancelled';
    await registration.save();

    await Notification.create({
      user: registration.student,
      title: 'Registration Cancelled',
      message: `Your registration for "${registration.event.title}" was cancelled.`,
      type: 'event'
    });

    res.json({ success: true, message: 'Registration cancelled', data: registration });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get logged in student's registered events
// @route   GET /api/registrations/my-registrations
// @access  Private (Student)
const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ student: req.user._id })
      .populate({
        path: 'event',
        populate: { path: 'organizer', select: 'name email department' }
      })
      .sort({ registrationDate: -1 });

    res.json({ success: true, count: registrations.length, data: registrations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get registered participants for a specific event (Organizer/Admin view)
// @route   GET /api/registrations/event/:eventId
// @access  Private (Organizer / Admin)
const getEventRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ event: req.params.eventId })
      .populate('student', 'name email department year phone skills profileImage')
      .sort({ registrationDate: -1 });

    res.json({ success: true, count: registrations.length, data: registrations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerForEvent,
  cancelRegistration,
  getMyRegistrations,
  getEventRegistrations
};
