



const jwt = require('jsonwebtoken');
const User = require('../models/User'); 

module.exports = async (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        const cleanToken = token.replace('Bearer ', '');
        console.log('Received Token:', cleanToken); // Debugging log

        const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
        console.log('Decoded Token:', decoded); // Debugging log

        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            console.log('User Not Found in DB'); // Debugging log
            return res.status(401).json({ message: 'Invalid token. User not found.' });
        }

        next();
    } catch (error) {
        console.error('JWT Error:', error.message); // Debugging log
        return res.status(400).json({ message: 'Invalid token.' });
    }
};

