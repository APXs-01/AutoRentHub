import React, { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const paymentIntentId = searchParams.get('payment_intent');
  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    // You can add analytics or confirmation logic here
    console.log('Payment successful:', { paymentIntentId, bookingId });
  }, [paymentIntentId, bookingId]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <CheckCircleIcon className="mx-auto h-16 w-16 text-green-600" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Payment Successful!
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Your booking has been confirmed and payment processed successfully.
            </p>
          </div>

          <div className="mt-8">
            <div className="bg-green-50 border border-green-200 rounded-md p-4">
              <div className="text-sm text-green-800">
                <p className="font-medium">What happens next?</p>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li>You'll receive a confirmation email shortly</li>
                  <li>Check your booking details in "My Bookings"</li>
                  <li>Arrive 15 minutes early for pickup</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col space-y-3">
            <Link
              to="/my-bookings"
              className="w-full bg-blue-600 border border-transparent rounded-md py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center"
            >
              View My Bookings
            </Link>
            <Link
              to="/"
              className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;