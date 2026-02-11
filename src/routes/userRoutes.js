const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middlewares/auth');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.use(protect);
router.get('/me', userController.getMe);
router.put('/:id', userController.updateUser);

module.exports = router;