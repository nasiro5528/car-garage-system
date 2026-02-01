const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// ========== PUBLIC ROUTES ==========
router.post('/register', authController.register);
router.post('/login', authController.login);

// ========== PROTECTED ROUTES (All logged-in users) ==========
router.get('/profile', protect, authController.getProfile);
router.put('/profile', protect, authController.updateProfile);
router.put('/soft-delete', protect, authController.softDeleteOwnAccount);
router.post('/logout', protect, authController.logout);

module.exports = router;