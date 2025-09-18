import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Safe env access for Vite (avoid runtime errors if unavailable)
  const env = (typeof import.meta !== 'undefined' && import.meta.env) ? import.meta.env : {};
  const DEMO_MODE = String(env.VITE_DEMO || '').toLowerCase() === 'true';
  const API_URL = (env.VITE_API_URL ? `${env.VITE_API_URL}/auth` : 'http://localhost:5000/api/auth');

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
      } else {
        localStorage.removeItem('token');
        setToken(null);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
      setToken(null);
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
      setToken(data.token);
      setUser(data.user);
      
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, password, phone) => {
    if (DEMO_MODE) {
      // In demo, simulate registration requiring OTP
      return { requiresOtp: true, user: { id: 'demo_user_id', email } };
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

      // Registration now requires OTP verification
      return { requiresOtp: data.requiresOtp, user: data.user };
    } catch (error) {
      throw error;
    }
  };

  const verifyOtp = async (email, otp) => {
    if (DEMO_MODE) {
      // Do not auto-login after verification; just signal success
      return { success: true };
    }
    const response = await fetch(`${API_URL}/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'OTP verification failed');
    // Do not persist token; let user explicitly log in
    return { success: true };
  };

  const forgotPassword = async (email) => {
    if (DEMO_MODE) {
      return { message: 'Password reset email (demo) sent successfully' };
    }
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send reset email');
      }

      return data;
    } catch (error) {
      throw error;
    }
  };

  // googleLogin removed

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    forgotPassword,
    verifyOtp
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};