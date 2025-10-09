// src/App.js
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { ToastContainer } from 'react-toastify';

// Context Providers
import { AuthProvider } from './context/AuthContext';
import { VehicleProvider } from './context/VehicleContext';
import { BookingProvider } from './context/BookingContext';

// Import the component that contains the Routes logic
import AppRoutes from './AppRoutes'; 

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function App() {
  return (
    <Elements stripe={stripePromise}>
      <AuthProvider>
        <VehicleProvider>
          <BookingProvider>
            {/* ✅ The Navbar and Footer are GONE from here. AppRoutes now controls the layout. */}
            <AppRoutes /> 
            
            <ToastContainer
              position="top-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              toastClassName="text-sm"
            />
          </BookingProvider>
        </VehicleProvider>
      </AuthProvider>
    </Elements>
  );
}

export default App;