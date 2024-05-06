const mongoose = require('mongoose');

const StateSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  funfacts: {
    type: [String],
    default: []
  }
});

module.exports = mongoose.model('State', StateSchema);