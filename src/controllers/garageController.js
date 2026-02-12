const User = require('../models/User');

exports.getMyGarage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user.role !== 'garage_owner') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const garageProfile = user.garageProfile || {};
    if (garageProfile.paymentStatus !== 'paid') {
      return res.status(402).json({
        success: false,
        message: 'Payment required',
        paymentStatus: garageProfile.paymentStatus || 'pending',
        requiresPayment: true
      });
    }
    if (garageProfile.approvalStatus !== 'approved') {
      return res.status(403).json({
        success: false,
        message: `Your garage is ${garageProfile.approvalStatus || 'pending'}. Please wait for admin approval.`,
        approvalStatus: garageProfile.approvalStatus || 'pending',
        requiresApproval: true
      });
    }
    res.status(200).json({ success: true, garageProfile });
  } catch (error) {
    console.error('Get my garage error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateMyGarage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (user.role !== 'garage_owner') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    const allowedUpdates = [
      'garageName', 'address', 'services', 'hourlyRate',
      'capacity', 'description', 'phone', 'email', 'licenseNumber'
    ];
    const updateData = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updateData[`garageProfile.${key}`] = req.body[key];
      }
    });
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('garageProfile');
    res.status(200).json({
      success: true,
      message: 'Garage profile updated successfully',
      garageProfile: updatedUser.garageProfile
    });
  } catch (error) {
    console.error('Update garage error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllGarages = async (req, res) => {
  try {
    const { city, service, page = 1, limit = 10 } = req.query;
    const filter = {
      role: 'garage_owner',
      'garageProfile.approvalStatus': 'approved',
      isDeleted: false
    };
    if (city) filter['garageProfile.address'] = { $regex: city, $options: 'i' };
    if (service) filter['garageProfile.services'] = { $in: [service] };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const users = await User.find(filter)
      .select('name phone garageProfile')
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    const garages = users.map(user => ({
      _id: user._id,
      ownerName: user.name,
      phone: user.phone,
      ...user.garageProfile.toObject()
    }));
    const total = await User.countDocuments(filter);
    res.status(200).json({
      success: true,
      count: garages.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      garages
    });
  } catch (error) {
    console.error('Get all garages error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getGarageById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name phone garageProfile');
    if (!user || user.role !== 'garage_owner' || user.garageProfile?.approvalStatus !== 'approved') {
      return res.status(404).json({ success: false, message: 'Garage not found or not approved yet' });
    }
    res.status(200).json({
      success: true,
      garage: {
        _id: user._id,
        ownerName: user.name,
        phone: user.phone,
        ...user.garageProfile.toObject()
      }
    });
  } catch (error) {
    console.error('Get garage by ID error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};