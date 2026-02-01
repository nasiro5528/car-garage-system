const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect, admin } = require('../middlewares/authMiddleware');

// ========== ADMIN ROUTES ==========

// Create admin (one-time, no protection needed)
router.post('/create-admin', authController.createAdmin);

// Get single user by ID (admin only)
router.get('/users/:id', protect, admin, authController.getUserById);

// Hard delete user (permanent - admin only)
router.delete('/users/:id/hard-delete', protect, admin, authController.hardDeleteUser);

// Restore soft-deleted user (admin only)
router.put('/users/:id/restore', protect, admin, authController.restoreUser);

module.exports = router;