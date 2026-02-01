// models/Car.js
const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    make: {
        type: String,
        required: [true, 'Please add car make']
    },
    model: {
        type: String,
        required: [true, 'Please add car model']
    },
    year: {
        type: Number,
        required: [true, 'Please add car year'],
        min: 1900,
        max: new Date().getFullYear() + 1
    },
    licensePlate: {
        type: String,
        required: [true, 'Please add license plate'],
        uppercase: true,
        unique: true
    },
    vin: {
        type: String,
        required: [true, 'Please add VIN number'],
        uppercase: true,
        unique: true
    },
    color: String,
    fuelType: {
        type: String,
        enum: ['gasoline', 'diesel', 'electric', 'hybrid', 'cng', 'lpg']
    },
    transmission: {
        type: String,
        enum: ['automatic', 'manual', 'cvt', 'semi-automatic']
    },
    engineSize: String,
    mileage: {
        type: Number,
        default: 0,
        min: 0
    },
    lastServiceDate: Date,
    nextServiceDate: Date,
    serviceInterval: { type: Number, default: 5000 }, // km or miles
    insurance: {
        company: String,
        policyNumber: String,
        expiryDate: Date
    },
    images: [String],
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Car', carSchema);