# E-Challan System

A comprehensive traffic violation management system built with Node.js, React, and MongoDB.

## Features

- User authentication (Citizens, Officers, Admins)
- Traffic violation management
- Payment processing
- Dashboard analytics
- Mobile responsive design

## Tech Stack

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose
- JWT Authentication
- Nodemailer for emails

**Frontend:**
- React.js with React Router
- Tailwind CSS
- Axios for API calls
- Context API for state management

## Installation

### Backend
```bash
cd backend
npm install
npm start
Frontend
bashcd frontend
npm install
npm start
API Endpoints

POST /api/auth/register - User registration
POST /api/auth/login - User login
GET /api/challans - Get challans
POST /api/challans - Create challan
POST /api/payments/process - Process payment

Deployment
The application is deployed using GitHub Actions CI/CD pipeline to AWS.
License
MIT License
EOF
# CI/CD Pipeline Ready
# CI/CD Pipeline Test - Wed Aug  6 04:06:41 UTC 2025
# Test CI/CD Pipeline - Thu Aug  7 08:24:43 UTC 2025
