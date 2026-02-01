const express = require("express");
const router = express.Router();
const { 
    createBooking, 
    getBookings, 
    getBookingById, 
    updateBooking, 
    deleteBooking,
    getMyBookings,
    getGarageBookings,
    updateBookingStatus
} = require("../controllers/bookingController");
const protect = require("../middlewares/protect");

// Protected routes
router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/garage/:garageId", protect, getGarageBookings);
router.get("/:id", protect, getBookingById);
router.put("/:id", protect, updateBooking);
router.put("/:id/status", protect, updateBookingStatus);
router.delete("/:id", protect, deleteBooking);

// Admin routes (if needed)
router.get("/", protect, getBookings); // Admin only

module.exports = router;