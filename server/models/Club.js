const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  category: { type: String, default: 'Technical' },
  coordinator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  logo: { type: String, default: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300' },
  banner: { type: String, default: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800' },
  establishedYear: { type: Number, default: 2022 }
}, { timestamps: true });

module.exports = mongoose.model('Club', clubSchema);
