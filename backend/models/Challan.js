/**
 * Challan Model
 * Defines schema for traffic violation challans (e-tickets)
 */

const mongoose = require('mongoose');


const challanSchema = new mongoose.Schema({
    challanNumber: {
        type: String,
        required: true,
        unique: true,
        // Auto-generate unique challan number if not provided
        default: function () {
            return 'CH' + Date.now() + Math.floor(Math.random() * 1000);
        }
    },
    citizenId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, //Reference to violator
    officerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, //Reference to issuing officer
    vehicleNumber: { type: String, required: true }, // Vehicle registration number
    violationType: {
        type: String,
        required: true,
        enum: ['Speeding', 'Red Light', 'Wrong Parking', 'No Helmet', 'Mobile Usage', 'Other'] // Predefined violation types
    },
    location: { type: String, required: true }, // Where violation occurred
    dateTime: { type: Date, required: true, default: Date.now }, // When violation occurred
    fineAmount: { type: Number, required: true }, // Fine amount in currency
    status: {
        type: String,
        enum: ['pending', 'paid', 'disputed', 'cancelled'], // Challan status
        default: 'pending'
    },
    description: { type: String }, // Additional details about violation
    evidenceUrl: { type: String },
    paymentDate: { type: Date }, // When fine was paid (if applicable)
    dueDate: {
        type: Date,

        default: function () {
            return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
        }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

challanSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Challan', challanSchema);