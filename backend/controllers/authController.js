/**
 * Authentication Controller
 * Handles user registration, login, profile management
 */

const User = require('../models/User');
const jwt = require('jsonwebtoken');


// Generates JWT token for user authentication

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

//Register a new user in the system

const registerUser = async (req, res) => {
    const { name, email, password, role, phone, address, licenseNumber } = req.body;

    try {
        // Check if user already exists with this email
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user with provided data
        const user = await User.create({
            name,
            email,
            password, // Will be hashed by User model pre-save middleware
            role: role || 'citizen', // Default to citizen if no role specified
            phone,
            address,
            licenseNumber
        });

        // Return user data with JWT token (excluding password)
        res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Authenticate user login
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });

        // Verify user exists and password matches
        if (user && (await user.matchPassword(password))) {
            // Return user data with JWT token
            res.json({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get user profile information

const getProfile = async (req, res) => {
    try {
        // Find user by ID from JWT token, exclude password from response
        const user = await User.findById(req.user.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user profile information

const updateProfile = async (req, res) => {
    try {
        // Find user by ID from JWT token
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Extract update fields from request body
        const { name, phone, address, licenseNumber, vehicleNumbers } = req.body;

        // Update user fields only if new values provided
        user.name = name || user.name;
        user.phone = phone || user.phone;
        user.address = address || user.address;
        user.licenseNumber = licenseNumber || user.licenseNumber;
        user.vehicleNumbers = vehicleNumbers || user.vehicleNumbers;

        // Save updated user to database
        const updatedUser = await user.save();

        // Return updated user data (excluding password)
        res.json({
            id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            phone: updatedUser.phone,
            address: updatedUser.address,
            licenseNumber: updatedUser.licenseNumber,
            vehicleNumbers: updatedUser.vehicleNumbers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, getProfile, updateProfile };