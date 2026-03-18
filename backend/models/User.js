
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    agentName:   { type: String, required: true, unique: true },
    email:       { type: String, required: true, unique: true },
    password:    { type: String, required: false }, // Google users සඳහා optional
    rank:        { type: String, default: 'Recruit' },
    totalScore:  { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
    googleId:    { type: String, default: null },   // Google OAuth UID
    photoURL:    { type: String, default: '' },     // Google profile photo
}, { timestamps: true });

// Password hash කරන්න save කරන්න කලින්
// Google users skip කරනවා — password නෑ
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password') || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// Password compare method — regular login සඳහා
UserSchema.methods.matchPassword = async function(enteredPassword) {
    if (!this.password) return false; // Google user — password නෑ
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);