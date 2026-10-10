const Club = require('../models/Club');
const User = require('../models/User');

// @desc    Get all clubs
// @route   GET /api/clubs
// @access  Public
const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find()
      .populate('coordinator', 'name email department profileImage')
      .populate('members', 'name email department');
    res.json({ success: true, count: clubs.length, data: clubs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new club
// @route   POST /api/clubs
// @access  Private (Admin / Organizer)
const createClub = async (req, res) => {
  try {
    const { name, description, category, coordinatorId, logo, banner } = req.body;

    const clubExists = await Club.findOne({ name });
    if (clubExists) {
      return res.status(400).json({ success: false, message: 'Club with this name already exists' });
    }

    const club = await Club.create({
      name,
      description,
      category: category || 'Technical',
      coordinator: coordinatorId || req.user._id,
      members: [coordinatorId || req.user._id],
      logo: logo || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300',
      banner: banner || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800'
    });

    res.status(201).json({ success: true, data: club });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Join a club
// @route   PUT /api/clubs/:id/join
// @access  Private (Student)
const joinClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) {
      return res.status(404).json({ success: false, message: 'Club not found' });
    }

    if (club.members.includes(req.user._id)) {
      return res.status(400).json({ success: false, message: 'Already a member of this club' });
    }

    club.members.push(req.user._id);
    await club.save();

    res.json({ success: true, message: `Successfully joined ${club.name}!`, data: club });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getClubs,
  createClub,
  joinClub
};
