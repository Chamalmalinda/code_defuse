
const User = require('../models/User');
const jwt  = require('jsonwebtoken');


const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};


const cookieOptions = {
    httpOnly: true,     
    secure:   false,    
    sameSite: 'lax',    
    maxAge:   7 * 24 * 60 * 60 * 1000 
};


exports.register = async (req, res) => {
    try {
        const { agentName, email, password } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Agent already exists' });
        }

        const user  = await User.create({ agentName, email, password });
        const token = generateToken(user._id);

        
        res.cookie('token', token, cookieOptions);

        res.status(201).json({
            message: 'Agent registered successfully',
            user: {
                id:         user._id,
                agentName:  user.agentName,
                email:      user.email,
                rank:       user.rank,
                totalScore: user.totalScore
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        
        res.cookie('token', token, cookieOptions);

        res.json({
            token, 
            user: {
                id:         user._id,
                agentName:  user.agentName,
                email:      user.email,
                rank:       user.rank,
                totalScore: user.totalScore
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.logout = (req, res) => {
  
    res.cookie('token', '', { ...cookieOptions, maxAge: 0 });
    res.json({ message: 'Logged out successfully' });
};

// POST /api/auth/google
// Google OAuth login - verifies Firebase token and creates/finds user in MongoDB
exports.googleLogin = async (req, res) => {
    try {
        const { uid, email, displayName, photoURL } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });

        if (!user) {
            // New user — create account with Google data
            user = await User.create({
                agentName: displayName || email.split('@')[0],
                email,
                password:  uid, // Google uid as password — not used for login
                googleId:  uid,
                photoURL:  photoURL || '',
            });
        }

        // Generate JWT token
        const token = generateToken(user._id);

        // Set HttpOnly cookie
        res.cookie('token', token, cookieOptions);

        res.json({
            token,
            user: {
                id:         user._id,
                agentName:  user.agentName,
                email:      user.email,
                rank:       user.rank,
                totalScore: user.totalScore
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};