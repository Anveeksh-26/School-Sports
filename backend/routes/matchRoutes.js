const express = require('express');
const router = express.Router();
const {
  getMatches,
  getMatchById,
  createMatch,
  updateMatchStatus,
  updateMatchScore,
  undoMatchScore,
  deleteMatch,
} = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getMatches);
router.get('/:id', getMatchById);
router.post('/', protect, createMatch);
router.patch('/:id/status', protect, updateMatchStatus);
router.patch('/:id/score', protect, updateMatchScore);
router.patch('/:id/undo', protect, undoMatchScore);
router.delete('/:id', protect, deleteMatch);

module.exports = router;
