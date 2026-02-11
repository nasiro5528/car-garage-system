// db.js or wherever you connect
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      // Modern options (most are default now, but explicit is safer)
      dbName: 'car-garaging',           // ← optional but good to specify
      retryWrites: true,
      w: 'majority',                    // ← correct value
      // remove any weird * or extra characters
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // exit if cannot connect
  }
};

module.exports = connectDB;