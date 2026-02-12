const express = require('express');
const router = express.Router();
const {
  addService,
  getServices,
  getActiveServices,
  getServiceById,      // 👈 NEW
  updateService,
  deleteService,
  restoreService,
  hardDeleteService
} = require('../controllers/serviceController');
const auth = require('../middlewares/auth');

// Public route
router.get('/public/:garageId', getActiveServices);

// Protected routes (require authentication)
router.use(auth);

router.post('/', addService);
router.get('/', getServices);
router.get('/:serviceId', getServiceById);    // 👈 NEW
router.put('/:serviceId', updateService);
router.delete('/:serviceId', deleteService);
router.patch('/:serviceId/restore', restoreService);
router.delete('/:serviceId/hard', hardDeleteService);

module.exports = router;