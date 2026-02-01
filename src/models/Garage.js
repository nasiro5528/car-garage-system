// models/Garage.js
const mongoose = require('mongoose');

const garageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add garage name'],
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    licenseNumber: {
        type: String,
        required: [true, 'Please add business license number'],
        unique: true
    },
    taxId: {
        type: String,
        required: [true, 'Please add tax ID']
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    contact: {
        phone: String,
        email: String,
        website: String
    },
    description: String,
    images: [String],
    facilities: [{
        type: String,
        enum: ['waiting_area', 'cafe', 'wifi', 'shuttle_service', 'pickup_delivery']
    }],
    workingHours: {
        monday: { open: String, close: String },
        tuesday: { open: String, close: String },
        wednesday: { open: String, close: String },
        thursday: { open: String, close: String },
        friday: { open: String, close: String },
        saturday: { open: String, close: String },
        sunday: { open: String, close: String }
    },
    servicesOffered: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }],
    mechanics: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mechanic'
    }],
    rating: {
        average: { type: Number, default: 0, min: 0, max: 5 },
        count: { type: Number, default: 0 }
    },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Garage', garageSchema);