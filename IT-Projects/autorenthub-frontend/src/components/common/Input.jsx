import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  helper,
  type = 'text',
  placeholder,
  required = false,
  disabled = false,
  fullWidth = true,
  size = 'md',
  variant = 'default',
  startIcon,
  endIcon,
  className = '',
  labelClassName = '',
  ...props
}, ref) => {
  const baseInputClasses = 'border rounded-md focus:outline-none focus:ring-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    error: 'border-red-500 focus:border-red-500 focus:ring-red-500',
    success: 'border-green-500 focus:border-green-500 focus:ring-green-500'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const widthClass = fullWidth ? 'w-full' : '';
  const inputVariant = error ? 'error' : variant;
  
  const inputClasses = `${baseInputClasses} ${variants[inputVariant]} ${sizes[size]} ${widthClass} ${className}`;

  const inputElement = (
    <div className="relative">
      {startIcon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {startIcon}
        </div>
      )}
      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`${inputClasses} ${startIcon ? 'pl-10' : ''} ${endIcon ? 'pr-10' : ''}`}
        {...props}
      />
      {endIcon && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {endIcon}
        </div>
      )}
    </div>
  );

  if (label) {
    return (
      <div className={fullWidth ? 'w-full' : ''}>
        <label className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {inputElement}
        {helper && !error && (
          <p className="mt-1 text-sm text-gray-500">{helper}</p>
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }

  return inputElement;
});

Input.displayName = 'Input';

export default Input;