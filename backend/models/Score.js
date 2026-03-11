
const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
    user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    agentName:     { type: String, required: true },
    score:         { type: Number, required: true },
    wiresDefused:  { type: Number, default: 0 },
    timeRemaining: { type: Number, default: 0 },
    difficulty:    { type: String, default: 'normal' }
}, { timestamps: true });

module.exports = mongoose.model('Score', ScoreSchema);