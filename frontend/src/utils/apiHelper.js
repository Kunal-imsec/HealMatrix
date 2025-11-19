// Helper to try both v1 and non-v1 endpoints
export const fetchFromAPI = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  const baseURL = 'http://localhost:8080';
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers
    },
    ...options
  };

  // Try v1 endpoint first
  try {
    const v1Response = await fetch(`${baseURL}/api/v1${endpoint}`, defaultOptions);
    if (v1Response.ok) {
      const data = await v1Response.json();
      // Handle ApiResponse wrapper format
      return data.data || data;
    }
  } catch (error) {
    console.log(`v1 endpoint failed, trying normal: ${error.message}`);
  }

  // Fallback to normal endpoint
  try {
    const normalResponse = await fetch(`${baseURL}/api${endpoint}`, defaultOptions);
    if (normalResponse.ok) {
      const data = await normalResponse.json();
      return data.data || data;
    }
    throw new Error('Both endpoints failed');
  } catch (error) {
    console.error('API fetch failed:', error);
    throw error;
  }
};
