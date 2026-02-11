const express = require('express');
const router = express.Router();
const garageController = require('../controllers/garageController');
const { protect, authorize } = require('../middlewares/auth');

// Public routes
router.get('/', garageController.getAllGarages);
router.get('/:id', garageController.getGarageById);

// Protected routes
router.use(protect);

// Garage owner routes
router.post('/register', authorize('garage_owner'), garageController.registerGarage);
router.get('/owner/my-garages', authorize('garage_owner'), garageController.getMyGarages);
router.put('/:id', authorize('garage_owner', 'admin'), garageController.updateGarage);

module.exports = router;