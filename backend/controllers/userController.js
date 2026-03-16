
const User        = require('../models/User');
const GameSession = require('../models/GameSession');
const Score       = require('../models/Score');


exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

  
        const recentGames = await GameSession.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(5);


        const highestScore = await Score.findOne({ user: req.user._id })
            .sort({ score: -1 })
            .select('score difficulty wiresDefused timeRemaining');

        res.json({
            user,
            recentGames,
            highestScore
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};