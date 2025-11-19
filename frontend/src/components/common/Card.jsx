import React from 'react';


const Card = ({ 
  children, 
  title, 
  subtitle,
  className = '',
  padding = 'p-6',
  shadow = 'shadow-sm',  // ✅ Changed from 'card-shadow' to 'shadow-sm'
  ...props 
}) => {
  return (
    <div className={`bg-white rounded-lg border border-gray-200 ${shadow} ${padding} ${className}`} {...props}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};


export default Card;
