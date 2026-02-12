const User = require('../models/User');

exports.getPendingGarages = async (req, res) => {
  try {
    const pendingGarages = await User.find({
      role: 'garage_owner',
      'garageProfile.approvalStatus': 'pending',
      'garageProfile.paymentStatus': 'paid'
    }).select('name email phone garageProfile createdAt');
    res.json({ success: true, count: pendingGarages.length, garages: pendingGarages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.approveGarage = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Status must be approved or rejected' });
    }
    const user = await User.findById(req.params.id);
    if (!user || user.role !== 'garage_owner') {
      return res.status(404).json({ success: false, message: 'Garage owner not found' });
    }
    if (status === 'approved' && user.garageProfile?.paymentStatus !== 'paid') {
      return res.status(400).json({ success: false, message: 'Cannot approve before payment is completed' });
    }
    user.garageProfile.approvalStatus = status;
    await user.save();
    res.json({
      success: true,
      message: `Garage ${status} successfully`,
      garage: { id: user._id, name: user.garageProfile?.garageName, status: user.garageProfile?.approvalStatus }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllGarages = async (req, res) => {
  try {
    const { status, paymentStatus } = req.query;
    const filter = { role: 'garage_owner' };
    if (status) filter['garageProfile.approvalStatus'] = status;
    if (paymentStatus) filter['garageProfile.paymentStatus'] = paymentStatus;
    const garages = await User.find(filter).select('name email phone garageProfile createdAt');
    res.json({ success: true, count: garages.length, garages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ isDeleted: false });
    const totalGarages = await User.countDocuments({ role: 'garage_owner', isDeleted: false });
    const pendingGarages = await User.countDocuments({
      role: 'garage_owner',
      'garageProfile.approvalStatus': 'pending',
      'garageProfile.paymentStatus': 'paid'
    });
    const pendingPayments = await User.countDocuments({
      role: 'garage_owner',
      'garageProfile.paymentStatus': 'pending'
    });
    res.json({ success: true, stats: { totalUsers, totalGarages, pendingGarages, pendingPayments } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};