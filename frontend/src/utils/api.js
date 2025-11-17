// Centralized API utility for making authenticated requests
// Default base is `/api` so endpoints that include `/v1/...` resolve to `/api/v1/...`.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Make an authenticated API call
 * @param {string} endpoint - API endpoint (e.g., '/items', '/auth/admin/users')
 * @param {object} options - Fetch options (method, body, etc.)
 * @returns {Promise} - Response data
 */
export const apiCall = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const config = { ...options, headers };

  try {
    //Ensure single slash between base and endpoint
    const response = await fetch(`${API_URL.replace(/\/$/, '')}${endpoint}`, config);

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        try {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user');
        } catch {}
        if (!String(endpoint).startsWith('/auth')) {
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }
      }
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
  post: (endpoint, body) => apiCall(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: (endpoint, body) => apiCall(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (endpoint) => apiCall(endpoint, { method: 'DELETE' }),
};

export default api;
