// frontend/src/pages/PaymentHistory.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PaymentHistory = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const response = await axios.get(
        'http://16.176.131.224/api/payments/history',
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );
      setPayments(response.data);
    } catch (error) {
      console.error('Failed to fetch payment history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Loading payment history...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Payment History</h1>

      {payments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No payment history found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {payments.map((payment, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Transaction #{payment.transactionId}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Challan: {payment.challan.challanNumber}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  {payment.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Vehicle Number</p>
                  <p className="font-medium">{payment.challan.vehicleNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Violation Type</p>
                  <p className="font-medium">{payment.challan.violationType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount Paid</p>
                  <p className="font-medium text-green-600">₹{payment.amount}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-gray-600">
                  Paid on {formatDate(payment.paymentDate)}
                </p>
              </div>
            </div>
          ))}

          <div className="bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Payment Summary
            </h3>
            <p className="text-blue-700">
              Total Payments: {payments.length}
            </p>
            <p className="text-blue-700">
              Total Amount: ₹{payments.reduce((sum, payment) => sum + payment.amount, 0)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
