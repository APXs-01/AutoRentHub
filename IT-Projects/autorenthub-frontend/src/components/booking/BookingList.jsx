import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import BookingCard from './BookingCard';
import LoadingSpinner from '../common/LoadingSpinner';
import Pagination from '../common/Pagination';
import { bookingService } from '../../services/bookingService';

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    page: 1,
    limit: 9,
    status: 'all'
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, [filters]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getUserBookings(filters);
      setBookings(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = (status) => {
    setFilters({ ...filters, status, page: 1 });
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
  };

  const handleUpdateBooking = (bookingId) => {
    navigate(`/my-bookings/${bookingId}/edit`);
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancelBooking(bookingId);
        toast.success('Booking cancelled successfully');
        fetchBookings();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to cancel booking');
      }
    }
  };

  if (loading && filters.page === 1) {
    return (
      <div className="flex justify-center items-center h-96">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              My Bookings
            </h1>
            <p className="text-gray-600 text-sm">
              Manage and track all your vehicle reservations
            </p>
          </div>
        </div>

        {/* Status Filter Pills */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex flex-wrap gap-2">
            {['all', 'pending', 'confirmed', 'active', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => handleStatusFilter(status)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${
                  filters.status === status
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Grid */}
      {bookings.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {bookings.map((booking) => (
              <BookingCard
                key={booking._id}
                booking={booking}
                onCancel={handleCancelBooking}
                onUpdate={handleUpdateBooking}
              />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="mt-10">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      ) : (
        !loading && (
          <div className="text-center py-20 bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-sm border border-gray-100">
            <div className="max-w-md mx-auto px-4">
              {/* Icon */}
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center">
                <span className="text-5xl">📋</span>
              </div>
              
              {/* Message */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                No Bookings Found
              </h3>
              <p className="text-gray-600 mb-8 text-base">
                You haven't made any bookings yet. Start exploring our amazing vehicles!
              </p>
              
              {/* CTA Button */}
              <button
                onClick={() => navigate('/vehicles')}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3.5 rounded-xl hover:from-blue-700 hover:to-blue-600 font-semibold shadow-lg shadow-blue-500/30 transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5"
              >
                <span>Browse Vehicles</span>
                <span className="text-xl">→</span>
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default BookingList;