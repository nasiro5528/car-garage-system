const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    licensePlate: {
        type: String,
        required: [true, 'Please add license plate'],
        unique: true,
        trim: true,
        uppercase: true
    },
    vin: {
        type: String,
        trim: true,
        uppercase: true
        // Remove required: true to make it optional
    },
    make: {
        type: String,
        required: [true, 'Please add car make'],
        trim: true
    },
    model: {
        type: String,
        required: [true, 'Please add car model'],
        trim: true
    },
    year: {
        type: Number,
        min: 1900,
        max: new Date().getFullYear() + 1
    },
    color: {
        type: String,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
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

// Indexes
carSchema.index({ licensePlate: 1 });
carSchema.index({ vin: 1 });
carSchema.index({ owner: 1 });

module.exports = mongoose.model('Car', carSchema);