import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';

const ChallanList = ({ challans, onChallanUpdate }) => {
    const { user } = useAuth();
    const [payingChallan, setPayingChallan] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('Card');
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [editingChallan, setEditingChallan] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [editLoading, setEditLoading] = useState(false);

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
                `${API_BASE_URL}/payments/process`,
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

    const handleDelete = async (challanId) => {
        if (window.confirm('Are you sure you want to delete this challan? This action cannot be undone.')) {
            try {
                await axios.delete(`${API_BASE_URL}/challans/${challanId}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });

                // Success notification
                const notification = document.createElement('div');
                notification.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
                notification.innerHTML = '🗑️ Challan deleted successfully!';
                document.body.appendChild(notification);
                setTimeout(() => notification.remove(), 3000);

                onChallanUpdate('DELETE', challanId);
            } catch (error) {
                alert(error.response?.data?.message || 'Failed to delete challan');
            }
        }
    };

    const handleEdit = (challan) => {
        setEditingChallan(challan._id);
        setEditFormData({
            violationType: challan.violationType,
            location: challan.location,
            fineAmount: challan.fineAmount,
            description: challan.description,
            status: challan.status
        });
    };

    const handleEditSubmit = async (challanId) => {
        setEditLoading(true);

        try {
            const updateData = {};
            // Only include fields that have actually changed and are not empty
            const currentChallan = challans.find(c => c._id === challanId);

            // Prepare each field with proper validation
            if (editFormData.violationType && editFormData.violationType !== currentChallan.violationType) {
                updateData.violationType = editFormData.violationType;
            }

            if (editFormData.location && editFormData.location !== currentChallan.location) {
                updateData.location = editFormData.location;
            }

            if (editFormData.fineAmount && Number(editFormData.fineAmount) !== currentChallan.fineAmount) {
                updateData.fineAmount = Number(editFormData.fineAmount);
            }

            if (editFormData.description !== currentChallan.description) {
                updateData.description = editFormData.description || '';
            }

            if (editFormData.status && editFormData.status !== currentChallan.status) {
                updateData.status = editFormData.status;
            }


            if (Object.keys(updateData).length === 0) {
                console.log('⚠️ No changes detected, cancelling update');
                setEditingChallan(null);
                setEditFormData({});
                setEditLoading(false);
                return;
            }


            const response = await axios.put(
                `${API_BASE_URL}/challans/${challanId}`,
                updateData, // Send only the changed fields
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // Success notification
            const notification = document.createElement('div');
            notification.className = 'fixed top-4 right-4 bg-blue-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
            notification.innerHTML = '✏️ Challan updated successfully!';
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), 3000);

            onChallanUpdate(response.data);

            setEditingChallan(null);
            setEditFormData({});


        } catch (error) {
            console.error('Error response:', error.response?.data);

            // Show more detailed error
            const errorMessage = error.response?.data?.message || 'Failed to update challan';
            alert(`Update failed: ${errorMessage}`);
        } finally {
            setEditLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingChallan(null);
        setEditFormData({});
    };

    const violationTypes = [
        'Speeding',
        'Red Light',
        'Wrong Parking',
        'No Helmet',
        'Mobile Usage',
        'Other'
    ];

    const statusOptions = [
        'pending',
        'paid',
        'disputed',
        'cancelled'
    ];

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
                {challans.map((challan) => {
                    const isEditing = editingChallan === challan._id;

                    return (
                        <div key={challan._id} className={`bg-white rounded-xl shadow-lg border ${isEditing ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-200'} overflow-hidden hover:shadow-xl transition-all duration-300`}>
                            {/* Header */}
                            <div className={`${isEditing ? 'bg-gradient-to-r from-blue-100 to-indigo-100' : 'bg-gradient-to-r from-blue-50 to-indigo-50'} px-6 py-4 border-b border-gray-200`}>
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
                                                {isEditing ? (
                                                    <select
                                                        value={editFormData.violationType || challan.violationType}
                                                        onChange={(e) => setEditFormData({ ...editFormData, violationType: e.target.value })}
                                                        className="bg-white border border-gray-300 rounded px-2 py-1 text-sm"
                                                    >
                                                        {violationTypes.map(type => (
                                                            <option key={type} value={type}>{type}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    challan.violationType
                                                )} • {challan.vehicleNumber}
                                            </p>
                                        </div>
                                    </div>
                                    {isEditing ? (
                                        <select
                                            value={editFormData.status || challan.status}
                                            onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                                            className="bg-white border border-gray-300 rounded px-2 py-1 text-sm"
                                        >
                                            {statusOptions.map(status => (
                                                <option key={status} value={status}>
                                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        getStatusBadge(challan.status)
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                    {/* Location */}
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <span className="text-blue-600">📍</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Location</p>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editFormData.location || challan.location}
                                                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm font-medium"
                                                />
                                            ) : (
                                                <p className="font-medium text-gray-900">{challan.location}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Fine Amount */}
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                                            <span className="text-red-600">₹</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-500">Fine Amount</p>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={editFormData.fineAmount || challan.fineAmount}
                                                    onChange={(e) => setEditFormData({ ...editFormData, fineAmount: e.target.value })}
                                                    className="w-full border border-gray-300 rounded px-2 py-1 text-sm font-bold text-red-600"
                                                />
                                            ) : (
                                                <p className="font-bold text-red-600 text-lg">₹{challan.fineAmount}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Date & Time */}
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                                            <span className="text-gray-600">📅</span>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Date & Time</p>
                                            <p className="font-medium text-gray-900">{formatDateTime(challan.dateTime)}</p>
                                        </div>
                                    </div>

                                    {/* Due Date */}
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

                                {/* Description */}
                                {(challan.description || isEditing) && (
                                    <div className="mb-6 p-4 bg-gray-50 rounded-lg border">
                                        <p className="text-sm text-gray-600 mb-1">Additional Details</p>
                                        {isEditing ? (
                                            <textarea
                                                value={editFormData.description || challan.description || ''}
                                                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                                                className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                                                rows="3"
                                                placeholder="Additional details about the violation..."
                                            />
                                        ) : (
                                            <p className="text-gray-800">{challan.description}</p>
                                        )}
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
                                        {isEditing ? (
                                            <>
                                                <button
                                                    onClick={() => handleEditSubmit(challan._id)}
                                                    disabled={editLoading}
                                                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors shadow-sm"
                                                >
                                                    {editLoading ? (
                                                        <div className="flex items-center">
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                            Saving...
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <span className="mr-2">💾</span>
                                                            Save Changes
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="inline-flex items-center px-4 py-2 bg-gray-400 text-white text-sm font-medium rounded-lg hover:bg-gray-500 transition-colors shadow-sm"
                                                >
                                                    <span className="mr-2">❌</span>
                                                    Cancel
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                {user.role === 'citizen' && challan.status === 'pending' && (
                                                    <button
                                                        onClick={() => setPayingChallan(challan._id)}
                                                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                                                    >
                                                        <span className="mr-2">💳</span>
                                                        Pay Now
                                                    </button>
                                                )}

                                                {user.role === 'officer' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleEdit(challan)}
                                                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                                        >
                                                            <span className="mr-2">✏️</span>
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(challan._id)}
                                                            className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors shadow-sm"
                                                        >
                                                            <span className="mr-2">🗑️</span>
                                                            Delete
                                                        </button>
                                                    </>
                                                )}

                                                <button className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                                                    <span className="mr-2">📄</span>
                                                    View Details
                                                </button>
                                            </>
                                        )}
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
                    );
                })}
            </div>

            {/* Payment Modal - Keep this unchanged */}
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