const Booking = require('../models/Booking');
const Garage = require('../models/Garage');
const Car = require('../models/Car');

// @desc    Make a booking/reservation
// @route   POST /api/bookings
// @access  Private (Car Owner)
exports.createBooking = async (req, res) => {
    try {
        // Check if user is car owner
        if (req.user.role !== 'car_owner') {
            return res.status(403).json({
                success: false,
                message: 'Only car owners can make bookings'
            });
        }
        
        const { garageId, carId, serviceType, bookingDate, notes } = req.body;
        
        // Validate required fields
        if (!garageId || !carId || !serviceType || !bookingDate) {
            return res.status(400).json({
                success: false,
                message: 'Please provide garageId, carId, serviceType, and bookingDate'
            });
        }
        
        // Check if garage exists and is approved
        const garage = await Garage.findById(garageId);
        if (!garage || garage.status !== 'approved') {
            return res.status(404).json({
                success: false,
                message: 'Garage not found or not approved'
            });
        }
        
        // Check if car exists and belongs to user
        const car = await Car.findById(carId);
        if (!car || car.owner.toString() !== req.user._id.toString()) {
            return res.status(404).json({
                success: false,
                message: 'Car not found or not owned by you'
            });
        }
        
        // Check garage availability
        if (garage.availableSlots <= 0) {
            return res.status(400).json({
                success: false,
                message: 'No available slots at this garage'
            });
        }
        
        // Create booking
        const booking = await Booking.create({
            user: req.user._id,
            garage: garageId,
            car: carId,
            serviceType,
            bookingDate: new Date(bookingDate),
            notes,
            status: 'pending' // Waiting for garage owner approval
        });
        
        // Reduce available slots
        garage.availableSlots -= 1;
        await garage.save();
        
        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            booking
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private (Car Owner)
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('garage', 'name address city phone')
            .populate('car', 'licensePlate make model')
            .sort({ bookingDate: -1 });
        
        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get garage's bookings (Garage Owner)
// @route   GET /api/bookings/garage-bookings
// @access  Private (Garage Owner)
exports.getGarageBookings = async (req, res) => {
    try {
        // Get garages owned by this user
        const garages = await Garage.find({ owner: req.user._id });
        const garageIds = garages.map(g => g._id);
        
        const bookings = await Booking.find({ garage: { $in: garageIds } })
            .populate('user', 'name email phone')
            .populate('car', 'licensePlate make model')
            .populate('garage', 'name')
            .sort({ bookingDate: -1 });
        
        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update booking status (Garage Owner)
// @route   PUT /api/bookings/:id/status
// @access  Private (Garage Owner)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const bookingId = req.params.id;
        
        if (!['pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }
        
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }
        
        // Check if user owns the garage
        const garage = await Garage.findById(booking.garage);
        if (!garage || garage.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this booking'
            });
        }
        
        // Update status
        booking.status = status;
        if (status === 'completed') {
            booking.completedAt = Date.now();
        }
        await booking.save();
        
        res.status(200).json({
            success: true,
            message: `Booking status updated to ${status}`,
            booking
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};