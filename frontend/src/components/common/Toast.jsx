import React, { useState, useEffect, createContext, useContext } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

// Toast Context
const ToastContext = createContext();

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      type: 'info',
      duration: 5000,
      ...toast
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-remove toast after duration
    if (newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const removeAllToasts = () => {
    setToasts([]);
  };

  // Convenience methods
  const success = (message, options = {}) => {
    return addToast({ ...options, type: 'success', message });
  };

  const error = (message, options = {}) => {
    return addToast({ ...options, type: 'error', message, duration: 7000 });
  };

  const warning = (message, options = {}) => {
    return addToast({ ...options, type: 'warning', message });
  };

  const info = (message, options = {}) => {
    return addToast({ ...options, type: 'info', message });
  };

  return (
    <ToastContext.Provider value={{
      toasts,
      addToast,
      removeToast,
      removeAllToasts,
      success,
      error,
      warning,
      info
    }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Hook to use toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Individual Toast Component
const Toast = ({ toast, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => onRemove(toast.id), 300); // Match animation duration
  };

  const getToastConfig = () => {
    const configs = {
      success: {
        icon: CheckCircle,
        iconColor: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800'
      },
      error: {
        icon: AlertCircle,
        iconColor: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800'
      },
      warning: {
        icon: AlertTriangle,
        iconColor: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800'
      },
      info: {
        icon: Info,
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800'
      }
    };

    return configs[toast.type] || configs.info;
  };

  const config = getToastConfig();
  const IconComponent = config.icon;

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving 
          ? 'translate-x-0 opacity-100 scale-100' 
          : 'translate-x-full opacity-0 scale-95'
        }
      `}
    >
      <div className={`
        flex items-start space-x-3 p-4 rounded-lg border shadow-lg max-w-md w-full
        ${config.bgColor} ${config.borderColor}
      `}>
        <div className="flex-shrink-0">
          <IconComponent className={`h-5 w-5 ${config.iconColor}`} />
        </div>

        <div className="flex-1 min-w-0">
          {toast.title && (
            <h4 className={`text-sm font-medium ${config.textColor} mb-1`}>
              {toast.title}
            </h4>
          )}
          
          <div className={`text-sm ${config.textColor}`}>
            {typeof toast.message === 'string' ? (
              <p>{toast.message}</p>
            ) : (
              toast.message
            )}
          </div>

          {toast.action && (
            <div className="mt-3">
              <button
                onClick={toast.action.onClick}
                className={`text-sm font-medium underline hover:no-underline ${config.textColor}`}
              >
                {toast.action.label}
              </button>
            </div>
          )}
        </div>

        <div className="flex-shrink-0">
          <button
            onClick={handleClose}
            className={`
              rounded-md p-1.5 inline-flex items-center justify-center
              ${config.textColor} hover:bg-white hover:bg-opacity-20
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-white
            `}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast Container Component
const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
};

// Standalone Toast component for manual usage
const ToastComponent = ({
  type = 'info',
  title = '',
  message = '',
  action = null,
  onClose,
  className = ''
}) => {
  const getToastConfig = () => {
    const configs = {
      success: {
        icon: CheckCircle,
        iconColor: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        textColor: 'text-green-800'
      },
      error: {
        icon: AlertCircle,
        iconColor: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        textColor: 'text-red-800'
      },
      warning: {
        icon: AlertTriangle,
        iconColor: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200',
        textColor: 'text-yellow-800'
      },
      info: {
        icon: Info,
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        textColor: 'text-blue-800'
      }
    };

    return configs[type] || configs.info;
  };

  const config = getToastConfig();
  const IconComponent = config.icon;

  return (
    <div className={`
      flex items-start space-x-3 p-4 rounded-lg border shadow-lg
      ${config.bgColor} ${config.borderColor} ${className}
    `}>
      <div className="flex-shrink-0">
        <IconComponent className={`h-5 w-5 ${config.iconColor}`} />
      </div>

      <div className="flex-1 min-w-0">
        {title && (
          <h4 className={`text-sm font-medium ${config.textColor} mb-1`}>
            {title}
          </h4>
        )}
        
        <div className={`text-sm ${config.textColor}`}>
          {typeof message === 'string' ? (
            <p>{message}</p>
          ) : (
            message
          )}
        </div>

        {action && (
          <div className="mt-3">
            <button
              onClick={action.onClick}
              className={`text-sm font-medium underline hover:no-underline ${config.textColor}`}
            >
              {action.label}
            </button>
          </div>
        )}
      </div>

      {onClose && (
        <div className="flex-shrink-0">
          <button
            onClick={onClose}
            className={`
              rounded-md p-1.5 inline-flex items-center justify-center
              ${config.textColor} hover:bg-white hover:bg-opacity-20
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-white
            `}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ToastComponent;
