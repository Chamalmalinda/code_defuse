
const express = require('express');
const router = express.Router();
const { saveScore, getLeaderboard, checkDailyChallenge,saveDailyScore } = require('../controllers/gameController');
const { protect } = require('../middleware/auth');

router.post('/score', protect, saveScore);
router.get('/leaderboard', getLeaderboard);
router.get('/daily/check',       protect, checkDailyChallenge);
router.post('/daily/score',      protect, saveDailyScore);

module.exports = router;