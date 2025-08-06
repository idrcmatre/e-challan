const Challan = require('../models/Challan');
const User = require('../models/User');
const emailService = require('../utils/emailService');

const getChallans = async (req, res) => {
    try {
        let query = {};

        // If user is citizen, only show their challans
        if (req.user.role === 'citizen') {
            query.citizenId = req.user.id;
        }

        // If user is officer, show challans they created
        if (req.user.role === 'officer') {
            query.officerId = req.user.id;
        }

        const challans = await Challan.find(query)
            .populate('citizenId', 'name email phone')
            .populate('officerId', 'name')
            .sort({ createdAt: -1 });

        res.json(challans);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getChallanById = async (req, res) => {
    try {
        const challan = await Challan.findById(req.params.id)
            .populate('citizenId', 'name email phone address')
            .populate('officerId', 'name');

        if (!challan) {
            return res.status(404).json({ message: 'Challan not found' });
        }

        // Check if user has permission to view this challan
        if (req.user.role === 'citizen' && challan.citizenId._id.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        res.json(challan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createChallan = async (req, res) => {
    const {
        citizenEmail,
        vehicleNumber,
        violationType,
        location,
        fineAmount,
        description
    } = req.body;

    try {
        // Only officers can create challans
        if (req.user.role !== 'officer') {
            return res.status(403).json({ message: 'Only officers can create challans' });
        }

        // Find citizen by email
        const citizen = await User.findOne({ email: citizenEmail });
        if (!citizen) {
            return res.status(404).json({ message: 'Citizen not found' });
        }

        const challan = await Challan.create({
            citizenId: citizen._id,
            officerId: req.user.id,
            vehicleNumber,
            violationType,
            location,
            fineAmount,
            description
        });

        const populatedChallan = await Challan.findById(challan._id)
            .populate('citizenId', 'name email')
            .populate('officerId', 'name');

        // Send email notification to citizen
        try {
            await emailService.sendChallanNotification(citizen.email, populatedChallan);
        } catch (emailError) {
            console.error('Email notification failed:', emailError);
            // Don't fail the entire request if email fails
        }

        res.status(201).json(populatedChallan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateChallan = async (req, res) => {
    try {
        const challan = await Challan.findById(req.params.id);
        if (!challan) {
            return res.status(404).json({ message: 'Challan not found' });
        }

        // Check permissions
        if (req.user.role === 'citizen' && challan.citizenId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        const { status, description } = req.body;

        if (status) challan.status = status;
        if (description) challan.description = description;

        if (status === 'paid') {
            challan.paymentDate = new Date();
        }

        const updatedChallan = await challan.save();

        const populatedChallan = await Challan.findById(updatedChallan._id)
            .populate('citizenId', 'name email')
            .populate('officerId', 'name');

        res.json(populatedChallan);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteChallan = async (req, res) => {
    try {
        const challan = await Challan.findById(req.params.id);
        if (!challan) {
            return res.status(404).json({ message: 'Challan not found' });
        }

        // Only officers and admins can delete challans
        if (req.user.role === 'citizen') {
            return res.status(403).json({ message: 'Access denied' });
        }

        await challan.deleteOne();
        res.json({ message: 'Challan deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getDashboardStats = async (req, res) => {
    try {
        let stats = {};

        if (req.user.role === 'citizen') {
            const totalChallans = await Challan.countDocuments({ citizenId: req.user.id });
            const pendingChallans = await Challan.countDocuments({
                citizenId: req.user.id,
                status: 'pending'
            });
            const paidChallans = await Challan.countDocuments({
                citizenId: req.user.id,
                status: 'paid'
            });

            const totalFines = await Challan.aggregate([
                { $match: { citizenId: req.user.id } },
                { $group: { _id: null, total: { $sum: '$fineAmount' } } }
            ]);

            stats = {
                totalChallans,
                pendingChallans,
                paidChallans,
                totalFineAmount: totalFines[0]?.total || 0
            };
        } else if (req.user.role === 'officer') {
            const issuedChallans = await Challan.countDocuments({ officerId: req.user.id });
            const todayChallans = await Challan.countDocuments({
                officerId: req.user.id,
                createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
            });

            stats = {
                issuedChallans,
                todayChallans
            };
        }

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getChallans,
    getChallanById,
    createChallan,
    updateChallan,
    deleteChallan,
    getDashboardStats
};