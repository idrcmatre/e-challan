const mongoose = require('mongoose');

const challanSchema = new mongoose.Schema({
    challanNumber: {
        type: String,
        required: true,
        unique: true,
        default: function () {
            return 'CH' + Date.now() + Math.floor(Math.random() * 1000);
        }
    },
    citizenId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    officerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vehicleNumber: { type: String, required: true },
    violationType: {
        type: String,
        required: true,
        enum: ['Speeding', 'Red Light', 'Wrong Parking', 'No Helmet', 'Mobile Usage', 'Other']
    },
    location: { type: String, required: true },
    dateTime: { type: Date, required: true, default: Date.now },
    fineAmount: { type: Number, required: true },
    status: {
        type: String,
        enum: ['pending', 'paid', 'disputed', 'cancelled'],
        default: 'pending'
    },
    description: { type: String },
    evidenceUrl: { type: String },
    paymentDate: { type: Date },
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