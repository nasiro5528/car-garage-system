const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
const { protect, authorize } = require('../middlewares/auth');

// All routes require authentication
router.use(protect);

// Car owner routes
router.post('/', authorize('car_owner'), carController.addCar);
router.get('/my-cars', authorize('car_owner'), carController.getMyCars);
router.put('/:id', authorize('car_owner'), carController.updateCar);
router.delete('/:id', authorize('car_owner'), carController.deleteCar);

module.exports = router;