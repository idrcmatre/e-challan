// frontend/src/components/ChallanList.jsx - BEAUTIFUL VERSION
import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ChallanList = ({ challans, onChallanUpdate }) => {
    const { user } = useAuth();
    const [payingChallan, setPayingChallan] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('Card');
    const [paymentLoading, setPaymentLoading] = useState(false);

    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: {
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
                border: 'border-yellow-200',
                icon: '⏳'
            },
            paid: {
                bg: 'bg-green-100',
                text: 'text-green-800',
                border: 'border-green-200',
                icon: '✅'
            },
            disputed: {
                bg: 'bg-red-100',
                text: 'text-red-800',
                border: 'border-red-200',
                icon: '⚠️'
            },
            cancelled: {
                bg: 'bg-gray-100',
                text: 'text-gray-800',
                border: 'border-gray-200',
                icon: '❌'
            }
        };

        const config = statusConfig[status] || statusConfig.pending;

        return (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
                <span className="mr-1">{config.icon}</span>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getViolationIcon = (violationType) => {
        const icons = {
            'Speeding': '🚄',
            'Red Light': '🚦',
            'Wrong Parking': '🅿️',
            'No Helmet': '🪖',
            'Mobile Usage': '📱',
            'Other': '🚨'
        };
        return icons[violationType] || '🚨';
    };

    const handlePayment = async (challanId) => {
        setPaymentLoading(true);
        try {
            const response = await axios.post(
                'http://16.176.131.224/api/payments/process',
                { challanId, paymentMethod },
                {
                    headers: { Authorization: `Bearer ${user.token}` }
                }
            );

            // Success notification
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
            notification.innerHTML = '✅ Payment successful!';
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);

            onChallanUpdate(response.data.challan);
            setPayingChallan(null);
        } catch (error) {
            alert(error.response?.data?.message || 'Payment failed');
        } finally {
            setPaymentLoading(false);
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatDateTime = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (challans.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <span className="text-4xl">📋</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No challans found</h3>
                <p className="text-gray-500">
                    {user.role === 'citizen'
                        ? "You don't have any traffic violations. Keep driving safely!"
                        : "No challans have been issued yet."
                    }
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {challans.map((challan) => (
                    <div key={challan._id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                        <span className="text-2xl">{getViolationIcon(challan.violationType)}</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {challan.challanNumber}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {challan.violationType} • {challan.vehicleNumber}
                                        </p>
                                    </div>
                                </div>
                                {getStatusBadge(challan.status)}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <span className="text-blue-600">📍</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Location</p>
                                        <p className="font-medium text-gray-900">{challan.location}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                        <span className="text-red-600">₹</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Fine Amount</p>
                                        <p className="font-bold text-red-600 text-lg">₹{challan.fineAmount}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <span className="text-gray-600">📅</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Date & Time</p>
                                        <p className="font-medium text-gray-900">{formatDateTime(challan.dateTime)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <span className="text-orange-600">⏰</span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Due Date</p>
                                        <p className="font-medium text-gray-900">{formatDate(challan.dueDate)}</p>
                                    </div>
                                </div>
                            </div>

                            {challan.description && (
                                <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                                    <p className="text-sm text-gray-600 mb-1">Additional Details</p>
                                    <p className="text-gray-800">{challan.description}</p>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                <div className="flex items-center space-x-4">
                                    {challan.officerId && (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span className="mr-1">👮‍♂️</span>
                                            Issued by: {challan.officerId.name}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center space-x-3">
                                    {user.role === 'citizen' && challan.status === 'pending' && (
                                        <button
                                            onClick={() => setPayingChallan(challan._id)}
                                            className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                                        >
                                            <span className="mr-2">💳</span>
                                            Pay Now
                                        </button>
                                    )}

                                    <button className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                                        <span className="mr-2">📄</span>
                                        View Details
                                    </button>
                                </div>
                            </div>

                            {/* Payment Success Message */}
                            {challan.status === 'paid' && challan.paymentDate && (
                                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center">
                                        <span className="text-green-600 mr-2">✅</span>
                                        <div>
                                            <p className="text-sm font-medium text-green-800">
                                                Payment Completed
                                            </p>
                                            <p className="text-sm text-green-600">
                                                Paid on {formatDateTime(challan.paymentDate)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Payment Modal */}
            {payingChallan && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl max-w-md w-full shadow-2xl">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Process Payment</h3>
                                <button
                                    onClick={() => setPayingChallan(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <span className="text-xl">×</span>
                                </button>
                            </div>

                            <div className="mb-6">
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-blue-800 font-medium">Amount to Pay:</span>
                                        <span className="text-2xl font-bold text-blue-900">
                                            ₹{challans.find(c => c._id === payingChallan)?.fineAmount}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Payment Method
                                </label>
                                <div className="space-y-2">
                                    {[
                                        { value: 'Card', label: 'Credit/Debit Card', icon: '💳' },
                                        { value: 'Bank Transfer', label: 'Bank Transfer', icon: '🏦' },
                                        { value: 'Digital Wallet', label: 'Digital Wallet', icon: '📱' }
                                    ].map((method) => (
                                        <label key={method.value} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                                            <input
                                                type="radio"
                                                value={method.value}
                                                checked={paymentMethod === method.value}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="text-blue-600"
                                            />
                                            <span className="text-lg">{method.icon}</span>
                                            <span className="font-medium text-gray-900">{method.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={() => handlePayment(payingChallan)}
                                    disabled={paymentLoading}
                                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                                >
                                    {paymentLoading ? (
                                        <div className="flex items-center justify-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Processing...
                                        </div>
                                    ) : (
                                        <>
                                            <span className="mr-2">💳</span>
                                            Pay Now
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => setPayingChallan(null)}
                                    className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChallanList;