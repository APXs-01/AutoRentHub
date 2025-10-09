import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { XCircleIcon } from '@heroicons/react/24/outline';

const PaymentFailed = () => {
  const [searchParams] = useSearchParams();
  const error = searchParams.get('error');
  const bookingId = searchParams.get('booking_id');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <XCircleIcon className="mx-auto h-16 w-16 text-red-600" />
            <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
              Payment Failed
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              We couldn't process your payment. Please try again.
            </p>
            {error && (
              <p className="mt-1 text-sm text-red-600">
                Error: {error}
              </p>
            )}
          </div>

          <div className="mt-8">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="text-sm text-red-800">
                <p className="font-medium">Common reasons for payment failure:</p>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li>Insufficient funds</li>
                  <li>Incorrect card information</li>
                  <li>Card declined by bank</li>
                  <li>Network connection issues</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col space-y-3">
            {bookingId && (
              <Link
                to={`/payment/${bookingId}`}
                className="w-full bg-blue-600 border border-transparent rounded-md py-2 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center"
              >
                Try Payment Again
              </Link>
            )}
            <Link
              to="/my-bookings"
              className="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 text-center"
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

export default PaymentFailed;