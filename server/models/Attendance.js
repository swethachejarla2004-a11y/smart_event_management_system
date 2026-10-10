const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  scannedAt: { type: Date, default: Date.now },
  attendanceStatus: { type: String, enum: ['present', 'absent', 'late'], default: 'present' },
  verificationCode: { type: String, required: true }
}, { timestamps: true });

attendanceSchema.index({ student: 1, event: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
