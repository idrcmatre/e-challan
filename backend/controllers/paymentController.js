/**
 * Payment Controller
 * Handles payment processing and payment history for challans
 */

const Challan = require('../models/Challan');

//Process payment for a challan (mock payment system)

const processPayment = async (req, res) => {
    const { challanId, paymentMethod } = req.body;

    try {
        // Find the challan to be paid
        const challan = await Challan.findById(challanId);
        if (!challan) {
            return res.status(404).json({ message: 'Challan not found' });
        }

        // Ensure only the challan owner can pay
        if (challan.citizenId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Check if challan is already paid
        if (challan.status === 'paid') {
            return res.status(400).json({ message: 'Challan already paid' });
        }

        //Generate mock transaction ID for payment simulation
        const transactionId = 'TXN' + Date.now() + Math.floor(Math.random() * 1000);

        // Update challan status to paid
        challan.status = 'paid';
        challan.paymentDate = new Date();
        await challan.save();

        //reate mock payment record object
        const paymentRecord = {
            transactionId,
            challanId: challan._id,
            amount: challan.fineAmount,
            paymentMethod,
            paymentDate: new Date(),
            status: 'completed'
        };

        //Return payment confirmation with updated challan data
        res.json({
            message: 'Payment processed successfully',
            payment: paymentRecord,
            challan: await Challan.findById(challan._id)
                .populate('citizenId', 'name email')
                .populate('officerId', 'name')
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get payment history for the authenticated user 
 
const getPaymentHistory = async (req, res) => {
    try {
        // Find all paid challans for the authenticated user
        const paidChallans = await Challan.find({
            citizenId: req.user.id,
            status: 'paid'
        })
            .populate('officerId', 'name')
            .sort({ paymentDate: -1 }); // Sort by payment date, newest first

        // Transform challan data into payment history format
        const paymentHistory = paidChallans.map(challan => ({
            transactionId: 'TXN' + challan._id.toString().slice(-8), // Mock transaction ID
            challan: {
                id: challan._id,
                challanNumber: challan.challanNumber,
                violationType: challan.violationType,
                fineAmount: challan.fineAmount,
                vehicleNumber: challan.vehicleNumber
            },
            paymentDate: challan.paymentDate,
            amount: challan.fineAmount,
            status: 'completed'
        }));

        res.json(paymentHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { processPayment, getPaymentHistory };