const mongoose = require('mongoose');

/**
 * Match Schema with a flexible `score` Mixed type to support
 * sport-specific scoring structures (Cricket, Badminton, Kabaddi, Kho-Kho).
 */
const matchSchema = new mongoose.Schema({
  sport: {
    type: String,
    enum: ['cricket', 'badminton', 'kabaddi', 'kho-kho'],
    required: [true, 'Sport type is required'],
  },
  teamA: {
    type: String,
    required: [true, 'Team A name is required'],
    trim: true,
  },
  teamB: {
    type: String,
    required: [true, 'Team B name is required'],
    trim: true,
  },
  status: {
    type: String,
    enum: ['upcoming', 'live', 'paused', 'completed'],
    default: 'upcoming',
  },
  // Dynamic score object – structure depends on sport
  score: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  // History of score objects for undo functionality
  scoreHistory: [
    {
      score: mongoose.Schema.Types.Mixed,
      event: String,
      timestamp: { type: Date, default: Date.now },
    }
  ],
  // Optional: winner for completed matches
  winner: {
    type: String,
    default: null,
  },
  // Events log (optional, stores significant game events)
  events: [
    {
      description: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, { timestamps: true });

module.exports = mongoose.model('Match', matchSchema);
