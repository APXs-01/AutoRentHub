export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone Number Validation
export const isValidPhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
};

// Password Validation
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Name Validation
export const isValidName = (name) => {
  if (!name || name.trim().length < 2) {
    return false;
  }
  
  // Allow letters, spaces, hyphens, apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  return nameRegex.test(name.trim());
};

// Date Validation
export const isValidDate = (date) => {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

export const isFutureDate = (date) => {
  const dateObj = new Date(date);
  const now = new Date();
  return dateObj > now;
};

export const isDateInRange = (date, startDate, endDate) => {
  const dateObj = new Date(date);
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return dateObj >= start && dateObj <= end;
};

// Booking Validation
export const validateBookingDates = (startDate, endDate) => {
  const errors = [];
  
  if (!startDate) {
    errors.push('Start date is required');
  }
  
  if (!endDate) {
    errors.push('End date is required');
  }
  
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    
    if (start <= now) {
      errors.push('Start date must be in the future');
    }
    
    if (end <= start) {
      errors.push('End date must be after start date');
    }
    
    // Check if booking is too far in advance (e.g., 1 year)
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    
    if (start > oneYearFromNow) {
      errors.push('Booking cannot be more than 1 year in advance');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Vehicle Validation
export const validateVehicleData = (vehicleData) => {
  const errors = [];
  
  if (!vehicleData.model || vehicleData.model.trim().length < 2) {
    errors.push('Vehicle model is required and must be at least 2 characters');
  }
  
  if (!vehicleData.brand || vehicleData.brand.trim().length < 2) {
    errors.push('Brand is required and must be at least 2 characters');
  }
  
  if (!vehicleData.year || vehicleData.year < 1990 || vehicleData.year > new Date().getFullYear() + 1) {
    errors.push('Please provide a valid year');
  }
  
  if (!vehicleData.vehicleType || !['car', 'bike', 'scooter'].includes(vehicleData.vehicleType)) {
    errors.push('Vehicle type must be car, bike, or scooter');
  }
  
  if (!vehicleData.fuelType || !['petrol', 'diesel', 'electric', 'hybrid'].includes(vehicleData.fuelType)) {
    errors.push('Please select a valid fuel type');
  }
  
  if (!vehicleData.transmission || !['manual', 'automatic'].includes(vehicleData.transmission)) {
    errors.push('Please select a valid transmission type');
  }
  
  if (!vehicleData.pricePerDay || vehicleData.pricePerDay <= 0) {
    errors.push('Price per day must be greater than 0');
  }
  
  if (!vehicleData.pricePerHour || vehicleData.pricePerHour <= 0) {
    errors.push('Price per hour must be greater than 0');
  }
  
  if (!vehicleData.plateNumber || vehicleData.plateNumber.trim().length < 3) {
    errors.push('Plate number is required and must be at least 3 characters');
  }
  
  if (vehicleData.vehicleType === 'car' && (!vehicleData.seatingCapacity || vehicleData.seatingCapacity < 1 || vehicleData.seatingCapacity > 50)) {
    errors.push('Seating capacity must be between 1 and 50 for cars');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// File Validation
export const validateFile = (file, maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']) => {
  const errors = [];
  
  if (!file) {
    errors.push('File is required');
    return { isValid: false, errors };
  }
  
  if (file.size > maxSize) {
    errors.push(`File size must be less than ${Math.round(maxSize / (1024 * 1024))}MB`);
  }
  
  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type must be one of: ${allowedTypes.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Credit Card Validation (basic)
export const validateCreditCard = (cardNumber) => {
  // Remove spaces and hyphens
  const cleanNumber = cardNumber.replace(/[\s\-]/g, '');
  
  // Check if it's all digits
  if (!/^\d+$/.test(cleanNumber)) {
    return false;
  }
  
  // Check length (13-19 digits for most cards)
  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return false;
  }
  
  // Luhn algorithm
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i));
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

// Form Validation Helper
export const validateForm = (data, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = data[field];
    
    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors[field] = rule.requiredMessage || `${field} is required`;
      return;
    }
    
    // Skip other validations if field is empty and not required
    if (!value) return;
    
    // Min length validation
    if (rule.minLength && value.length < rule.minLength) {
      errors[field] = rule.minLengthMessage || `${field} must be at least ${rule.minLength} characters`;
      return;
    }
    
    // Max length validation
    if (rule.maxLength && value.length > rule.maxLength) {
      errors[field] = rule.maxLengthMessage || `${field} must be no more than ${rule.maxLength} characters`;
      return;
    }
    
    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.patternMessage || `${field} format is invalid`;
      return;
    }
    
    // Custom validation
    if (rule.custom) {
      const customResult = rule.custom(value, data);
      if (customResult !== true) {
        errors[field] = customResult;
        return;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// URL Validation
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Rating Validation
export const isValidRating = (rating) => {
  const numRating = Number(rating);
  return !isNaN(numRating) && numRating >= 1 && numRating <= 5;
};

// Location Validation
export const validateLocation = (location) => {
  const errors = [];
  
  if (!location || location.trim().length < 5) {
    errors.push('Location must be at least 5 characters long');
  }
  
  if (location && location.length > 100) {
    errors.push('Location must be no more than 100 characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Price Validation
export const validatePrice = (price, min = 0.01, max = 10000) => {
  const errors = [];
  const numPrice = Number(price);
  
  if (isNaN(numPrice)) {
    errors.push('Price must be a valid number');
  } else {
    if (numPrice < min) {
      errors.push(`Price must be at least ${min}`);
    }
    
    if (numPrice > max) {
      errors.push(`Price must be no more than ${max}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Review Validation
export const validateReview = (reviewData) => {
  const errors = [];
  
  if (!reviewData.rating || !isValidRating(reviewData.rating)) {
    errors.push('Rating must be between 1 and 5');
  }
  
  if (!reviewData.comment || reviewData.comment.trim().length < 10) {
    errors.push('Comment must be at least 10 characters long');
  }
  
  if (reviewData.comment && reviewData.comment.length > 500) {
    errors.push('Comment must be no more than 500 characters');
  }
  
  // Validate category ratings if provided
  if (reviewData.categories) {
    const categoryFields = ['cleanliness', 'comfort', 'performance', 'value'];
    categoryFields.forEach(field => {
      if (reviewData.categories[field] && !isValidRating(reviewData.categories[field])) {
        errors.push(`${field} rating must be between 1 and 5`);
      }
    });
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};