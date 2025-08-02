const Challan = require('../models/Challan');

const processPayment = async (req, res) => {
    const { challanId, paymentMethod } = req.body;

    try {
        const challan = await Challan.findById(challanId);
        if (!challan) {
            return res.status(404).json({ message: 'Challan not found' });
        }

        // Check if user owns this challan
        if (challan.citizenId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        if (challan.status === 'paid') {
            return res.status(400).json({ message: 'Challan already paid' });
        }

        // Simulate payment processing
        const transactionId = 'TXN' + Date.now() + Math.floor(Math.random() * 1000);

        // Update challan status
        challan.status = 'paid';
        challan.paymentDate = new Date();
        await challan.save();

        const paymentRecord = {
            transactionId,
            challanId: challan._id,
            amount: challan.fineAmount,
            paymentMethod,
            paymentDate: new Date(),
            status: 'completed'
        };

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

const getPaymentHistory = async (req, res) => {
    try {
        const paidChallans = await Challan.find({
            citizenId: req.user.id,
            status: 'paid'
        })
            .populate('officerId', 'name')
            .sort({ paymentDate: -1 });

        const paymentHistory = paidChallans.map(challan => ({
            transactionId: 'TXN' + challan._id.toString().slice(-8),
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