const User = require('../models/User');
const Garage = require('../models/Garage');
const Booking = require('../models/Booking');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
exports.getDashboardStats = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin only.'
            });
        }
        
        // Get counts
        const totalUsers = await User.countDocuments({ isDeleted: false });
        const totalCarOwners = await User.countDocuments({ 
            role: 'car_owner',
            isDeleted: false 
        });
        const totalGarageOwners = await User.countDocuments({ 
            role: 'garage_owner',
            isDeleted: false 
        });
        const totalGarages = await Garage.countDocuments({ isDeleted: false });
        const totalBookings = await Booking.countDocuments({});
        
        // Get pending garage approvals
        const pendingGarages = await Garage.find({ 
            status: 'pending',
            isDeleted: false 
        }).populate('owner', 'name email');
        
        // Get recent bookings
        const recentBookings = await Booking.find({})
            .populate('user', 'name')
            .populate('garage', 'name')
            .sort({ createdAt: -1 })
            .limit(10);
        
        res.status(200).json({
            success: true,
            stats: {
                totalUsers,
                totalCarOwners,
                totalGarageOwners,
                totalGarages,
                totalBookings,
                pendingGaragesCount: pendingGarages.length
            },
            pendingGarages,
            recentBookings
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin only.'
            });
        }
        
        const users = await User.find({ isDeleted: false })
            .select('-password')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: users.length,
            users
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Approve/reject garage
// @route   PUT /api/admin/garages/:id/approve
// @access  Private (Admin)
exports.approveGarage = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin only.'
            });
        }
        
        const { status } = req.body;
        
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Status must be "approved" or "rejected"'
            });
        }
        
        const garage = await Garage.findById(req.params.id);
        if (!garage) {
            return res.status(404).json({
                success: false,
                message: 'Garage not found'
            });
        }
        
        garage.status = status;
        await garage.save();
        
        res.status(200).json({
            success: true,
            message: `Garage ${status} successfully`,
            garage
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all garages (admin view)
// @route   GET /api/admin/garages
// @access  Private (Admin)
exports.getAllGaragesAdmin = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin only.'
            });
        }
        
        const garages = await Garage.find({ isDeleted: false })
            .populate('owner', 'name email phone')
            .sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: garages.length,
            garages
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};