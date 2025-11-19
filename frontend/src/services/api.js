import axios from 'axios';

// Base API configuration - Vite uses import.meta.env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Check if this is an authentication endpoint that doesn't need token
    const isAuthEndpoint = config.url?.includes('/auth/login') || 
                          config.url?.includes('/auth/register') ||
                          config.url?.includes('/auth/forgot-password') ||
                          config.url?.includes('/auth/reset-password') ||
                          config.url?.includes('/auth/verify-email') ||
                          config.url?.includes('/auth/refresh-token');
    
    // Only add token for non-auth endpoints
    if (!isAuthEndpoint) {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() };
    
    // Add socket ID if available
    const socketId = localStorage.getItem('socketId');
    if (socketId) {
      config.headers['X-Socket-ID'] = socketId;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    // Log response time for debugging in development
    if (import.meta.env.DEV) {
      const endTime = new Date();
      const duration = endTime - response.config.metadata.startTime;
      console.log(`API ${response.config.method.toUpperCase()} ${response.config.url} - ${duration}ms`);
    }
    
    // Handle blob responses
    if (response.config.responseType === 'blob') {
      return response;
    }
    
    return response;
  },
  (error) => {
    const { response, config } = error;
    
    // Handle common HTTP errors
    if (response?.status === 401) {
      // Check if this is an authentication endpoint
      const isAuthEndpoint = config?.url?.includes('/auth/login') || 
                            config?.url?.includes('/auth/register') ||
                            config?.url?.includes('/auth/forgot-password') ||
                            config?.url?.includes('/auth/reset-password') ||
                            config?.url?.includes('/auth/verify-email');
      
      if (!isAuthEndpoint) {
        // Unauthorized - token expired or invalid (for protected endpoints)
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        localStorage.removeItem('loginTime');
        
        // Only redirect if not already on login page
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(new Error('Session expired. Please login again.'));
      }
      
      // For auth endpoints, return the actual error message from backend
      const errorMessage = response.data?.message || 
                          response.data?.error || 
                          'Invalid credentials. Please try again.';
      return Promise.reject(new Error(errorMessage));
    }
    
    if (response?.status === 403) {
      const errorMessage = response.data?.message || 
                          'Access denied. You don\'t have permission to perform this action.';
      return Promise.reject(new Error(errorMessage));
    }
    
    if (response?.status === 404) {
      const errorMessage = response.data?.message || 'Resource not found.';
      return Promise.reject(new Error(errorMessage));
    }
    
    if (response?.status === 422) {
      // Validation errors
      const errorMessage = response.data?.message || 
                          'Validation failed. Please check your input.';
      return Promise.reject(new Error(errorMessage));
    }
    
    if (response?.status === 429) {
      // Too many requests
      const errorMessage = response.data?.message || 
                          'Too many requests. Please try again later.';
      return Promise.reject(new Error(errorMessage));
    }
    
    if (response?.status === 503) {
      // Handle maintenance mode
      if (!window.location.pathname.includes('/maintenance')) {
        window.location.href = '/maintenance';
      }
      return Promise.reject(new Error('System under maintenance.'));
    }
    
    if (response?.status >= 500) {
      const errorMessage = response.data?.message || 
                          'Server error. Please try again later.';
      return Promise.reject(new Error(errorMessage));
    }
    
    // Network or other errors
    if (!response) {
      return Promise.reject(new Error('Network error. Please check your connection.'));
    }
    
    // Return specific error message from backend if available
    const errorMessage = response.data?.message || 
                        response.data?.error || 
                        error.message || 
                        'An unexpected error occurred';
    return Promise.reject(new Error(errorMessage));
  }
);

// API helper methods
export const apiHelpers = {
  // GET request
  get: async (url, config = {}) => {
    try {
      const response = await api.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // POST request
  post: async (url, data = {}, config = {}) => {
    try {
      const response = await api.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PUT request
  put: async (url, data = {}, config = {}) => {
    try {
      const response = await api.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // PATCH request
  patch: async (url, data = {}, config = {}) => {
    try {
      const response = await api.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // DELETE request
  delete: async (url, config = {}) => {
    try {
      const response = await api.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // File upload
  upload: async (url, formData, onUploadProgress = null) => {
    try {
      const response = await api.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Download file
  download: async (url, filename = null) => {
    try {
      const response = await api.get(url, {
        responseType: 'blob',
      });
      
      if (filename) {
        const blob = new Blob([response.data]);
        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(downloadUrl);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;
