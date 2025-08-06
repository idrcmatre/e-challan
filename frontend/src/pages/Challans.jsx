import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ChallanForm from '../components/ChallanForm';
import ChallanList from '../components/ChallanList';

const Challans = () => {
    const { user } = useAuth();
    const [challans, setChallans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [filter, setFilter] = useState('all');

 const fetchChallans = async () => {
     try {
         const response = await axios.get(
             'http://localhost:5001/api/challans',
             {
                 headers: { Authorization: `Bearer ${user.token}` }
             }
         );
         setChallans(response.data);
     } catch (error) {
         console.error('Failed to fetch challans:', error);
     } finally {
         setLoading(false);
     }
 };


    useEffect(() => {
        fetchChallans();
    }, [fetchChallans]);


    const handleChallanCreated = (newChallan) => {
        setChallans([newChallan, ...challans]);
    };

    const handleChallanUpdate = (updatedChallan) => {
        setChallans(challans.map(challan =>
            challan._id === updatedChallan._id ? updatedChallan : challan
        ));
    };

    const filteredChallans = challans.filter(challan => {
        if (filter === 'all') return true;
        return challan.status === filter;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Loading challans...</div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    {user.role === 'officer' ? 'Manage Challans' : 'My Challans'}
                </h1>

                {user.role === 'officer' && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    >
                        Issue New Challan
                    </button>
                )}
            </div>

            {/* Filter Tabs */}
            <div className="mb-6">
                <div className="flex space-x-4">
                    {['all', 'pending', 'paid', 'disputed'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-md text-sm font-medium ${filter === status
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                            {status !== 'all' && (
                                <span className="ml-1">
                                    ({challans.filter(c => c.status === status).length})
                                </span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Challan Form Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="max-w-md w-full">
                        <ChallanForm
                            onChallanCreated={handleChallanCreated}
                            onClose={() => setShowForm(false)}
                        />
                    </div>
                </div>
            )}

            {/* Challan List */}
            <ChallanList
                challans={filteredChallans}
                onChallanUpdate={handleChallanUpdate}
            />
        </div>
    );
};

export default Challans;
