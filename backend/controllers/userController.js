
const User = require('../models/User');
const GameSession = require('../models/GameSession');


exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        

        const recentGames = await GameSession.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            user,
            recentGames
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};