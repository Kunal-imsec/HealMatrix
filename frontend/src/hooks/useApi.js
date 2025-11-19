import { useState, useCallback } from 'react';
import api from '../services/api';
import useNotification from './useNotification';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showError, showSuccess } = useNotification();

  // Generic API call handler
  const callApi = useCallback(async (apiFunction, options = {}) => {
    const { 
      showErrorNotification = true, 
      showSuccessNotification = false,
      successMessage = 'Operation completed successfully'
    } = options;

    try {
      setLoading(true);
      setError(null);
      
      const result = await apiFunction();
      
      if (showSuccessNotification) {
        showSuccess(successMessage);
      }
      
      return result;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      
      if (showErrorNotification) {
        showError(errorMessage);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [showError, showSuccess]);

  // GET request
  const get = useCallback(async (url, params = {}, options = {}) => {
    return callApi(() => api.get(url, { params }), options);
  }, [callApi]);

  // POST request
  const post = useCallback(async (url, data = {}, options = {}) => {
    return callApi(() => api.post(url, data), {
      showSuccessNotification: true,
      successMessage: 'Created successfully',
      ...options
    });
  }, [callApi]);

  // PUT request
  const put = useCallback(async (url, data = {}, options = {}) => {
    return callApi(() => api.put(url, data), {
      showSuccessNotification: true,
      successMessage: 'Updated successfully',
      ...options
    });
  }, [callApi]);

  // PATCH request
  const patch = useCallback(async (url, data = {}, options = {}) => {
    return callApi(() => api.patch(url, data), {
      showSuccessNotification: true,
      successMessage: 'Updated successfully',
      ...options
    });
  }, [callApi]);

  // DELETE request
  const del = useCallback(async (url, options = {}) => {
    return callApi(() => api.delete(url), {
      showSuccessNotification: true,
      successMessage: 'Deleted successfully',
      ...options
    });
  }, [callApi]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    callApi,
    get,
    post,
    put,
    patch,
    delete: del,
    clearError
  };
};

export default useApi;
