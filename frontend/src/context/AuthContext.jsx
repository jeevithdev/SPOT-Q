import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user from localStorage if available
    const storedUser = localStorage.getItem('user');
    if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Safe env access for Vite
  const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};
  const API_URL = env.VITE_API_URL ? `${env.VITE_API_URL}/auth` : '/api/v1/auth';

  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await fetch(`${API_URL}/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.user) {
          setUser(data.user);
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          throw new Error('Invalid response format');
        }
      } else if (response.status === 401 || response.status === 403) {
        // Token is invalid/expired
        console.log('Token is invalid or expired, logging out');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      } else {
        // Server error - try to decode token locally
        console.error('Server error during token verification, status:', response.status);
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const isExpired = payload.exp * 1000 < Date.now();
          if (isExpired) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          } else {
            // Token still valid locally, use stored user
            const storedUser = localStorage.getItem('user');
            if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
              try {
                setUser(JSON.parse(storedUser));
              } catch (error) {
                setUser({ id: payload.userId });
              }
            }
          }
        } catch (decodeError) {
          console.error('Could not decode token:', decodeError);
        }
      }
    } catch (error) {
      // Network error - try to use token locally
      console.error('Network error during token verification:', error);
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isExpired = payload.exp * 1000 < Date.now();
        if (isExpired) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        } else {
          // Token still valid locally, use stored user
          const storedUser = localStorage.getItem('user');
          if (storedUser && storedUser !== 'undefined' && storedUser !== 'null') {
            try {
              setUser(JSON.parse(storedUser));
            } catch (error) {
              setUser({ id: payload.userId });
            }
          }
        }
      } catch (decodeError) {
        console.error('Could not decode token:', decodeError);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      }
    }
    setLoading(false);
  };

  const login = async (employeeId, password) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ employeeId, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAdmin: user?.role === 'admin' || user?.department === 'Admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
