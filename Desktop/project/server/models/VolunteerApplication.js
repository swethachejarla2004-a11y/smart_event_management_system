const mongoose = require('mongoose');

const volunteerApplicationSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  preferredTask: { type: String, default: 'General Support' },
  skills: [{ type: String }],
  availability: [{ type: String }],
  notes: { type: String, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  appliedAt: { type: Date, default: Date.now }
}, { timestamps: true });

volunteerApplicationSchema.index({ student: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('VolunteerApplication', volunteerApplicationSchema);
