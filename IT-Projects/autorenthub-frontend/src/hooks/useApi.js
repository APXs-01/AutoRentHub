import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = useCallback(async (apiFunction, showSuccessToast = false, successMessage = 'Operation successful') => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiFunction();
      
      if (showSuccessToast) {
        toast.success(successMessage);
      }
      
      return response;
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    callApi,
    clearError
  };
};
