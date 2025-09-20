import React, { createContext, useState, useEffect } from 'react';
import { auth as fbAuth, RecaptchaVerifier, signInWithPhoneNumber } from '../config/firebase';

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

  // Register with phone using Firebase OTP flow
  const registerWithPhone = async ({ name, email, password, phone, idToken }) => {
    if (DEMO_MODE) {
      return { token: 'demo', user: { id: 'demo', name, email, phone, isVerified: true } };
    }
    const response = await fetch(`${API_URL}/register-with-phone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, idToken })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Phone registration failed');
    }
    localStorage.setItem('token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  // Start phone sign-in to send OTP (creates invisible recaptcha if needed)
  const sendPhoneOtp = async (phoneNumber, recaptchaContainerId = 'recaptcha-container') => {
    if (DEMO_MODE) return { verificationId: 'demo' };
    
    // Clean up existing verifier
    if (window.__recaptchaVerifier) {
      try {
        window.__recaptchaVerifier.clear();
      } catch (e) {
        console.log('Clearing existing verifier:', e.message);
      }
      window.__recaptchaVerifier = null;
    }
    
    // Ensure container exists
    let container = document.getElementById(recaptchaContainerId);
    if (!container) {
      // Create container if it doesn't exist
      container = document.createElement('div');
      container.id = recaptchaContainerId;
      container.style.marginTop = '8px';
      container.style.minHeight = '40px';
      // Find a good place to insert it
      const loginBox = document.querySelector('.login-box');
      if (loginBox) {
        loginBox.appendChild(container);
      }
    }
    
    // Clear container content
    container.innerHTML = '';
    
    try {
      // Wait a bit for DOM to be ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const verifier = new RecaptchaVerifier(fbAuth, recaptchaContainerId, { 
        size: 'invisible',
        callback: () => {
          console.log('reCAPTCHA solved');
        },
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
        }
      });
      
      await verifier.render();
      window.__recaptchaVerifier = verifier;
      
      const confirmationResult = await signInWithPhoneNumber(fbAuth, phoneNumber, verifier);
      window.__confirmationResult = confirmationResult;
      return { verificationId: confirmationResult.verificationId };
    } catch (error) {
      console.error('reCAPTCHA error:', error);
      
      // If it's a container error, try to recreate
      if (error.message.includes('container') || error.message.includes('element')) {
        console.log('Attempting to recreate reCAPTCHA container...');
        // Remove existing container
        const existingContainer = document.getElementById(recaptchaContainerId);
        if (existingContainer) {
          existingContainer.remove();
        }
        
        // Create new container
        const newContainer = document.createElement('div');
        newContainer.id = recaptchaContainerId;
        newContainer.style.marginTop = '8px';
        newContainer.style.minHeight = '40px';
        
        const loginBox = document.querySelector('.login-box');
        if (loginBox) {
          loginBox.appendChild(newContainer);
        }
        
        throw new Error('reCAPTCHA container issue. Please try again.');
      }
      
      throw new Error('Failed to initialize reCAPTCHA. Please refresh the page and try again.');
    }
  };

  // Verify OTP code and get Firebase ID token
  const verifyPhoneOtp = async (code) => {
    if (DEMO_MODE) return { idToken: 'demo' };
    const confirmationResult = window.__confirmationResult;
    if (!confirmationResult) throw new Error('OTP session not initialized');
    const credential = await confirmationResult.confirm(code);
    const idToken = await credential.user.getIdToken();
    return { idToken };
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
    
    // Clean up reCAPTCHA
    if (window.__recaptchaVerifier) {
      try {
        window.__recaptchaVerifier.clear();
      } catch (e) {
        console.log('Clearing reCAPTCHA on logout:', e.message);
      }
      window.__recaptchaVerifier = null;
    }
    window.__confirmationResult = null;
  };

  // Clean up reCAPTCHA when component unmounts
  useEffect(() => {
    return () => {
      if (window.__recaptchaVerifier) {
        try {
          window.__recaptchaVerifier.clear();
        } catch (e) {
          console.log('Clearing reCAPTCHA on unmount:', e.message);
        }
        window.__recaptchaVerifier = null;
      }
      window.__confirmationResult = null;
    };
  }, []);

  const value = {
    user,
    token,
    loading,
    login,
    register,
    registerWithPhone,
    sendPhoneOtp,
    verifyPhoneOtp,
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