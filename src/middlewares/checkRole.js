exports.isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin only.'
        });
    }
    next();
};

exports.isGarageOwner = (req, res, next) => {
    if (req.user.role !== 'garage_owner' && req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Garage owners only.'
        });
    }
    next();
};

exports.isCustomer = (req, res, next) => {
    if (req.user.role !== 'customer') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Customers only.'
        });
    }
    next();
};

exports.isOwnerOrAdmin = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'garage_owner') {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Owner or admin only.'
        });
    }
    next();
};