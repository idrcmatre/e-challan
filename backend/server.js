/**
 * Main Server File
 * Express.js application entry point with middleware and route configuration
 */

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB database
connectDB();

// Initialize Express application
const app = express();

app.use(cors()); // Enable Cross-Origin Resource Sharing for frontend
app.use(express.json());

///API Routes
app.use('/api/auth', require('./routes/authRoutes')); //Authentication routes
app.use('/api/challans', require('./routes/challanRoutes')); //Challan management routes
app.use('/api/payments', require('./routes/paymentRoutes')); // Payment processing routes

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Set port from environment or default to 5001
const PORT = process.env.PORT || 5001;


if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}


module.exports = app;