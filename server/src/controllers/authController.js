const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// User register

exports.register = async (req, res) => {
    try {
        // console.log("Registering user with data:", req.body);
        const { username, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            username,
            email,
            password: hashedPassword,
            role: role || 'user'
        });

        await user.save();

        res.json({ msg: 'User registered successfully. Please log in.' });
    } catch (err) {
        // console.error("Error during user registration:", err);
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

// User login

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
    try {
        console.log("Fetching user profile for user ID:", req.user.id);
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: 'Server Error', error: err.message });
    }
};
