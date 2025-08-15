import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import API_BASE_URL from '../config/api';

const ChallanForm = ({ onChallanCreated, onClose }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        citizenEmail: '',
        vehicleNumber: '',
        violationType: 'Speeding',
        location: '',
        fineAmount: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);

    const violationTypes = [
        'Speeding',
        'Red Light',
        'Wrong Parking',
        'No Helmet',
        'Mobile Usage',
        'Other'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                `${API_BASE_URL}/challans`,
                formData,
                {
                    headers: { Authorization: `Bearer ${user.token}` }
                }
            );

            onChallanCreated(response.data);
            setFormData({
                citizenEmail: '',
                vehicleNumber: '',
                violationType: 'Speeding',
                location: '',
                fineAmount: '',
                description: ''
            });
            onClose();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create challan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Issue New E-Challan</h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Citizen Email
                    </label>
                    <input
                        type="email"
                        required
                        value={formData.citizenEmail}
                        onChange={(e) => setFormData({ ...formData, citizenEmail: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="citizen@example.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vehicle Number
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.vehicleNumber}
                        onChange={(e) => setFormData({ ...formData, vehicleNumber: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="ABC-1234"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Violation Type
                    </label>
                    <select
                        value={formData.violationType}
                        onChange={(e) => setFormData({ ...formData, violationType: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        {violationTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Street name, City"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fine Amount (₹)
                    </label>
                    <input
                        type="number"
                        required
                        min="0"
                        value={formData.fineAmount}
                        onChange={(e) => setFormData({ ...formData, fineAmount: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        placeholder="500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        rows="3"
                        placeholder="Additional details about the violation..."
                    />
                </div>

                <div className="flex space-x-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Creating...' : 'Issue Challan'}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ChallanForm;