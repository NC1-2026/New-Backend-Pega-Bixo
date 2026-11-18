const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  durationMinutes: { type: Number, required: true },
  active: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);