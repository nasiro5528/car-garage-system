const User = require('../models/User');

// ==========================================
// SERVICE MANAGEMENT – GARAGE OWNER ONLY
// ==========================================

// @desc    Add a new service
// @route   POST /api/garages/services
// @access  Private (Garage Owner)
exports.addService = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'garage_owner') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (user.garageProfile?.paymentStatus !== 'paid') {
      return res.status(402).json({ success: false, message: 'Payment required' });
    }
    if (user.garageProfile?.approvalStatus !== 'approved') {
      return res.status(403).json({ success: false, message: 'Garage not approved yet' });
    }

    const { name, price, duration, description } = req.body;

    if (!name) return res.status(400).json({ success: false, message: 'Service name is required' });
    if (!price) return res.status(400).json({ success: false, message: 'Price is required' });
    if (!duration) return res.status(400).json({ success: false, message: 'Duration is required' });

    const newService = {
      name,
      price,
      duration,
      description: description || '',
      isDeleted: false
    };

    // ✅ USE serviceDetails
    if (!user.garageProfile.serviceDetails) {
      user.garageProfile.serviceDetails = [];
    }
    user.garageProfile.serviceDetails.push(newService);
    await user.save();

    const addedService = user.garageProfile.serviceDetails[user.garageProfile.serviceDetails.length - 1];

    res.status(201).json({
      success: true,
      message: 'Service added successfully',
      service: addedService
    });
  } catch (error) {
    console.error('Add service error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all services (active + deleted)
// @route   GET /api/garages/services
// @access  Private (Garage Owner)
exports.getServices = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'garage_owner') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // ✅ USE serviceDetails
    const services = user.garageProfile?.serviceDetails || [];

    res.status(200).json({
      success: true,
      count: services.length,
      services
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single service by ID
// @route   GET /api/garages/services/:serviceId
// @access  Private (Garage Owner)
exports.getServiceById = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'garage_owner') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const serviceId = req.params.serviceId;
    
    // ✅ USE serviceDetails.id()
    const service = user.garageProfile.serviceDetails.id(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    res.status(200).json({
      success: true,
      service
    });
  } catch (error) {
    console.error('Get service by ID error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get only active services (public)
// @route   GET /api/garages/services/public/:garageId
// @access  Public
exports.getActiveServices = async (req, res) => {
  try {
    const user = await User.findById(req.params.garageId);
    if (!user || user.role !== 'garage_owner' || user.garageProfile?.approvalStatus !== 'approved') {
      return res.status(404).json({ success: false, message: 'Garage not found or not approved' });
    }

    // ✅ USE serviceDetails
    const activeServices = (user.garageProfile?.serviceDetails || []).filter(s => !s.isDeleted);

    res.status(200).json({
      success: true,
      count: activeServices.length,
      services: activeServices
    });
  } catch (error) {
    console.error('Get active services error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update a service
// @route   PUT /api/garages/services/:serviceId
// @access  Private (Garage Owner)
exports.updateService = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'garage_owner') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const serviceId = req.params.serviceId;
    const updates = req.body;

    // ✅ USE serviceDetails.id()
    const service = user.garageProfile.serviceDetails.id(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    const allowedUpdates = ['name', 'price', 'duration', 'description'];
    allowedUpdates.forEach(field => {
      if (updates[field] !== undefined) {
        service[field] = updates[field];
      }
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      service
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Soft delete a service
// @route   DELETE /api/garages/services/:serviceId
// @access  Private (Garage Owner)
exports.deleteService = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'garage_owner') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const serviceId = req.params.serviceId;
    // ✅ USE serviceDetails.id()
    const service = user.garageProfile.serviceDetails.id(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    service.isDeleted = true;
    service.deletedAt = new Date();

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Service deleted successfully',
      service
    });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Restore a soft-deleted service
// @route   PATCH /api/garages/services/:serviceId/restore
// @access  Private (Garage Owner)
exports.restoreService = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'garage_owner') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const serviceId = req.params.serviceId;
    // ✅ USE serviceDetails.id()
    const service = user.garageProfile.serviceDetails.id(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    service.isDeleted = false;
    service.deletedAt = null;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Service restored successfully',
      service
    });
  } catch (error) {
    console.error('Restore service error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Hard delete a service (permanent)
// @route   DELETE /api/garages/services/:serviceId/hard
// @access  Private (Garage Owner)
exports.hardDeleteService = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'garage_owner') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const serviceId = req.params.serviceId;
    
    // ✅ Remove from serviceDetails array
    user.garageProfile.serviceDetails = user.garageProfile.serviceDetails.filter(
      s => s._id.toString() !== serviceId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Service permanently deleted'
    });
  } catch (error) {
    console.error('Hard delete service error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};