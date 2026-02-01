// models/Mechanic.js
const mongoose = require('mongoose');

const mechanicSchema = new mongoose.Schema({
    garage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Garage',
        required: true
    },
    name: {
        type: String,
        required: [true, 'Please add mechanic name']
    },
    specialization: [{
        type: String,
        enum: ['engine', 'transmission', 'brakes', 'electrical', 'ac', 'tires', 'diagnostic']
    }],
    experience: { type: Number, default: 0 }, // years
    certifications: [String],
    contact: {
        phone: String,
        email: String
    },
    rating: {
        average: { type: Number, default: 0, min: 0, max: 5 },
        count: { type: Number, default: 0 }
    },
    isAvailable: { type: Boolean, default: true },
    workingHours: {
        start: String,
        end: String
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Mechanic', mechanicSchema);