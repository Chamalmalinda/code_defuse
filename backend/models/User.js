
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    agentName:   { type: String, required: true, unique: true },
    email:       { type: String, required: true, unique: true },
    password:    { type: String, required: false }, 
    rank:        { type: String, default: 'Recruit' },
    totalScore:  { type: Number, default: 0 },
    gamesPlayed: { type: Number, default: 0 },
    googleId:    { type: String, default: null }, 
    photoURL:    { type: String, default: '' }, 
}, { timestamps: true });


UserSchema.pre('save', async function(next) {
    if (!this.isModified('password') || !this.password) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});


UserSchema.methods.matchPassword = async function(enteredPassword) {
    if (!this.password) return false; 
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);