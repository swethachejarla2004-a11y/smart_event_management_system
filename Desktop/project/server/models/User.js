const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['student', 'organizer', 'admin'], 
    default: 'student' 
  },
  phone: { type: String, default: '' },
  department: { type: String, default: 'Computer Science' },
  year: { type: String, default: '3rd Year' },
  skills: [{ type: String }],
  interests: [{ type: String }],
  preferredCategories: [{ type: String }],
  availability: [{ type: String }], // e.g. ["Monday Morning", "Saturday Afternoon", "Weekends"]
  profileImage: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300' },
  status: { type: String, enum: ['active', 'blocked'], default: 'active' }
}, { timestamps: true });

// Password hash middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
