import React from "react";
import LoadingSpinner from './LoadingSpinner';

const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  loading = false, 
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = "", 
  ...props 
}) => {
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 border-transparent",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500 border-gray-300",
    outline: "bg-transparent text-blue-600 hover:bg-blue-50 focus:ring-blue-500 border-blue-600",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 border-transparent",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 border-transparent",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500 border-transparent"
  };

  const sizes = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
    xl: "px-8 py-4 text-lg"
  };

  const isDisabled = loading || disabled;

  return (
    <button
      className={`
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''}
        inline-flex items-center justify-center
        border rounded-md font-medium
        focus:outline-none focus:ring-2 focus:ring-offset-2
        transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${!isDisabled ? 'transform hover:scale-105 active:scale-95' : ''}
        ${className}
      `}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <LoadingSpinner size="sm" color={variant === 'primary' || variant === 'danger' || variant === 'success' ? 'white' : 'gray'} />
      )}
      
      {!loading && leftIcon && (
        <span className="mr-2">{leftIcon}</span>
      )}
      
      {!loading && children}
      
      {!loading && rightIcon && (
        <span className="ml-2">{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;
