// Centralized API utility for making authenticated requests

const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Make an authenticated API call
 * @param {string} endpoint - API endpoint (e.g., '/items', '/auth/admin/users')
 * @param {object} options - Fetch options (method, body, etc.)
 * @returns {Promise} - Response data
 */
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };
  
  const config = {
    ...options,
    headers,
  };
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Convenience methods
export const api = {
  get: (endpoint) => apiCall(endpoint, { method: 'GET' }),
  
  post: (endpoint, body) => apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  }),
  
  put: (endpoint, body) => apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  }),
  
  delete: (endpoint) => apiCall(endpoint, { method: 'DELETE' }),
};

export default api;

