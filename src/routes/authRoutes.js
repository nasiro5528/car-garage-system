const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

console.log("Auth routes loaded");

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;