import { ERROR_MESSAGES } from './constants';

// Error types
export const ERROR_TYPES = {
  NETWORK: 'NETWORK_ERROR',
  VALIDATION: 'VALIDATION_ERROR',
  AUTHENTICATION: 'AUTHENTICATION_ERROR',
  AUTHORIZATION: 'AUTHORIZATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  SERVER: 'SERVER_ERROR',
  TIMEOUT: 'TIMEOUT_ERROR',
  UNKNOWN: 'UNKNOWN_ERROR'
};

// Parse API error
export const parseApiError = (error) => {
  // Network error
  if (!error.response) {
    return {
      type: ERROR_TYPES.NETWORK,
      message: ERROR_MESSAGES.NETWORK_ERROR,
      statusCode: null,
      details: error.message
    };
  }

  const { status, data } = error.response;

  // Authentication error
  if (status === 401) {
    return {
      type: ERROR_TYPES.AUTHENTICATION,
      message: data?.message || ERROR_MESSAGES.UNAUTHORIZED,
      statusCode: 401,
      details: data
    };
  }

  // Authorization error
  if (status === 403) {
    return {
      type: ERROR_TYPES.AUTHORIZATION,
      message: data?.message || ERROR_MESSAGES.UNAUTHORIZED,
      statusCode: 403,
      details: data
    };
  }

  // Not found error
  if (status === 404) {
    return {
      type: ERROR_TYPES.NOT_FOUND,
      message: data?.message || 'Resource not found',
      statusCode: 404,
      details: data
    };
  }

  // Validation error
  if (status === 422 || status === 400) {
    return {
      type: ERROR_TYPES.VALIDATION,
      message: data?.message || 'Validation failed',
      statusCode: status,
      details: data?.errors || data
    };
  }

  // Server error
  if (status >= 500) {
    return {
      type: ERROR_TYPES.SERVER,
      message: data?.message || ERROR_MESSAGES.SERVER_ERROR,
      statusCode: status,
      details: data
    };
  }

  // Unknown error
  return {
    type: ERROR_TYPES.UNKNOWN,
    message: data?.message || 'An error occurred',
    statusCode: status,
    details: data
  };
};

// Format error message
export const formatErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  
  const parsedError = parseApiError(error);
  return parsedError.message;
};

// Get validation errors
export const getValidationErrors = (error) => {
  const parsedError = parseApiError(error);
  
  if (parsedError.type !== ERROR_TYPES.VALIDATION) {
    return {};
  }

  const details = parsedError.details;
  
  if (Array.isArray(details)) {
    return details.reduce((acc, err) => {
      acc[err.field || err.path] = err.message;
      return acc;
    }, {});
  }

  if (typeof details === 'object') {
    return details;
  }

  return {};
};

// Handle error with notification
export const handleError = (error, showNotification = null) => {
  const parsedError = parseApiError(error);
  
  console.error('Error:', parsedError);
  
  if (showNotification) {
    showNotification(parsedError.message, { type: 'error' });
  }

  return parsedError;
};

// Log error to service
export const logError = async (error, context = {}) => {
  const parsedError = parseApiError(error);
  
  const errorLog = {
    ...parsedError,
    timestamp: new Date().toISOString(),
    context,
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Log:', errorLog);
  }

  // Send to error tracking service (e.g., Sentry)
  try {
    // await errorTrackingService.log(errorLog);
  } catch (err) {
    console.error('Failed to log error:', err);
  }

  return errorLog;
};

// Check if error is specific type
export const isNetworkError = (error) => {
  return parseApiError(error).type === ERROR_TYPES.NETWORK;
};

export const isAuthenticationError = (error) => {
  return parseApiError(error).type === ERROR_TYPES.AUTHENTICATION;
};

export const isValidationError = (error) => {
  return parseApiError(error).type === ERROR_TYPES.VALIDATION;
};

export const isServerError = (error) => {
  return parseApiError(error).type === ERROR_TYPES.SERVER;
};

// Retry handler
export const retryRequest = async (requestFn, maxRetries = 3, delay = 1000) => {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      
      // Don't retry on authentication or validation errors
      if (isAuthenticationError(error) || isValidationError(error)) {
        throw error;
      }
      
      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }
  
  throw lastError;
};

// Create error boundary handler
export const createErrorBoundary = (onError) => {
  return (error, errorInfo) => {
    logError(error, { componentStack: errorInfo.componentStack });
    if (onError) onError(error, errorInfo);
  };
};

export default {
  ERROR_TYPES,
  parseApiError,
  formatErrorMessage,
  getValidationErrors,
  handleError,
  logError,
  isNetworkError,
  isAuthenticationError,
  isValidationError,
  isServerError,
  retryRequest,
  createErrorBoundary
};
