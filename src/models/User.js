const mongoose = require('mongoose');

// ===== SERVICE SUBDOCUMENT SCHEMA =====
const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    duration: { type: Number, required: true, min: 1 }, // in minutes
    description: { type: String, trim: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: false, trim: true },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, required: true },
    role: {
      type: String,
      enum: ['car_owner', 'garage_owner', 'admin'],
      default: 'car_owner',
      required: true,
    },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }, // optional – for user soft delete
    garageProfile: {
      licenseNumber: { type: String, trim: true },
      licenseDocument: { type: String },
      garageName: { type: String, trim: true },
      address: { type: String },
      
      // ✅ EXISTING – string array (fully backward compatible)
      services: [{ type: String }],
      
      // ✅ NEW – detailed service subdocuments (add this line)
      serviceDetails: [serviceSchema],
      
      hourlyRate: { type: Number, default: 0 },
      capacity: { type: Number, default: 1 },
      description: { type: String },
      paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending',
      },
      approvalStatus: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
      },
      subscriptionExpiry: { type: Date },
      stripeCustomerId: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);