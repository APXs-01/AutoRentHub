import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { toast } from 'react-toastify';
import paymentService from '../../services/paymentService';
import LoadingSpinner from '../common/LoadingSpinner';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = ({ booking, onPaymentSuccess, onPaymentError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    if (booking) {
      createPaymentIntent();
    }
  }, [booking]);

  const createPaymentIntent = async () => {
    try {
      setLoading(true);
      const response = await paymentService.createPaymentIntent(
        booking._id, 
        booking.totalAmount
      );
      setClientSecret(response.data.clientSecret);
    } catch (error) {
      toast.error(error.message || 'Failed to initialize payment');
      onPaymentError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setLoading(true);

    const cardElement = elements.getElement(CardElement);

    try {
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: booking.userId?.name || 'Customer',
            email: booking.userId?.email || '',
          },
        },
      });

      if (error) {
        toast.error(error.message);
        onPaymentError(error);
      } else if (paymentIntent.status === 'succeeded') {
        // Confirm payment with backend (this triggers email)
        const confirmResponse = await paymentService.confirmPayment(paymentIntent.id);
        
        toast.success('Payment successful! Confirmation email sent.');
        onPaymentSuccess({
          paymentIntent,
          booking,
          paymentDetails: confirmResponse.data.payment
        });
      }
    } catch (error) {
      toast.error(error.message || 'Payment failed');
      onPaymentError(error);
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  if (loading && !clientSecret) {
    return <LoadingSpinner message="Initializing payment..." />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Payment Details</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="font-medium">Booking ID:</span> {booking.bookingId}
          </div>
          <div>
            <span className="font-medium">Amount:</span> ${booking.totalAmount}
          </div>
          <div>
            <span className="font-medium">Vehicle:</span> {booking.vehicleId?.brand} {booking.vehicleId?.model}
          </div>
          <div>
            <span className="font-medium">Duration:</span> {booking.rentalType}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Card Information
        </label>
        <div className="border border-gray-300 rounded-md p-3 bg-white">
          <CardElement options={cardElementOptions} />
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <p className="text-sm text-blue-700">
            Your payment is secured by Stripe. A confirmation email will be sent after successful payment.
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-3 px-4 rounded-md font-medium ${
          loading || !stripe
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white transition-colors`}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <LoadingSpinner size="small" />
            Processing Payment...
          </span>
        ) : (
          `Pay $${booking.totalAmount}`
        )}
      </button>
    </form>
  );
};

const StripePayment = ({ booking, onPaymentSuccess, onPaymentError }) => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        booking={booking}
        onPaymentSuccess={onPaymentSuccess}
        onPaymentError={onPaymentError}
      />
    </Elements>
  );
};

export default StripePayment;