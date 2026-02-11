const mongoose = require('mongoose');

const garageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Garage name is required'],
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true
    },
    capacity: {
        type: Number,
        required: true,
        default: 20
    },
    availableSlots: {
        type: Number,
        required: true,
        default: 20
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    services: [{
        type: String,
        enum: ['oil_change', 'brake_repair', 'tire_rotation', 'car_wash', 'engine_diagnosis', 'battery_replacement']
    }],
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Garage', garageSchema);