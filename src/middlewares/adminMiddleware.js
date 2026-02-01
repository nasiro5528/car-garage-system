// File: src/middleware/adminMiddleware.js
const admin = (req, res, next) => {
    // Check if user exists and is admin
    if (req.user && req.user.role === 'admin') {
        next(); // Continue to the next function
    } else {
        res.status(403).json({ 
            success: false,
            message: 'Access denied. Admin only.' 
        });
    }
};

module.exports = { admin };