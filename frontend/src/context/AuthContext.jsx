import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user from localStorage if available
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Safe env access for Vite (avoid runtime errors if unavailable)
  const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};
  const DEMO_MODE = String(env.VITE_DEMO || '').toLowerCase() === 'true';
  // Use Vite proxy in development (relative URL), or configured API URL in production
  const API_URL = env.VITE_API_URL ? `${env.VITE_API_URL}/auth` : '/api/auth';

  useEffect(() => {
    if (DEMO_MODE) {
      // In demo mode, restore mock user from localStorage if present
      const storedUser = localStorage.getItem('demo_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
      return;
    }
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, [token, DEMO_MODE]);

  const verifyToken = async () => {
    if (DEMO_MODE) {
      // No backend verification in demo
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`${API_URL}/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        localStorage.setItem('user', JSON.stringify(userData.user));
      } else if (response.status === 401 || response.status === 403) {
        // Only clear token if it's explicitly invalid/expired
        console.log('Token is invalid or expired, logging out');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      } else {
        // For other errors (500, etc.), keep the token but don't set user
        console.error('Server error during token verification, status:', response.status);
        // Optionally: Try to decode token locally to check if it's expired
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const isExpired = payload.exp * 1000 < Date.now();
          if (isExpired) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setToken(null);
            setUser(null);
          } else {
            // Token still valid locally, use stored user or create minimal one
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              setUser(JSON.parse(storedUser));
            } else {
              setUser({ id: payload.userId });
            }
          }
        } catch (decodeError) {
          // If we can't decode, keep logged out but don't remove token yet
          console.error('Could not decode token:', decodeError);
        }
      }
    } catch (error) {
      // Network error - keep token and try to use it locally
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
          // Token still valid locally, use stored user or create minimal one
          const storedUser = localStorage.getItem('user');
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          } else {
            setUser({ id: payload.userId });
          }
        }
      } catch (decodeError) {
        // If we can't decode, assume invalid and remove
        console.error('Could not decode token:', decodeError);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      }
    }
    setLoading(false);
  };

  const login = async (email, password) => {
    if (DEMO_MODE) {
      const mockUser = {
        id: 'demo_user_id',
        name: email.split('@')[0] || 'Demo User',
        email,
        provider: 'local',
        isVerified: true,
      };
      const mockToken = 'demo_token_' + Date.now();
      localStorage.setItem('token', mockToken);
      localStorage.setItem('demo_user', JSON.stringify(mockUser));
      setToken(mockToken);
      setUser(mockUser);
      return { token: mockToken, user: mockUser };
    }
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, password, phone) => {
    if (DEMO_MODE) {
      // In demo, simulate successful registration (no auto-login)
      return { success: true, message: 'Registration successful' };
    }
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Don't auto-login - user needs to log in manually after registration
      return data;
    } catch (error) {
      throw error;
    }
  };


  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('demo_user'); // Also clear demo user if present
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};