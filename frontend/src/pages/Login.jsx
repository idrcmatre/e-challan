// frontend/src/pages/Login.jsx - BEAUTIFUL VERSION
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post('http://16.176.131.224/api/auth/login', formData);
            login(response.data);

            // Success notification
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
            notification.innerHTML = '✅ Login successful! Welcome back.';
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);

            navigate('/dashboard');
        } catch (error) {
            // Error notification
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
            notification.innerHTML = '❌ ' + (error.response?.data?.message || 'Login failed');
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                        <span className="text-white text-2xl font-bold">E</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h1>
                    <p className="text-gray-600">Sign in to your E-Challan account</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400">📧</span>
                                </div>
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                                    placeholder="Enter your email address"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <span className="text-gray-400">🔒</span>
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors placeholder-gray-400"
                                    placeholder="Enter your password"
                                />
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <span>{showPassword ? '🙈' : '👁️'}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Signing in...
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <span className="mr-2">🚀</span>
                                    Sign In
                                </div>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">New to E-Challan?</span>
                            </div>
                        </div>
                    </div>

                    {/* Register Link */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/register"
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                            <span className="mr-2">📝</span>
                            Create New Account
                        </Link>
                    </div>
                </div>

                {/* Demo Credentials */}
                <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Demo Credentials:</h3>
                    <div className="space-y-2 text-xs">
                        <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
                            <span className="font-medium text-blue-900">👮‍♂️ Officer:</span>
                            <span className="text-blue-700">officer@test.com / password123</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                            <span className="font-medium text-green-900">🚗 Citizen:</span>
                            <span className="text-green-700">citizen@test.com / password123</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;