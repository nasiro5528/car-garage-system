require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Simple CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
        return res.status(200).json({});
    }
    next();
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Welcome route
app.get('/', (req, res) => {
    res.json({ 
        success: true,
        message: '🚗 Car Garage System API',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        success: true,
        status: 'OK',
        uptime: process.uptime()
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`
    ============================================
    ✅ SERVER RUNNING SUCCESSFULLY
    ============================================
    Port: ${PORT}
    URL: http://localhost:${PORT}
    ============================================
    🔐 Auth Endpoints:
        POST /api/auth/register
        POST /api/auth/login
        GET  /api/auth/profile
        PUT  /api/auth/profile
        PUT  /api/auth/soft-delete
        POST /api/auth/logout
    ============================================
    👑 Admin Endpoints:
        POST   /api/admin/create-admin
        GET    /api/admin/users/:id
        DELETE /api/admin/users/:id/hard-delete
        PUT    /api/admin/users/:id/restore
    ============================================
    `);
});