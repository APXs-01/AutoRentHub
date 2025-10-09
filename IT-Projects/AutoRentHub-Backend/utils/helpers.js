// utils/helpers.js
const crypto = require('crypto');

// Generate random string
const generateRandomString = (length = 10) => {
  return crypto.randomBytes(length).toString('hex');
};

// Format currency
const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Format date
const formatDate = (date, locale = 'en-US') => {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Calculate age from date of birth
const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Paginate results
const paginate = async (model, query = {}, options = {}) => {
  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 10;
  const skip = (page - 1) * limit;
  
  const results = await model
    .find(query)
    .populate(options.populate || '')
    .sort(options.sort || { createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select(options.select || '');
    
  const total = await model.countDocuments(query);
  const totalPages = Math.ceil(total / limit);
  
  return {
    data: results,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};

// Clean up file path
const cleanFilePath = (filePath) => {
  return filePath.replace(/\\/g, '/');
};

// Generate booking reference
const generateBookingReference = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `BK-${timestamp}-${random}`.toUpperCase();
};

module.exports = {
  generateRandomString,
  formatCurrency,
  formatDate,
  calculateAge,
  paginate,
  cleanFilePath,
  generateBookingReference
};