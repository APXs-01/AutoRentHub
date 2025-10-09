import React from 'react';

const Alert = ({ 
  type = 'info', 
  message, 
  onClose, 
  dismissible = false, 
  className = '' 
}) => {
  const baseClasses = 'p-4 rounded-md border-l-4 mb-4';
  
  const typeClasses = {
    success: 'bg-green-50 border-green-400 text-green-800',
    error: 'bg-red-50 border-red-400 text-red-800',
    warning: 'bg-yellow-50 border-yellow-400 text-yellow-800',
    info: 'bg-blue-50 border-blue-400 text-blue-800'
  };

  const iconClasses = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  return (
    <div className={`${baseClasses} ${typeClasses[type]} ${className}`} role="alert">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <span className="mr-2 font-bold">{iconClasses[type]}</span>
          <span>{message}</span>
        </div>
        {dismissible && onClose && (
          <button
            onClick={onClose}
            className="ml-4 text-lg hover:opacity-70 focus:outline-none"
            aria-label="Close"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default Alert;