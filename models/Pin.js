const mongoose = require('mongoose');

const pinSchema = new mongoose.Schema({
    title: { type: String, required: true },
  desc: { type: String },
  imageUrl: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tags: [String],
}, {timestamps: true });

module.exports = mongoose.model('Pin', pinSchema);