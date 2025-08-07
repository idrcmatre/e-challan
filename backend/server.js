const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/challans', require('./routes/challanRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 5001;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;