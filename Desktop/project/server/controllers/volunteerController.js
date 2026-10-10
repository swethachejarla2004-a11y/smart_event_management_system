const VolunteerApplication = require('../models/VolunteerApplication');
const VolunteerAssignment = require('../models/VolunteerAssignment');
const Event = require('../models/Event');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { matchVolunteerToTasks } = require('../services/volunteerMatcher');

// @desc    Apply as a volunteer for an event
// @route   POST /api/volunteers/apply
// @access  Private (Student)
const applyForVolunteer = async (req, res) => {
  try {
    const { eventId, preferredTask, notes } = req.body;
    const studentId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const existingApp = await VolunteerApplication.findOne({ student: studentId, event: eventId });
    if (existingApp) {
      return res.status(400).json({ success: false, message: 'You have already applied for volunteering in this event' });
    }

    const user = await User.findById(studentId);

    const application = await VolunteerApplication.create({
      student: studentId,
      event: eventId,
      preferredTask: preferredTask || 'General Support',
      skills: user.skills || [],
      availability: user.availability || [],
      notes: notes || ''
    });

    // Notify student
    await Notification.create({
      user: studentId,
      title: 'Volunteer Application Submitted',
      message: `Your volunteer application for "${event.title}" has been submitted for review.`,
      type: 'volunteer'
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get volunteer applications for an event (Organizer/Admin)
// @route   GET /api/volunteers/event/:eventId
// @access  Private (Organizer / Admin)
const getEventVolunteerApplications = async (req, res) => {
  try {
    const applications = await VolunteerApplication.find({ event: req.params.eventId })
      .populate('student', 'name email department year phone skills availability profileImage')
      .sort({ appliedAt: -1 });

    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or reject volunteer application
// @route   PUT /api/volunteers/applications/:id/status
// @access  Private (Organizer / Admin)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const application = await VolunteerApplication.findById(req.params.id).populate('event');
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.status = status;
    await application.save();

    // Send notification to student
    await Notification.create({
      user: application.student,
      title: status === 'approved' ? 'Volunteer Application Approved! 🎉' : 'Volunteer Application Update',
      message: status === 'approved' 
        ? `Congratulations! Your volunteer application for "${application.event.title}" has been approved.` 
        : `Update on your volunteer application for "${application.event.title}".`,
      type: 'volunteer'
    });

    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Assign task to volunteer
// @route   POST /api/volunteers/assign
// @access  Private (Organizer / Admin)
const assignVolunteerTask = async (req, res) => {
  try {
    const { volunteerId, studentId, eventId, task, instructions } = req.body;
    const targetVolunteerId = volunteerId || studentId;

    if (!targetVolunteerId) {
      return res.status(400).json({ success: false, message: 'Volunteer ID or Student ID is required' });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const assignment = await VolunteerAssignment.create({
      volunteer: targetVolunteerId,
      event: eventId,
      task,
      assignedBy: req.user._id,
      instructions: instructions || 'Please arrive 15 minutes before event start time.'
    });

    await Notification.create({
      user: targetVolunteerId,
      title: 'Volunteer Task Assigned',
      message: `You have been assigned task "${task}" for "${event.title}".`,
      type: 'volunteer'
    });

    res.status(201).json({ success: true, data: assignment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get student's volunteer applications & assigned tasks
// @route   GET /api/volunteers/my-tasks
// @access  Private (Student)
const getMyVolunteerTasks = async (req, res) => {
  try {
    const applications = await VolunteerApplication.find({ student: req.user._id })
      .populate('event', 'title category date startTime endTime venue image status')
      .sort({ appliedAt: -1 });

    const assignments = await VolunteerAssignment.find({ volunteer: req.user._id })
      .populate('event', 'title category date startTime endTime venue image status')
      .populate('assignedBy', 'name email phone')
      .sort({ createdAt: -1 });

    res.json({ 
      success: true, 
      data: {
        applications,
        assignments
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get AI matched volunteer candidates for an event's tasks
// @route   GET /api/volunteers/recommend-volunteers/:eventId
// @access  Private (Organizer / Admin)
const getRecommendedVolunteers = async (req, res) => {
  try {
    const event = await Event.findById(req.params.eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    // Get volunteer applicants for this event
    const applications = await VolunteerApplication.find({ event: req.params.eventId })
      .populate('student', 'name email department year skills availability profileImage');

    let candidatesList = [];

    if (applications.length > 0) {
      candidatesList = applications.map(app => ({
        applicant: app,
        student: app.student
      }));
    } else {
      // Fallback: Recommend general campus students matched by skill
      const allStudents = await User.find({ role: 'student' }).select('name email department year skills availability profileImage').limit(10);
      candidatesList = allStudents.map(st => ({ applicant: null, student: st }));
    }

    const matches = candidatesList.map(({ applicant, student }) => {
      const taskMatches = matchVolunteerToTasks(student, event);
      const topTask = taskMatches[0] || null;
      return {
        applicant,
        student,
        topMatchedTask: topTask,
        allTaskMatches: taskMatches,
        matchScore: topTask?.matchScore || 70,
        matchedSkills: student?.skills || []
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    res.json({ success: true, data: matches });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  applyForVolunteer,
  getEventVolunteerApplications,
  updateApplicationStatus,
  assignVolunteerTask,
  getMyVolunteerTasks,
  getRecommendedVolunteers
};
