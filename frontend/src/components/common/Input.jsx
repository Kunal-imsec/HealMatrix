import React, { useState, forwardRef } from 'react';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

const Input = forwardRef(({ 
  label, 
  error, 
  success,
  helperText,
  type = 'text',
  leftIcon,
  rightIcon,
  showPasswordToggle = false,
  required = false,
  className = '',
  labelClassName = '',
  inputClassName = '',
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const getInputClasses = () => {
    let classes = `
      w-full rounded-md border px-3 py-2 transition-colors duration-200
      focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed
      ${leftIcon ? 'pl-10' : ''}
      ${rightIcon || (type === 'password' && showPasswordToggle) ? 'pr-10' : ''}
    `;

    if (error) {
      classes += ' border-red-500 focus:ring-red-500 focus:border-red-500';
    } else if (success) {
      classes += ' border-green-500 focus:ring-green-500 focus:border-green-500';
    } else {
      classes += ' border-gray-300 focus:ring-blue-500 focus:border-blue-500';
    }

    if (focused) {
      classes += ' ring-2';
    }

    return `${classes} ${inputClassName}`;
  };

  return (
    <div className={`my-3 ${className}`}>
      {label && (
        <label className={`block mb-2 text-sm font-medium text-gray-700 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {leftIcon}
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          type={inputType}
          className={getInputClasses()}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />

        {/* Right Icon or Password Toggle */}
        {(rightIcon || (type === 'password' && showPasswordToggle)) && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {type === 'password' && showPasswordToggle ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            ) : rightIcon ? (
              <div className="pointer-events-none">
                {rightIcon}
              </div>
            ) : null}
          </div>
        )}

        {/* Status Icons */}
        {error && !rightIcon && !(type === 'password' && showPasswordToggle) && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
        )}

        {success && !rightIcon && !(type === 'password' && showPasswordToggle) && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <Check className="h-4 w-4 text-green-500" />
          </div>
        )}
      </div>

      {/* Helper Text, Success Message, or Error Message */}
      {helperText && !error && !success && (
        <p className="text-gray-500 text-xs mt-1">{helperText}</p>
      )}
      
      {success && (
        <p className="text-green-600 text-xs mt-1 flex items-center">
          <Check className="h-3 w-3 mr-1" />
          {typeof success === 'string' ? success : 'Valid input'}
        </p>
      )}
      
      {error && (
        <p className="text-red-600 text-xs mt-1 flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
