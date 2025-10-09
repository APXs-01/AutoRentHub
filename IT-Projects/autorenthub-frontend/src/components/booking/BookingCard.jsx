import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { complaintService } from '../../services/complaintService';

const BookingCard = ({ booking, onCancel, onUpdate }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-200 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const vehicle = booking.vehicleId || {}; // Fallback for safety
  const [isComplaintOpen, setComplaintOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const openComplaint = () => {
    setSubject(`Issue with booking ${booking.bookingId}`);
    setMessage('');
    setComplaintOpen(true);
  };

  const submitComplaint = async () => {
    if (!subject.trim() || !message.trim()) {
      toast.error('Please provide subject and message');
      return;
    }
    try {
      setSubmitting(true);
      await complaintService.create({ bookingId: booking._id, subject: subject.trim(), message: message.trim() });
      toast.success('Complaint submitted successfully');
      setComplaintOpen(false);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">      
      <img
        src={vehicle.images?.[0]?.url || 'https://via.placeholder.com/400x300'}
        alt={`${vehicle.brand} ${vehicle.model}`}
        className="w-full h-48 object-cover"
      />
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900">{vehicle.brand} {vehicle.model}</h3>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(booking.bookingStatus)}`}>
            {booking.bookingStatus}
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-4">Booking ID: {booking.bookingId}</p>

        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
          <div>
            <p className="font-semibold">Pickup</p>
            <p>{new Date(booking.startDate).toLocaleDateString()}</p>
            <p className="text-xs text-gray-500">{new Date(booking.startDate).toLocaleTimeString()}</p>
          </div>
          <div>
            <p className="font-semibold">Return</p>
            <p>{new Date(booking.endDate).toLocaleDateString()}</p>
            <p className="text-xs text-gray-500">{new Date(booking.endDate).toLocaleTimeString()}</p>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t">
          <p className="text-lg font-bold text-right text-gray-800">${booking.totalAmount.toFixed(2)}</p>
          <div className="mt-4 flex space-x-2">
            
            {/* ✅ START: CONDITIONAL BUTTON LOGIC */}

            {/* If booking is COMPLETED, show Review and Complaint buttons */}
            {booking.bookingStatus === 'completed' ? (
              <div className="w-full flex gap-2">
                <Link
                  to={`/vehicles/${vehicle._id}`}
                  className="flex-1 text-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
                >
                  Write a Review
                </Link>
                <button
                  onClick={openComplaint}
                  className="flex-1 text-center bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors text-sm font-medium"
                >
                  Write a Complaint
                </button>
              </div>
            ) : (
              // For all other statuses, show the original buttons
              <>
                <Link
                  to={`/my-bookings/${booking._id}`}
                  className="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  View Details
                </Link>
                
                {['pending', 'confirmed'].includes(booking.bookingStatus) && (
                  <>
                    <button
                      onClick={() => onUpdate(booking._id)}
                      className="flex-1 text-center bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors text-sm font-medium"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => onCancel(booking._id)}
                      className="flex-1 text-center bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </>
            )}
            {/* ✅ END: CONDITIONAL BUTTON LOGIC */}

            
          </div>
        </div>
      </div>
    </div>
    {/* Complaint Modal */}
    {isComplaintOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="bg-white w-full max-w-lg rounded-lg shadow-xl">
          <div className="p-4 border-b">
            <h4 className="text-lg font-semibold">Write a Complaint</h4>
            <p className="text-xs text-gray-500">Booking ID: {booking.bookingId}</p>
          </div>
          <div className="p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
                maxLength={200}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full border rounded-md px-3 py-2 text-sm"
                maxLength={2000}
              />
              <p className="text-xs text-gray-500 mt-1">Max 2000 characters</p>
            </div>
          </div>
          <div className="p-4 border-t flex justify-end gap-2">
            <button
              onClick={() => setComplaintOpen(false)}
              className="px-4 py-2 text-sm rounded-md border"
              disabled={submitting}
            >
              Close
            </button>
            <button
              onClick={submitComplaint}
              className="px-4 py-2 text-sm rounded-md bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Complaint'}
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default BookingCard;