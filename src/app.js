const express = require("express");
const cors = require("cors");
const serviceRoutes = require('./routes/serviceRoutes');
const app = express();

// ===== 1. STRIPE WEBHOOK – MUST BE RAW BODY =====
const paymentController = require('./controllers/paymentController');
app.post('/api/payment/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.handleWebhook
);

// ===== 2. REGULAR MIDDLEWARE =====
// ===== REGULAR MIDDLEWARE =====
app.use(cors());
app.use(express.json({ limit: '10mb' }));        // ✅ MUST be BEFORE routes
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// ===== 3. IMPORT ROUTES (ONLY GARAGE OWNER RELATED) =====
const userRoutes = require('./routes/userRoutes');
const garageRoutes = require('./routes/garageRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const publicUploadRoutes = require('./routes/uploadPublic');

// ===== 4. MOUNT ROUTES =====
app.use('/api/users', userRoutes);   
app.use('/api/upload', publicUploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/garages', garageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
// ===== MOUNT ROUTES =====
app.use('/api/upload', publicUploadRoutes);
app.use('/api/users', userRoutes);
app.use('/api/garages', garageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/garages/services', serviceRoutes); // 👈 MUST BE EXACTLY THIS
// ===== 5. ROOT ROUTE =====
app.get('/', (req, res) => {
  res.json({
    message: 'Garage Manager API - Garage Owner Only Mode',
    status: 'Running',
    endpoints: {
      upload: 'POST /api/upload/license',
      auth: 'POST /api/users/register, POST /api/users/login, GET /api/users/me',
      garages: 'GET /api/garages (public), GET /api/garages/me (private), PUT /api/garages/me (private), GET /api/garages/:id (public)',
      payment: 'POST /api/payment/create-payment-intent, GET /api/payment/status',
      admin: 'GET /api/admin/garages/pending, PATCH /api/admin/garages/:id/approve, GET /api/admin/garages, GET /api/admin/dashboard'
    }
  });
});

// ===== 6. 404 HANDLER =====
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ===== 7. ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error'
  });
});

module.exports = app;