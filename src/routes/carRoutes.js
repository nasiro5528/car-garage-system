const express = require('express');
const router = express.Router();

// ✅ Import auth middleware – make sure this path is correct
const auth = require('../middlewares/auth');

// ✅ Import car controller functions
const {
  addCar,
  getMyCars,
  getCarById,
  updateCar,
  deleteCar
} = require('../controllers/carController');

// ✅ All car routes require authentication
router.use(auth); // This will now work because `auth` is a function

// Routes
router.post('/', addCar);
router.get('/my-cars', getMyCars);
router.get('/:id', getCarById);
router.put('/:id', updateCar);
router.delete('/:id', deleteCar);

module.exports = router;v