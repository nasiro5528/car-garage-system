const Car = require('../models/Car');

// @desc    Add a car (Car Owner only)
// @route   POST /api/cars
// @access  Private (Car Owner)
exports.addCar = async (req, res) => {
    try {
        // Check if user is car owner
        if (req.user.role !== 'car_owner') {
            return res.status(403).json({
                success: false,
                message: 'Only car owners can add cars'
            });
        }
        
        const { licensePlate, make, model, year, color, vin } = req.body;
        
        // REQUIRED FIELDS (VIN is required based on your model)
        const requiredFields = ['licensePlate', 'make', 'model', 'vin'];
        const missingFields = requiredFields.filter(field => !req.body[field]);
        
        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`,
                requiredFields: requiredFields,
                example: {
                    licensePlate: "ABC123",
                    vin: "1HGCM82633A123456",
                    make: "Toyota",
                    model: "Camry"
                }
            });
        }
        
        // Check if car with same license plate exists
        const existingCar = await Car.findOne({ 
            licensePlate: licensePlate.toUpperCase(),
            owner: req.user._id,
            isDeleted: false 
        });
        
        if (existingCar) {
            return res.status(400).json({
                success: false,
                message: 'Car with this license plate already exists'
            });
        }
        
        // Create car
        const car = await Car.create({
            licensePlate: licensePlate.toUpperCase(),
            vin: vin.toUpperCase(),
            make,
            model,
            year: year || new Date().getFullYear(),
            color: color || 'Unknown',
            owner: req.user._id
        });
        
        res.status(201).json({
            success: true,
            message: 'Car added successfully',
            car
        });
        
    } catch (error) {
        console.error('Add car error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get user's cars
// @route   GET /api/cars/my-cars
// @access  Private (Car Owner)
exports.getMyCars = async (req, res) => {
    try {
        if (req.user.role !== 'car_owner') {
            return res.status(403).json({
                success: false,
                message: 'Only car owners can view cars'
            });
        }
        
        const cars = await Car.find({ 
            owner: req.user._id,
            isDeleted: false 
        }).sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: cars.length,
            cars
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update car
// @route   PUT /api/cars/:id
// @access  Private (Car Owner)
exports.updateCar = async (req, res) => {
    try {
        let car = await Car.findById(req.params.id);
        
        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }
        
        // Check ownership
        if (car.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this car'
            });
        }
        
        // Update car
        car = await Car.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );
        
        res.status(200).json({
            success: true,
            message: 'Car updated successfully',
            car
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete car (soft delete)
// @route   DELETE /api/cars/:id
// @access  Private (Car Owner)
exports.deleteCar = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        
        if (!car) {
            return res.status(404).json({
                success: false,
                message: 'Car not found'
            });
        }
        
        // Check ownership
        if (car.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this car'
            });
        }
        
        // Soft delete
        car.isDeleted = true;
        car.deletedAt = Date.now();
        await car.save();
        
        res.status(200).json({
            success: true,
            message: 'Car deleted successfully'
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};