const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  getPaymentStatus
} = require('../controllers/paymentController');
const auth = require('../middlewares/auth');

router.post('/create-payment-intent', auth, createPaymentIntent);
router.get('/status', auth, getPaymentStatus);

module.exports = router;