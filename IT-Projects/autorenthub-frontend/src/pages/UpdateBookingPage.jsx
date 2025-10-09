import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/common/LoadingSpinner';
import NotFound from './NotFound';

const UpdateBookingPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
  });

  // ✅ 1. ADD STATE TO HOLD THE CALCULATED TOTAL AMOUNT
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await bookingService.getBookingById(bookingId);
        if (response.success) {
          const bookingData = response.data.booking;
          setBooking(bookingData);
          setFormData({
            startDate: new Date(bookingData.startDate).toISOString().slice(0, 16),
            endDate: new Date(bookingData.endDate).toISOString().slice(0, 16),
          });
          setTotalAmount(bookingData.totalAmount); // Set initial amount
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

  // ✅ 2. ADD USEEFFECT TO RECALCULATE PRICE ON DATE CHANGE
  useEffect(() => {
    if (booking && formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      let total = 0;
      
      if (end > start) {
        const vehicle = booking.vehicleId;
        const rentalType = booking.rentalType;
        
        if (rentalType === 'daily') {
          const diffTime = Math.abs(end - start);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          total = diffDays * vehicle.pricePerDay;
        } else { // hourly
          const diffTime = Math.abs(end - start);
          const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
          total = diffHours * vehicle.pricePerHour;
        }
      }
      setTotalAmount(total);
    }
  }, [formData.startDate, formData.endDate, booking]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (new Date(formData.endDate) <= new Date(formData.startDate)) {
      toast.error('End date must be after the start date.');
      return;
    }

    setIsUpdating(true);
    try {
      // Send the new dates and the recalculated total amount
      const response = await bookingService.updateBooking(bookingId, {
        ...formData,
        totalAmount: totalAmount 
      });

      if (response.success) {
        toast.success('Booking updated successfully!');
        navigate(`/my-bookings/${bookingId}`);
      } else {
        toast.error(response.message || 'Failed to update booking.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><LoadingSpinner /></div>;
  if (error) return <NotFound message={error} />;

  return (
    <div className="container mx-auto p-8">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Update Your Booking</h1>
        <p className="mb-6 text-gray-600">
          Adjust the dates for your booking of the <strong>{booking.vehicleId.brand} {booking.vehicleId.model}</strong>.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Date & Time</label>
            <input
              type="datetime-local"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Date & Time</label>
            <input
              type="datetime-local"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>

          {/* ✅ 3. DISPLAY THE DYNAMIC TOTAL AMOUNT */}
          <div className="pt-4 border-t">
            <div className="text-xl font-bold flex justify-between text-gray-800">
              <span>New Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <button 
              type="button" 
              onClick={() => navigate(-1)}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              disabled={isUpdating}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateBookingPage;