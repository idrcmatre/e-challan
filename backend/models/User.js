/**
 * User Model
 * Defines schema and methods for user entities in the system
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ['citizen', 'officer', 'admin'], // Allowed user roles
        default: 'citizen'
    },
    phone: { type: String },
    address: { type: String },
    licenseNumber: { type: String }, // Driving license number
    vehicleNumbers: [{ type: String }], //Array of vehicle registration numbers
    isActive: { type: Boolean, default: true }, // Account status
    createdAt: { type: Date, default: Date.now }
});


userSchema.pre('save', async function (next) {

    if (!this.isModified('password')) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);