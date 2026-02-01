const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    garage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Garage",
        required: true
    },
    carDetails: {
        make: { type: String, required: true },
        model: { type: String, required: true },
        year: { type: Number, required: true },
        licensePlate: { type: String, required: true }
    },
    serviceType: {
        type: String,
        required: true,
        enum: ["regular service", "repair", "inspection", "emergency", "other"]
    },
    bookingDate: {
        type: Date,
        required: true
    },
    estimatedCost: {
        type: Number,
        default: 0
    },
    actualCost: {
        type: Number
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "in progress", "completed", "cancelled"],
        default: "pending"
    },
    notes: {
        type: String,
        maxlength: [500, "Notes cannot be more than 500 characters"]
    },
    completedAt: {
        type: Date
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Booking", bookingSchema);