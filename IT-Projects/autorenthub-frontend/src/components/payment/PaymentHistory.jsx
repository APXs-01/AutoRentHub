import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import paymentService from '../../services/paymentService';
import LoadingSpinner from '../common/LoadingSpinner';
import Pagination from '../common/Pagination';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchPaymentHistory();
  }, [currentPage]);

  const fetchPaymentHistory = async () => {
    try {
      setLoading(true);
      const response = await paymentService.getPaymentHistory(currentPage, 10);
      setPayments(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch payment history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingSpinner message="Loading payment history..." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Payment History</h2>
        <div className="text-sm text-gray-500">
          Total: {pagination.total} payments
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
          <p className="mt-1 text-sm text-gray-500">Your payment history will appear here.</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <li key={payment._id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        Payment #{payment.paymentId}
                      </p>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.paymentStatus)}`}>
                        {payment.paymentStatus}
                      </span>
                    </div>
                    
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Amount</p>
                        <p className="text-sm font-medium text-gray-900">${payment.amount}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Booking</p>
                        <p className="text-sm font-medium text-gray-900">
                          {payment.bookingId?.bookingId || 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Vehicle</p>
                        <p className="text-sm font-medium text-gray-900">
                          {payment.bookingId?.vehicleId?.brand} {payment.bookingId?.vehicleId?.model}
                        </p>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500">
                          {formatDate(payment.paymentDate)}
                        </span>
                        <span className="text-sm text-gray-500">
                          via {payment.paymentMethod}
                        </span>
                      </div>
                      
                      {payment.paymentStatus === 'completed' && (
                        <div className="flex items-center text-sm text-green-600">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          Email sent
                        </div>
                      )}
                    </div>

                    {payment.refundAmount > 0 && (
                      <div className="mt-2 p-2 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-700">
                          Refunded: ${payment.refundAmount}
                          {payment.refundReason && ` - ${payment.refundReason}`}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
};

export default PaymentHistory;