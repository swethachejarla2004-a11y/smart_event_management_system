const mongoose = require('mongoose');

const volunteerAssignmentSchema = new mongoose.Schema({
  volunteer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  task: { type: String, required: true },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['assigned', 'completed', 'cancelled'], default: 'assigned' },
  instructions: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('VolunteerAssignment', volunteerAssignmentSchema);
