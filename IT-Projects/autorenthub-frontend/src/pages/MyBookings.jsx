import React from 'react';
import BookingList from '../components/booking/BookingList';

const MyBookings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-indigo-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-8">
        <BookingList />
      </div>
    </div>
  );
};

export default MyBookings;