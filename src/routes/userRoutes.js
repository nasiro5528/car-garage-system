const express = require('express');
const router = express.Router();

// ✅ Import controller functions – names must match exports
const {
  register,
  login,
  getProfile
} = require('../controllers/authController');

const auth = require('../middlewares/auth');

// Public routes
router.post('/register', register);
router.post('/login', login); // ← Line 10 – this will now work

// Protected route
router.get('/me', auth, getProfile);

module.exports = router;