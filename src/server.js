const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });  // loads .env from parent folder

const express = require('express');
const mongoose = require('mongoose');
const app = require('./app');

// MongoDB Connection – now using MONGO_URI
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  // ... rest of your console output
});