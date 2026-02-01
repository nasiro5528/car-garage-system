// models/Service.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add service name'],
        trim: true
    },
    description: String,
    category: {
        type: String,
        enum: ['maintenance', 'repair', 'diagnostic', 'body_work', 'detailing', 'tires', 'electrical']
    },
    duration: {  // in minutes
        type: Number,
        required: true,
        min: 15
    },
    basePrice: {
        type: Number,
        required: true,
        min: 0
    },
    garage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Garage',
        required: true
    },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Service', serviceSchema);