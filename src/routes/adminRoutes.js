const express = require('express');
const router = express.Router();
const {
  getPendingGarages,
  approveGarage,
  getAllGarages,
  getDashboardStats
} = require('../controllers/adminController');
const auth = require('../middlewares/auth');
const adminOnly = require('../middlewares/adminOnly');

router.use(auth);
router.use(adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/garages/pending', getPendingGarages);
router.patch('/garages/:id/approve', approveGarage);
router.get('/garages', getAllGarages);

module.exports = router;