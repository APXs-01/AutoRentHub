import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import NotFound from './NotFound';

const BookingDetailPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await bookingService.getBookingById(bookingId);
        if (response.success) {
          setBooking(response.data.booking);
        } else {
          setError('Booking not found');
        }
      } catch (err) {
        setError('Failed to fetch booking details.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [bookingId]);

  if (loading) return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  if (error || !booking) return <NotFound message={error || "Booking not found"} />;

  const vehicle = booking.vehicleId || {};

  return (
    <div className="container mx-auto p-8">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Booking Details</h1>
          <span className="bg-blue-100 text-blue-800 font-semibold px-4 py-2 rounded-full capitalize">
            {booking.bookingStatus}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Vehicle Info */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Vehicle Information</h2>
            <img 
              src={vehicle.images?.[0]?.url || 'https://via.placeholder.com/400x300'} 
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="rounded-lg mb-4 w-full object-cover"
            />
            <p className="text-2xl font-bold">{vehicle.brand} {vehicle.model}</p>
            <p className="text-gray-600">{vehicle.year} &middot; {vehicle.plateNumber}</p>
          </div>

          {/* Booking Info */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Rental Information</h2>
            <div className="space-y-3 text-gray-800">
              <p><strong>Booking ID:</strong> {booking.bookingId}</p>
              <p><strong>Pickup:</strong> {new Date(booking.startDate).toLocaleString()}</p>
              <p><strong>Return:</strong> {new Date(booking.endDate).toLocaleString()}</p>
              <p><strong>Rental Type:</strong> <span className="capitalize">{booking.rentalType}</span></p>
              <p className="text-2xl font-bold mt-4"><strong>Total Amount:</strong> ${booking.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="text-center mt-8 pt-6 border-t">
            {/* ✅ "Book Now" button is replaced with this Link */}
            <Link to="/my-bookings" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors">
                Back to My Bookings
            </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;