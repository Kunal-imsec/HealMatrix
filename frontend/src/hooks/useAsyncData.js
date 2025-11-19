import { useState, useEffect, useCallback } from 'react';

const useAsyncData = (asyncFunction, dependencies = [], options = {}) => {
  const {
    initialData = null,
    executeOnMount = true,
    onSuccess = null,
    onError = null
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Execute the async function
  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);

      const result = await asyncFunction(...args);
      setData(result);

      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);

      if (onError) {
        onError(err);
      }

      throw err;
    } finally {
      setLoading(false);
    }
  }, [asyncFunction, onSuccess, onError]);

  // Refetch data
  const refetch = useCallback(() => {
    return execute();
  }, [execute]);

  // Reset state
  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setLoading(false);
  }, [initialData]);

  // Execute on mount if enabled
  useEffect(() => {
    if (executeOnMount) {
      execute();
    }
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    data,
    loading,
    error,
    execute,
    refetch,
    reset,
    setData
  };
};

export default useAsyncData;
