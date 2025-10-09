import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StripePayment from './StripePayment';
import Modal from '../common/Modal';

const PaymentForm = ({ booking, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [paymentResult, setPaymentResult] = useState(null);

  const handlePaymentSuccess = (result) => {
    setPaymentStatus('success');
    setPaymentResult(result);
  };

  const handlePaymentError = (error) => {
    setPaymentStatus('error');
    setPaymentResult({ error });
  };

  const handleClose = () => {
    if (paymentStatus === 'success') {
      navigate('/my-bookings');
    }
    onClose();
    setPaymentStatus('pending');
    setPaymentResult(null);
  };

  const renderPaymentContent = () => {
    switch (paymentStatus) {
      case 'success':
        return (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-green-600">Payment Successful!</h3>
            <div className="bg-green-50 p-4 rounded-lg text-left">
              <p className="text-sm text-green-700 mb-2">
                <strong>Payment ID:</strong> {paymentResult?.paymentDetails?.paymentId}
              </p>
              <p className="text-sm text-green-700 mb-2">
                <strong>Amount Paid:</strong> ${paymentResult?.paymentDetails?.amount}
              </p>
              <p className="text-sm text-green-700">
                <strong>Confirmation email sent to:</strong> {booking.userId?.email}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
            >
              View My Bookings
            </button>
          </div>
        );

      case 'error':
        return (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-red-600">Payment Failed</h3>
            <p className="text-red-600">{paymentResult?.error?.message}</p>
            <button
              onClick={() => setPaymentStatus('pending')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Complete Payment</h2>
              <p className="text-gray-600 mt-2">Secure payment processing</p>
            </div>
            <StripePayment
              booking={booking}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </div>
        );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <div className="p-6">
        {renderPaymentContent()}
      </div>
    </Modal>
  );
};

export default PaymentForm;