const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
  alias: {
    type: String,
    required: true,
    unique: true,  // ✅ this ensures no duplicate aliases allowed
  },
  expirationDate: {
    type: Date,
  },
  clicks: {
    type: Number,
    default: 0,
  },
  userId: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Url', urlSchema);
