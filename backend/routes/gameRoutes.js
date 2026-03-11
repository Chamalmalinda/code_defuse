
const express = require('express');
const router = express.Router();
const { saveScore, getLeaderboard } = require('../controllers/gameController');
const { protect } = require('../middleware/auth');

router.post('/score', protect, saveScore);
router.get('/leaderboard', getLeaderboard);

module.exports = router;