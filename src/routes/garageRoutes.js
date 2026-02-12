const express = require('express');
const router = express.Router();
const {
  getMyGarage,
  updateMyGarage,
  getAllGarages,
  getGarageById
} = require('../controllers/garageController');
const auth = require('../middlewares/auth');

// Public routes
router.get('/', getAllGarages);
router.get('/:id', getGarageById);

// Protected routes (garage owner only)
router.get('/me', auth, getMyGarage);
router.put('/me', auth, updateMyGarage);

module.exports = router;