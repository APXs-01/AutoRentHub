import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { bookingService } from '../services/bookingService';
import PaymentForm from '../components/payment/PaymentForm';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getBooking(bookingId);
      setBooking(response.data.booking);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch booking details');
      navigate('/my-bookings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading booking details..." />;
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Booking not found</h2>
          <button
            onClick={() => navigate('/my-bookings')}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to My Bookings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <PaymentForm
          booking={booking}
          isOpen={true}
          onClose={() => navigate('/my-bookings')}
        />
      </div>
    </div>
  );
};

export default PaymentPage;