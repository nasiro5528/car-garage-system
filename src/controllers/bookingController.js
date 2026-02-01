const Booking = require("../models/Booking");
const Garage = require("../models/Garage");

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
    try {
        const { garageId, carDetails, serviceType, bookingDate, notes } = req.body;
        
        // Check if garage exists
        const garage = await Garage.findById(garageId);
        if (!garage) {
            return res.status(404).json({ message: "Garage not found" });
        }
        
        const booking = await Booking.create({
            user: req.user._id,
            garage: garageId,
            carDetails,
            serviceType,
            bookingDate,
            notes,
            status: "pending"
        });
        
        res.status(201).json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate("garage", "name address phone")
            .sort({ createdAt: -1 });
        
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get garage's bookings
// @route   GET /api/bookings/garage/:garageId
// @access  Private (Garage Owner)
const getGarageBookings = async (req, res) => {
    try {
        const garage = await Garage.findById(req.params.garageId);
        
        if (!garage) {
            return res.status(404).json({ message: "Garage not found" });
        }
        
        // Check if user owns the garage or is admin
        if (garage.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized" });
        }
        
        const bookings = await Booking.find({ garage: req.params.garageId })
            .populate("user", "name email phone")
            .sort({ bookingDate: 1 });
        
        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Garage Owner, Admin)
const updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);
        
        if (!booking) {
            return res.status(404).json({ message: "Booking not found" });
        }
        
        const garage = await Garage.findById(booking.garage);
        
        // Check if user owns the garage or is admin
        if (garage.owner.toString() !== req.user._id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "Not authorized" });
        }
        
        booking.status = status;
        await booking.save();
        
        res.json(booking);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// Add other booking controller functions as needed

module.exports = {
    createBooking,
    getMyBookings,
    getGarageBookings,
    updateBookingStatus,
    // Add other exports
};