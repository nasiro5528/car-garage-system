const Garage = require('../models/Garage');
const User = require('../models/User');

// @desc    Register a garage (Garage Owner only)
// @route   POST /api/garages/register
// @access  Private (Garage Owner)
exports.registerGarage = async (req, res) => {
    try {
        const user = req.user;
        
        // Check if user is garage owner
        if (user.role !== 'garage_owner') {
            return res.status(403).json({
                success: false,
                message: 'Only garage owners can register garages'
            });
        }
        
        // Required fields from document
        const requiredFields = [
            'name', 'address', 'city', 'licenseNumber',
            'capacity', 'availableSlots', 'services'
        ];
        
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`
            });
        }
        
        // Create garage
        const garageData = {
            name: req.body.name,
            address: req.body.address,
            city: req.body.city,
            licenseNumber: req.body.licenseNumber,
            capacity: parseInt(req.body.capacity),
            availableSlots: parseInt(req.body.availableSlots),
            services: req.body.services,
            phone: req.body.phone || '',
            email: req.body.email || '',
            description: req.body.description || '',
            latitude: req.body.latitude || 0,
            longitude: req.body.longitude || 0,
            owner: user._id,
            status: 'pending' // Needs admin approval
        };
        
        // Check for license file (as per document)
        if (req.body.licenseFile) {
            garageData.licenseFile = req.body.licenseFile;
        }
        
        const garage = await Garage.create(garageData);
        
        res.status(201).json({
            success: true,
            message: 'Garage registration submitted for approval',
            garage
        });
        
    } catch (error) {
        console.error('Garage registration error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all approved garages
// @route   GET /api/garages
// @access  Public
exports.getAllGarages = async (req, res) => {
    try {
        const { city, service, page = 1, limit = 10 } = req.query;
        
        // Build filter
        const filter = { 
            status: 'approved',
            isDeleted: false 
        };
        
        if (city) filter.city = { $regex: city, $options: 'i' };
        if (service) filter.services = { $in: [service] };
        
        // Execute query with pagination
        const garages = await Garage.find(filter)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .populate('owner', 'name email phone')
            .sort({ createdAt: -1 });
        
        // Get total count
        const total = await Garage.countDocuments(filter);
        
        res.status(200).json({
            success: true,
            count: garages.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            garages
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single garage by ID
// @route   GET /api/garages/:id
// @access  Public
exports.getGarageById = async (req, res) => {
    try {
        const garage = await Garage.findById(req.params.id)
            .populate('owner', 'name email phone')
            .populate('mechanics', 'name specialty rating');
        
        if (!garage) {
            return res.status(404).json({
                success: false,
                message: 'Garage not found'
            });
        }
        
        res.status(200).json({
            success: true,
            garage
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get garages by owner
// @route   GET /api/garages/owner/my-garages
// @access  Private (Garage Owner)
exports.getMyGarages = async (req, res) => {
    try {
        const garages = await Garage.find({ 
            owner: req.user._id,
            isDeleted: false 
        });
        
        res.status(200).json({
            success: true,
            count: garages.length,
            garages
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update garage
// @route   PUT /api/garages/:id
// @access  Private (Garage Owner or Admin)
exports.updateGarage = async (req, res) => {
    try {
        let garage = await Garage.findById(req.params.id);
        
        if (!garage) {
            return res.status(404).json({
                success: false,
                message: 'Garage not found'
            });
        }
        
        // Check authorization
        if (req.user.role !== 'admin' && garage.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this garage'
            });
        }
        
        // Update garage
        garage = await Garage.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        
        res.status(200).json({
            success: true,
            message: 'Garage updated successfully',
            garage
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};