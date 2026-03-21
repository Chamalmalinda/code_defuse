
const Score       = require('../models/Score');
const GameSession = require('../models/GameSession');
const User        = require('../models/User');


const calculateRank = (totalScore) => {
    if (totalScore >= 5000) return 'Elite Agent';
    if (totalScore >= 3000) return 'Gold';
    if (totalScore >= 1500) return 'Silver';
    if (totalScore >= 500)  return 'Bronze';
    return 'Recruit';
};


exports.saveScore = async (req, res) => {
    try {
        const { score, wiresDefused, timeRemaining, status, difficulty } = req.body;

        await Score.create({
            user:          req.user._id,
            agentName:     req.user.agentName,
            score,
            wiresDefused,
            timeRemaining,
            difficulty
        });

        await GameSession.create({
            user:          req.user._id,
            agentName:     req.user.agentName,
            score,
            wiresDefused,
            timeRemaining,
            status,
            difficulty
        });

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $inc: { totalScore: score, gamesPlayed: 1 } },
            { new: true }
        );

        const newRank    = calculateRank(updatedUser.totalScore);
        updatedUser.rank = newRank;
        await updatedUser.save();

        res.status(201).json({
            message:    'Score saved successfully',
            totalScore: updatedUser.totalScore,
            rank:       updatedUser.rank
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.getLeaderboard = async (req, res) => {
    try {
        const scores = await Score.aggregate([

            { $match: { isDaily: { $ne: true } } },
            { $sort: { score: -1 } },
            {
                $group: {
                    _id:           '$agentName',
                    agentName:     { $first: '$agentName' },
                    score:         { $first: '$score' },
                    wiresDefused:  { $first: '$wiresDefused' },
                    timeRemaining: { $first: '$timeRemaining' },
                    difficulty:    { $first: '$difficulty' },
                }
            },
            { $sort: { score: -1 } },
            { $limit: 10 }
        ]);
        res.json(scores);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.checkDailyChallenge = async (req, res) => {
    try {
        const today  = new Date().toISOString().split('T')[0];
        const played = await GameSession.findOne({
            user:      req.user._id,
            isDaily:   true,
            dailyDate: today
        });

        res.json({
            played:  !!played,
            today,
            session: played || null
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.saveDailyScore = async (req, res) => {
    try {
        const { score, wiresDefused, timeRemaining, status, difficulty } = req.body;
        const today = new Date().toISOString().split('T')[0];

  
        const alreadyPlayed = await GameSession.findOne({
            user:      req.user._id,
            isDaily:   true,
            dailyDate: today
        });

        if (alreadyPlayed) {
            return res.status(400).json({ message: 'Already played daily challenge today' });
        }


        await Score.create({
            user:          req.user._id,
            agentName:     req.user.agentName,
            score,
            wiresDefused,
            timeRemaining,
            difficulty,
            isDaily:       true,
            dailyDate:     today
        });


        await GameSession.create({
            user:          req.user._id,
            agentName:     req.user.agentName,
            score,
            wiresDefused,
            timeRemaining,
            status,
            difficulty,
            isDaily:       true,
            dailyDate:     today
        });


        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $inc: { totalScore: score, gamesPlayed: 1 } },
            { new: true }
        );
        const newRank    = calculateRank(updatedUser.totalScore);
        updatedUser.rank = newRank;
        await updatedUser.save();

        res.status(201).json({
            message:    'Daily score saved',
            totalScore: updatedUser.totalScore,
            rank:       updatedUser.rank
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


