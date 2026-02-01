// app.js
const express = require("express");
const cors = require("cors");
// REMOVE: const morgan = require("morgan");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// REMOVE: app.use(morgan("dev"));

// Root route
app.get("/", (req, res) => {
    res.json({ 
        message: "Car Garaging System API"
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

module.exports = app;