const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect, authorize } = require('../middlewares/auth');

// All routes require authentication
router.use(protect);

// Car owner routes
router.post('/', authorize('car_owner'), bookingController.createBooking);
router.get('/my-bookings', authorize('car_owner'), bookingController.getMyBookings);

// Garage owner routes
router.get('/garage-bookings', authorize('garage_owner'), bookingController.getGarageBookings);
router.put('/:id/status', authorize('garage_owner'), bookingController.updateBookingStatus);

module.exports = router;