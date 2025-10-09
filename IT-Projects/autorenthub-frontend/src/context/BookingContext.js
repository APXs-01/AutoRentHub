import React, { createContext, useContext, useReducer } from 'react';

const BookingContext = createContext();

const initialState = {
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,
  filters: {
    status: 'all',
    page: 1,
    limit: 10
  }
};

const bookingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_BOOKINGS':
      return { ...state, bookings: action.payload, loading: false, error: null };
    case 'SET_CURRENT_BOOKING':
      return { ...state, currentBooking: action.payload };
    case 'ADD_BOOKING':
      return { ...state, bookings: [action.payload, ...state.bookings] };
    case 'UPDATE_BOOKING':
      return {
        ...state,
        bookings: state.bookings.map(booking =>
          booking._id === action.payload._id ? action.payload : booking
        ),
        currentBooking: state.currentBooking?._id === action.payload._id ? action.payload : state.currentBooking
      };
    case 'DELETE_BOOKING':
      return {
        ...state,
        bookings: state.bookings.filter(booking => booking._id !== action.payload)
      };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
};

export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const setBookings = (bookings) => {
    dispatch({ type: 'SET_BOOKINGS', payload: bookings });
  };

  const setCurrentBooking = (booking) => {
    dispatch({ type: 'SET_CURRENT_BOOKING', payload: booking });
  };

  const addBooking = (booking) => {
    dispatch({ type: 'ADD_BOOKING', payload: booking });
  };

  const updateBooking = (booking) => {
    dispatch({ type: 'UPDATE_BOOKING', payload: booking });
  };

  const deleteBooking = (bookingId) => {
    dispatch({ type: 'DELETE_BOOKING', payload: bookingId });
  };

  const setFilters = (filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value = {
    ...state,
    setLoading,
    setError,
    setBookings,
    setCurrentBooking,
    addBooking,
    updateBooking,
    deleteBooking,
    setFilters,
    clearError
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};