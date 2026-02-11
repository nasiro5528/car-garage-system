const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import all routes
const userRoutes = require('./routes/userRoutes');
const garageRoutes = require('./routes/garageRoutes');
const carRoutes = require('./routes/carRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/garages', garageRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Root route
app.get("/", (req, res) => {
    res.json({ 
        message: "Web-Based Smart Car Garaging System API",
        status: "Running",
        version: "1.0.0",
        description: "Final Year Project - Jimma University",
        authors: ["Nasir Mohammed", "Tadele Fantu", "Hana Alemayehu", "Mitiku Zewudie", "Azarias Admasu"],
        endpoints: {
            authentication: {
                register: "POST /api/users/register",
                login: "POST /api/users/login",
                profile: "GET /api/users/me"
            },
            garages: {
                getAll: "GET /api/garages",
                getOne: "GET /api/garages/:id",
                register: "POST /api/garages/register (garage owners only)"
            },
            cars: {
                add: "POST /api/cars (car owners only)",
                myCars: "GET /api/cars/my-cars"
            },
            bookings: {
                create: "POST /api/bookings (car owners only)",
                myBookings: "GET /api/bookings/my-bookings"
            },
            admin: {
                dashboard: "GET /api/admin/dashboard",
                users: "GET /api/admin/users",
                garages: "GET /api/admin/garages"
            }
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        success: false,
        message: "Route not found",
        help: "Check the available endpoints at GET /"
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error'
    });
});

module.exports = app;