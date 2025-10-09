export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  VEHICLES: '/vehicles',
  VEHICLE_DETAIL: '/vehicles/:id',
  BOOKING: '/booking/:vehicleId',
  MY_BOOKINGS: '/my-bookings',
  BOOKING_DETAIL: '/booking-detail/:id',
  PAYMENT: '/payment/:bookingId',
  PAYMENT_SUCCESS: '/payment/success',
  PAYMENT_FAILED: '/payment/failed',
  PAYMENT_HISTORY: '/payment-history',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  ADMIN: '/admin',
  ADMIN_USERS: '/admin/users',
  ADMIN_VEHICLES: '/admin/vehicles',
  ADMIN_BOOKINGS: '/admin/bookings',
  ADMIN_REPORTS: '/admin/reports'
};

// Vehicle Constants
export const VEHICLE_TYPES = {
  CAR: 'car',
  BIKE: 'bike',
  SCOOTER: 'scooter'
};

export const VEHICLE_TYPE_OPTIONS = [
  { value: 'all', label: 'All Types' },
  { value: 'car', label: 'Cars' },
  { value: 'bike', label: 'Bikes' },
  { value: 'scooter', label: 'Scooters' }
];

export const FUEL_TYPES = {
  PETROL: 'petrol',
  DIESEL: 'diesel',
  ELECTRIC: 'electric',
  HYBRID: 'hybrid'
};

export const FUEL_TYPE_OPTIONS = [
  { value: 'all', label: 'All Fuel Types' },
  { value: 'petrol', label: 'Petrol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'electric', label: 'Electric' },
  { value: 'hybrid', label: 'Hybrid' }
];

export const TRANSMISSION_TYPES = {
  MANUAL: 'manual',
  AUTOMATIC: 'automatic'
};

export const TRANSMISSION_OPTIONS = [
  { value: 'all', label: 'All Transmissions' },
  { value: 'manual', label: 'Manual' },
  { value: 'automatic', label: 'Automatic' }
];

// Vehicle Status
export const VEHICLE_STATUS = {
  AVAILABLE: 'available',
  BOOKED: 'booked',
  MAINTENANCE: 'maintenance',
  OUT_OF_SERVICE: 'out_of_service'
};

export const VEHICLE_STATUS_OPTIONS = [
  { value: 'available', label: 'Available', color: 'green' },
  { value: 'booked', label: 'Booked', color: 'blue' },
  { value: 'maintenance', label: 'Maintenance', color: 'yellow' },
  { value: 'out_of_service', label: 'Out of Service', color: 'red' }
];

// Booking Constants
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

export const BOOKING_STATUS_OPTIONS = [
  { value: 'all', label: 'All Bookings' },
  { value: 'pending', label: 'Pending', color: 'orange' },
  { value: 'confirmed', label: 'Confirmed', color: 'blue' },
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'completed', label: 'Completed', color: 'gray' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' }
];

export const RENTAL_TYPES = {
  HOURLY: 'hourly',
  DAILY: 'daily'
};

export const RENTAL_TYPE_OPTIONS = [
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' }
];

// Payment Constants
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
  CANCELLED: 'cancelled'
};

export const PAYMENT_METHODS = {
  STRIPE: 'stripe',
  CASH: 'cash',
  BANK_TRANSFER: 'bank_transfer',
  PAYPAL: 'paypal'
};

// User Types
export const USER_TYPES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
  STAFF: 'staff'
};

// Sort Options
export const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Newest First' },
  { value: 'pricePerDay', label: 'Price: Low to High' },
  { value: '-pricePerDay', label: 'Price: High to Low' },
  { value: 'rating.average', label: 'Highest Rated' },
  { value: 'model', label: 'Model A-Z' }
];

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 12,
  BOOKING_LIMIT: 10,
  REVIEW_LIMIT: 10
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'autorenthub_token',
  USER_DATA: 'autorenthub_user',
  SEARCH_FILTERS: 'autorenthub_search_filters',
  BOOKING_DRAFT: 'autorenthub_booking_draft'
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  DISPLAY_WITH_TIME: 'MMM dd, yyyy HH:mm',
  ISO: 'yyyy-MM-dd',
  INPUT: 'yyyy-MM-ddTHH:mm'
};

// File Upload
export const FILE_CONSTRAINTS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_FILES: 5,
  ACCEPTED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
};

// Feature Flags
export const FEATURES = {
  PAYMENT_ENABLED: true,
  REVIEWS_ENABLED: true,
  REAL_TIME_NOTIFICATIONS: false,
  GOOGLE_MAPS: false
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Please log in to continue.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Successfully logged in!',
  REGISTER: 'Account created successfully!',
  LOGOUT: 'Successfully logged out!',
  PROFILE_UPDATED: 'Profile updated successfully!',
  BOOKING_CREATED: 'Booking created successfully!',
  BOOKING_UPDATED: 'Booking updated successfully!',
  BOOKING_CANCELLED: 'Booking cancelled successfully!',
  PAYMENT_SUCCESS: 'Payment completed successfully!',
  REVIEW_SUBMITTED: 'Review submitted successfully!'
};