const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// ========== HELPER FUNCTIONS ==========
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: "30d",
    });
};

// ========== PUBLIC FUNCTIONS ==========

// 1. REGISTER USER
const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide name, email, and password' 
            });
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ 
                success: false,
                message: 'User already exists' 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'carOwner'
        });

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token: token
        });

    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error',
            error: error.message 
        });
    }
};

// 2. LOGIN USER
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide email and password' 
            });
        }

        // Find user
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Check if account is deleted
        if (user.isDeleted) {
            return res.status(401).json({ 
                success: false,
                message: 'Account is deactivated. Contact admin.' 
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials' 
            });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token: token
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
};

// ========== PROTECTED FUNCTIONS (ALL LOGGED-IN USERS) ==========

// 3. GET OWN PROFILE
const getProfile = async (req, res) => {
    try {
        res.json({
            success: true,
            user: req.user
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
};

// 4. UPDATE OWN PROFILE
const updateProfile = async (req, res) => {
    try {
        const user = req.user;
        const { name, email, password } = req.body;

        // Update fields if provided
        if (name) user.name = name;
        if (email) user.email = email;
        
        // Update password if provided
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
};

// 5. SOFT DELETE OWN ACCOUNT
const softDeleteOwnAccount = async (req, res) => {
    try {
        const user = req.user;
        
        // Mark as deleted
        user.isDeleted = true;
        user.deletedAt = Date.now();
        await user.save();

        res.json({
            success: true,
            message: 'Your account has been deactivated. Contact admin to restore.'
        });

    } catch (error) {
        console.error('Soft delete error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
};

// 6. LOGOUT
const logout = async (req, res) => {
    try {
        // For JWT, logout is client-side (just remove token)
        // We just return success message
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
};

// ========== ADMIN FUNCTIONS ==========

// 7. CREATE ADMIN USER (ONE-TIME)
const createAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ 
                success: false,
                message: 'Please provide name, email, and password' 
            });
        }

        // Check if admin already exists
        const adminExists = await User.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ 
                success: false,
                message: 'Admin already exists' 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create admin
        const adminUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'admin'
        });

        res.status(201).json({
            success: true,
            message: 'Admin created successfully',
            user: {
                id: adminUser._id,
                name: adminUser.name,
                email: adminUser.email,
                role: adminUser.role
            }
        });

    } catch (error) {
        console.error('Create admin error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
};

// 8. GET SINGLE USER BY ID (ADMIN ONLY)
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        res.json({
            success: true,
            user: user
        });

    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
};

// 9. HARD DELETE USER (PERMANENT - ADMIN ONLY)
const hardDeleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        res.json({
            success: true,
            message: 'User permanently deleted'
        });

    } catch (error) {
        console.error('Hard delete error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
};

// 10. RESTORE SOFT-DELETED USER (ADMIN ONLY)
const restoreUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        
        if (!user) {
            return res.status(404).json({ 
                success: false,
                message: 'User not found' 
            });
        }

        // Restore user
        user.isDeleted = false;
        user.deletedAt = null;
        await user.save();

        res.json({
            success: true,
            message: 'User restored successfully'
        });

    } catch (error) {
        console.error('Restore user error:', error);
        res.status(500).json({ 
            success: false,
            message: 'Server error' 
        });
    }
};

// ========== EXPORTS ==========
module.exports = {
    // Public functions
    register,
    login,
    
    // Protected functions (all logged-in users)
    getProfile,
    updateProfile,
    softDeleteOwnAccount,
    logout,
    
    // Admin functions
    createAdmin,
    getUserById,
    hardDeleteUser,
    restoreUser
};