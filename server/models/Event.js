const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Technical', 'Workshops', 'Hackathons', 'Cultural', 'Sports', 'Social Service', 'Management', 'Seminars']
  },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  venue: { type: String, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  maxParticipants: { type: Number, default: 100 },
  requiredVolunteers: { type: Number, default: 5 },
  requiredSkills: [{ type: String }],
  volunteerTasks: [{
    title: { type: String, required: true },
    description: { type: String },
    requiredSkills: [{ type: String }],
    slotsNeeded: { type: Number, default: 2 }
  }],
  registrationDeadline: { type: Date, required: true },
  image: { type: String, default: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800' },
  status: { 
    type: String, 
    enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled'], 
    default: 'published' 
  },
  qrCodeSecret: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
