import React from 'react';

const LoadingSpinner = ({ size = 'md', color = 'blue', className = '' }) => {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colors = {
    blue: 'border-blue-600',
    gray: 'border-gray-600',
    green: 'border-green-600',
    red: 'border-red-600',
    yellow: 'border-yellow-600'
  };

  return (
    <div className={`inline-block ${className}`}>
      <div
        className={`animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${sizes[size]} ${colors[color]}`}
        role="status"
        aria-label="Loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;