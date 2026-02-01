const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    // Basic Information (All Roles)
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'carOwner', 'garageOwner'],
        default: 'carOwner'
    },
    
    // Contact Information (All Roles)
    phone: {
        type: String,
        required: [true, 'Please add a phone number'],
        trim: true,
        match: [
            /^[0-9\-\+\s\(\)]{10,15}$/,
            'Please add a valid phone number'
        ]
    },
    
    // Address Information (All Roles)
    address: {
        street: {
            type: String,
            required: [true, 'Please add street address']
        },
        city: {
            type: String,
            required: [true, 'Please add city']
        },
        state: {
            type: String,
            required: [true, 'Please add state']
        },
        zipCode: {
            type: String,
            required: [true, 'Please add zip code']
        },
        country: {
            type: String,
            default: 'USA'
        }
    },
    
    // GARAGE OWNER SPECIFIC FIELDS
    garageInfo: {
        garageName: {
            type: String,
            required: function() { return this.role === 'garageOwner'; }
        },
        businessLicense: {
            type: String,
            required: function() { return this.role === 'garageOwner'; }
        },
        taxId: {
            type: String,
            required: function() { return this.role === 'garageOwner'; }
        },
        garageType: {
            type: String,
            enum: ['independent', 'chain', 'franchise', 'specialty'],
            default: 'independent'
        },
        yearEstablished: {
            type: Number,
            min: 1900,
            max: new Date().getFullYear()
        },
        garageSize: {
            type: String,
            enum: ['small', 'medium', 'large']
        },
        numberOfEmployees: {
            type: Number,
            min: 1
        },
        servicesOffered: [{
            type: String,
            enum: [
                'oil_change', 'brake_repair', 'engine_repair', 'transmission_repair',
                'tire_service', 'battery_service', 'ac_repair', 'electrical_repair',
                'body_work', 'detailing', 'inspection', 'towing'
            ]
        }],
        certifications: [{
            type: String,
            enum: ['ASE', 'NAPA', 'AAA', 'factory_trained']
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
        paymentMethods: [{
            type: String,
            enum: ['cash', 'credit_card', 'debit_card', 'mobile_payment', 'insurance']
        }],
        insuranceAccepted: [{
            type: String
        }],
        description: {
            type: String,
            maxlength: 500
        }
    },
    
    // CAR OWNER SPECIFIC FIELDS
    carInfo: {
        cars: [{
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
                trim: true
            },
            vin: {
                type: String,
                uppercase: true,
                trim: true,
                match: [/^[A-HJ-NPR-Z0-9]{17}$/, 'Please add a valid VIN']
            },
            color: {
                type: String
            },
            fuelType: {
                type: String,
                enum: ['gasoline', 'diesel', 'electric', 'hybrid', 'cng', 'lpg']
            },
            transmission: {
                type: String,
                enum: ['automatic', 'manual', 'cvt', 'semi-automatic']
            },
            mileage: {
                type: Number,
                min: 0
            },
            lastServiceDate: {
                type: Date
            },
            nextServiceDate: {
                type: Date
            },
            insurance: {
                company: String,
                policyNumber: String,
                expiryDate: Date
            }
        }],
        preferredServiceTypes: [{
            type: String,
            enum: ['regular_maintenance', 'emergency', 'scheduled', 'diagnostic']
        }]
    },
    
    // Account Status
    isVerified: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt timestamp on save
userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('User', userSchema);