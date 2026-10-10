const User = require('../models/User');

// @desc    Update student user profile (skills, interests, preferredCategories, availability)
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const { name, phone, department, year, skills, interests, preferredCategories, availability, profileImage } = req.body;

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (department) user.department = department;
    if (year) user.year = year;
    if (skills) user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    if (interests) user.interests = Array.isArray(interests) ? interests : interests.split(',').map(i => i.trim());
    if (preferredCategories) user.preferredCategories = Array.isArray(preferredCategories) ? preferredCategories : preferredCategories.split(',').map(c => c.trim());
    if (availability) user.availability = Array.isArray(availability) ? availability : availability.split(',').map(a => a.trim());
    if (profileImage) user.profileImage = profileImage;

    const updatedUser = await user.save();

    res.json({
      success: true,
      data: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        department: updatedUser.department,
        year: updatedUser.year,
        skills: updatedUser.skills,
        interests: updatedUser.interests,
        preferredCategories: updatedUser.preferredCategories,
        availability: updatedUser.availability,
        profileImage: updatedUser.profileImage
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  updateProfile
};
