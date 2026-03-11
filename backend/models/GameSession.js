
const mongoose = require('mongoose');

const GameSessionSchema = new mongoose.Schema({
    user:          { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    agentName:     { type: String, required: true },
    score:         { type: Number, default: 0 },
    wiresDefused:  { type: Number, default: 0 },
    timeRemaining: { type: Number, default: 0 },
    status:        { type: String, enum: ['won', 'exploded'], required: true },
    difficulty:    { type: String, default: 'normal' }
}, { timestamps: true });

module.exports = mongoose.model('GameSession', GameSessionSchema);