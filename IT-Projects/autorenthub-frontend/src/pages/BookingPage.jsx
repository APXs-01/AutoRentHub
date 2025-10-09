import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BookingForm from '../components/booking/BookingForm';

const BookingPage = () => {
  const { vehicleId } = useParams();
  const navigate = useNavigate();

  const handleBookingSuccess = (booking) => {
    // Navigate to payment page
    navigate(`/payment/${booking._id}`);
  };

  const handleCancel = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <BookingForm
          vehicleId={vehicleId}
          onBookingSuccess={handleBookingSuccess}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default BookingPage;