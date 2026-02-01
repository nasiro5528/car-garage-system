const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes - check if user is logged in
const protect = async (req, res, next) => {
    try {
        // 1. Get token from header
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'No token provided' 
            });
        }
        
        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Get user from database
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'User not found' 
            });
        }
        
        // Check if user is deleted
        if (user.isDeleted) {
            return res.status(401).json({ 
                success: false,
                message: 'Account is deactivated. Contact admin.' 
            });
        }
        
        // Attach user to request
        req.user = user;
        next();
        
    } catch (error) {
        console.error('Auth error:', error.message);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token' 
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                message: 'Token expired' 
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
};

// Admin only middleware
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ 
            success: false,
            message: 'Access denied. Admin only.' 
        });
    }
};

module.exports = { protect, admin };