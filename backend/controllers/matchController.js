const Match = require('../models/Match');

/**
 * Build the default score object based on sport type
 */
const defaultScore = (sport) => {
  switch (sport) {
    case 'cricket':
      return {
        teamA: { runs: 0, wickets: 0, overs: '0.0' },
        teamB: { runs: 0, wickets: 0, overs: '0.0' },
        currentInnings: 1,
      };
    case 'badminton':
      return {
        teamA: { points: 0, sets: 0, setHistory: [] },
        teamB: { points: 0, sets: 0, setHistory: [] },
        currentSet: 1,
      };
    case 'kabaddi':
      return {
        teamA: { raidPoints: 0, tacklePoints: 0, bonusPoints: 0, totalPoints: 0 },
        teamB: { raidPoints: 0, tacklePoints: 0, bonusPoints: 0, totalPoints: 0 },
      };
    case 'kho-kho':
      return {
        teamA: { points: 0, chasersTime: 0 },
        teamB: { points: 0, chasersTime: 0 },
        turn: 'teamA',
        timeRemaining: 540, // 9 minutes in seconds
        timerRunning: false,
      };
    default:
      return {};
  }
};

/**
 * @desc    Get all matches
 * @route   GET /api/matches
 * @access  Public
 */
const getMatches = async (req, res) => {
  try {
    const { status, sport } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (sport) filter.sport = sport;
    const matches = await Match.find(filter).sort({ createdAt: -1 }).populate('createdBy', 'username');
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get a single match by ID
 * @route   GET /api/matches/:id
 * @access  Public
 */
const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id).populate('createdBy', 'username');
    if (!match) return res.status(404).json({ message: 'Match not found' });
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Create a new match
 * @route   POST /api/matches
 * @access  Private (Admin)
 */
const createMatch = async (req, res) => {
  const { sport, teamA, teamB } = req.body;
  try {
    if (!sport || !teamA || !teamB) {
      return res.status(400).json({ message: 'Sport, Team A, and Team B are required' });
    }
    const match = await Match.create({
      sport,
      teamA,
      teamB,
      score: defaultScore(sport),
      createdBy: req.user._id,
    });
    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Update match status (start, pause, end)
 * @route   PATCH /api/matches/:id/status
 * @access  Private (Admin)
 */
const updateMatchStatus = async (req, res) => {
  try {
    const { status, winner } = req.body;
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    match.status = status;
    if (winner) match.winner = winner;
    await match.save();

    // Emit socket event (handled in server.js via the response – client should re-fetch or listen)
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Update match score (sport-specific payload passed in body)
 * @route   PATCH /api/matches/:id/score
 * @access  Private (Admin)
 */
const updateMatchScore = async (req, res) => {
  try {
    const { score, event } = req.body;
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    // Save current state to history before updating (limit history to last 20 for space)
    match.scoreHistory.push({
      score: JSON.parse(JSON.stringify(match.score)), // Deep copy
      event: event || 'Score update',
    });
    if (match.scoreHistory.length > 20) match.scoreHistory.shift();

    match.score = score;
    match.markModified('score');
    if (event) {
      match.events.push({ description: event });
    }
    await match.save();
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Undo last score update
 * @route   PATCH /api/matches/:id/undo
 * @access  Private (Admin)
 */
const undoMatchScore = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    if (!match.scoreHistory || match.scoreHistory.length === 0) {
      return res.status(400).json({ message: 'No actions to undo' });
    }

    const lastState = match.scoreHistory.pop();
    match.score = lastState.score;
    match.markModified('score');
    
    // Also remove the last event if it matches the undo
    if (match.events && match.events.length > 0) {
      match.events.pop();
    }
    
    await match.save();
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Delete a match
 * @route   DELETE /api/matches/:id
 * @access  Private (Admin)
 */
const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match not found' });
    res.json({ message: 'Match deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getMatches,
  getMatchById,
  createMatch,
  updateMatchStatus,
  updateMatchScore,
  undoMatchScore,
  deleteMatch,
  defaultScore,
};
