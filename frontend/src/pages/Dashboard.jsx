// frontend/src/pages/Dashboard.jsx - BEAUTIFUL VERSION
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5001/api/challans/stats',
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                Here's your traffic violation overview
              </p>
            </div>
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium">
              {user.role === 'citizen' ? '🚗 Citizen' : '👮‍♂️ Officer'}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {user.role === 'citizen' ? (
          <>
            {/* Stats Cards for Citizens */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold">📋</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Challans</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.totalChallans || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-yellow-500 hover:shadow-xl transition-shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <span className="text-yellow-600 font-bold">⏳</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {stats.pendingChallans || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-bold">✅</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Paid</p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.paidChallans || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-red-500 hover:shadow-xl transition-shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-red-600 font-bold">₹</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Fines</p>
                    <p className="text-2xl font-bold text-red-600">
                      ₹{stats.totalFineAmount || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Stats Cards for Officers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500 hover:shadow-xl transition-shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-blue-600 font-bold">📋</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Challans Issued</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {stats.issuedChallans || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-green-500 hover:shadow-xl transition-shadow">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 font-bold">📅</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Today's Challans</p>
                    <p className="text-2xl font-bold text-green-600">
                      {stats.todayChallans || 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Quick Actions Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              ⚡
            </span>
            Quick Actions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {user.role === 'citizen' ? (
              <>
                <a
                  href="/challans"
                  className="group block p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 border border-blue-200"
                >
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">🚗</span>
                    <h3 className="font-bold text-blue-900 group-hover:text-blue-700">View My Challans</h3>
                  </div>
                  <p className="text-sm text-blue-700">Check your traffic violations and pay fines</p>
                </a>
                
                <a
                  href="/payments"
                  className="group block p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 border border-green-200"
                >
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">💳</span>
                    <h3 className="font-bold text-green-900 group-hover:text-green-700">Payment History</h3>
                  </div>
                  <p className="text-sm text-green-700">View your payment records and receipts</p>
                </a>
                
                <a
                  href="/profile"
                  className="group block p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 border border-purple-200"
                >
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">👤</span>
                    <h3 className="font-bold text-purple-900 group-hover:text-purple-700">Update Profile</h3>
                  </div>
                  <p className="text-sm text-purple-700">Manage your personal information</p>
                </a>
              </>
            ) : (
              <>
                <a
                  href="/challans"
                  className="group block p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl hover:from-blue-100 hover:to-blue-200 transition-all duration-300 border border-blue-200"
                >
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">📝</span>
                    <h3 className="font-bold text-blue-900 group-hover:text-blue-700">Issue Challan</h3>
                  </div>
                  <p className="text-sm text-blue-700">Create new traffic violation records</p>
                </a>
                
                <a
                  href="/challans"
                  className="group block p-6 bg-gradient-to-r from-green-50 to-green-100 rounded-xl hover:from-green-100 hover:to-green-200 transition-all duration-300 border border-green-200"
                >
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">📊</span>
                    <h3 className="font-bold text-green-900 group-hover:text-green-700">Manage Challans</h3>
                  </div>
                  <p className="text-sm text-green-700">View and manage issued violations</p>
                </a>
                
                <a
                  href="/profile"
                  className="group block p-6 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl hover:from-purple-100 hover:to-purple-200 transition-all duration-300 border border-purple-200"
                >
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">⚙️</span>
                    <h3 className="font-bold text-purple-900 group-hover:text-purple-700">Settings</h3>
                  </div>
                  <p className="text-sm text-purple-700">Update your profile and preferences</p>
                </a>
              </>
            )}
          </div>
        </div>

        {/* Recent Activity or Tips Section */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="w-6 h-6 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              💡
            </span>
            {user.role === 'citizen' ? 'Traffic Safety Tips' : 'Officer Guidelines'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.role === 'citizen' ? (
              <>
                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 text-xl">🚦</span>
                  <div>
                    <h4 className="font-semibold text-blue-900">Follow Traffic Signals</h4>
                    <p className="text-sm text-blue-700">Always obey traffic lights and road signs to avoid violations.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                  <span className="text-green-600 text-xl">🪖</span>
                  <div>
                    <h4 className="font-semibold text-green-900">Wear Helmet</h4>
                    <p className="text-sm text-green-700">Always wear a helmet while riding two-wheelers for safety.</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 text-xl">📋</span>
                  <div>
                    <h4 className="font-semibold text-blue-900">Fair Enforcement</h4>
                    <p className="text-sm text-blue-700">Ensure fair and consistent application of traffic laws.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg">
                  <span className="text-green-600 text-xl">📧</span>
                  <div>
                    <h4 className="font-semibold text-green-900">Clear Communication</h4>
                    <p className="text-sm text-green-700">Provide clear violation details for better understanding.</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;