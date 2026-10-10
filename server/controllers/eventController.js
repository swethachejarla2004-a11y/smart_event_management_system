const Event = require('../models/Event');
const Registration = require('../models/Registration');
const Attendance = require('../models/Attendance');

// @desc    Get all events with search & filters
// @route   GET /api/events
// @access  Public
const getEvents = async (req, res) => {
  try {
    const { search, category, venue, status, date } = req.query;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } }
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (venue) {
      query.venue = { $regex: venue, $options: 'i' };
    }

    if (status) {
      query.status = status;
    } else {
      // Default to non-cancelled events for general listing unless specified
      query.status = { $ne: 'cancelled' };
    }

    if (date) {
      const filterDate = new Date(date);
      const nextDate = new Date(filterDate);
      nextDate.setDate(nextDate.getDate() + 1);
      query.date = { $gte: filterDate, $lt: nextDate };
    }

    const events = await Event.find(query)
      .populate('organizer', 'name email department profileImage')
      .sort({ date: 1 });

    res.json({ success: true, count: events.length, data: events });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('organizer', 'name email department profileImage phone');
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Organizer / Admin)
const createEvent = async (req, res) => {
  try {
    const { 
      title, description, category, date, startTime, endTime, 
      venue, maxParticipants, requiredVolunteers, requiredSkills, 
      volunteerTasks, registrationDeadline, image 
    } = req.body;

    const finalRegistrationDeadline = registrationDeadline || date || new Date();

    const event = await Event.create({
      title,
      description,
      category,
      date,
      startTime,
      endTime,
      venue,
      organizer: req.user._id,
      maxParticipants: maxParticipants || 100,
      requiredVolunteers: requiredVolunteers || 5,
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : (requiredSkills ? requiredSkills.split(',').map(s => s.trim()) : []),
      volunteerTasks: volunteerTasks || [],
      registrationDeadline: finalRegistrationDeadline,
      image: image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800',
      qrCodeSecret: `QR-EVENT-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    });

    res.status(201).json({ success: true, data: event });
  } catch (error) {
    const statusCode = error.name === 'ValidationError' ? 400 : 500;
    res.status(statusCode).json({ success: false, message: error.message });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Organizer / Admin)
const updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (req.user.role !== 'admin' && event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this event' });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, data: event });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete or Cancel event
// @route   DELETE /api/events/:id
// @access  Private (Organizer / Admin)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (req.user.role !== 'admin' && event.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this event' });
    }

    await event.deleteOne();
    res.json({ success: true, message: 'Event removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get events created by current organizer
// @route   GET /api/events/organizer/my-events
// @access  Private (Organizer / Admin)
const getMyOrganizedEvents = async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { organizer: req.user._id };
    const events = await Event.find(query).sort({ date: -1 });

    // Attach registration & attendance stats for each event
    const eventsWithStats = await Promise.all(events.map(async (ev) => {
      const totalRegistrations = await Registration.countDocuments({ event: ev._id, status: { $ne: 'cancelled' } });
      const totalAttended = await Attendance.countDocuments({ event: ev._id });
      return {
        ...ev.toObject(),
        totalRegistrations,
        registeredCount: totalRegistrations,
        capacity: ev.maxParticipants,
        totalAttended
      };
    }));

    res.json({ success: true, count: eventsWithStats.length, data: eventsWithStats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getMyOrganizedEvents
};
